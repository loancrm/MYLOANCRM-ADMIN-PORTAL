import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadsService } from '../admin/leads/leads.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastService } from '../services/toast.service';
import { DateTimeProcessorService } from '../services/date-time-processor.service';
import { projectConstantsLocal } from '../constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';

declare var Razorpay: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  accountId = 0;
  user: any;
  plans: any[] = [];
  displayPlans: any[] = [];
  selectedPlan: any = null;
  isYearly = false;
  displayDialog = false;
  moment: any;
  loading: boolean = false;
  constructor(
    private router: Router,
    private subscriptionService: LeadsService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }

  ngOnInit(): void {
    this.loadPlans();
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails?.user?.accountId) {
      this.accountId = userDetails.user.accountId;
      this.user = userDetails.user;
    } else {
      this.toastService.showError('User not found. Please login again.');
      this.router.navigate(['/user/login']);
    }
  }

  loadPlans(): void {
    this.subscriptionService.getSubscriptionPlans().subscribe({
      next: (data: any) => {
        console.log(data)
        this.plans = data.map(plan => ({
          ...plan,
          features: typeof plan.features === 'string' ? plan.features.split(',') : plan.features,
          iconClass: this.getIcon(plan.plan_name)
        }));
        this.updateDisplayPlans();
      },
      error: () => this.toastService.showError('Failed to load subscription plans.')
    });
  }

  updateDisplayPlans(): void {
    const cycle = this.isYearly ? 'Yearly' : 'Monthly';
    this.displayPlans = this.plans.filter(p => p.billing_cycle === cycle);
  }

  togglePricing(yearly: boolean): void {
    this.isYearly = yearly;
    this.updateDisplayPlans();
  }

  getIcon(planName: string): string {
    if (planName.includes('Professional')) return 'fas fa-star';
    if (planName.includes('Basic')) return 'fas fa-layer-group';
    return 'fas fa-bolt';
  }

  showPlanSummary(plan: any): void {
    const gstRate = plan.gst_applicable ? (plan.gst_percentage || 0) : 0;
    const basePrice = plan.price || 0;
    const gstAmount = +(basePrice * gstRate / 100).toFixed(2);
    const totalAmount = +(basePrice + gstAmount).toFixed(2);
    this.selectedPlan = {
      ...plan,
      gst_percentage: gstRate,
      basePrice,
      gstAmount,
      totalAmount
    };
    this.displayDialog = true;
  }

  subscribeToPlan(plan: any): void {
    if (plan.plan_type === 'Free') {
      this.createSubscription(plan);
      return;
    }

    const gstRate = plan.gst_applicable ? (plan.gst_percentage || 0) : 0;
    const baseAmount = plan.price || 0;
    const gstAmount = +(baseAmount * gstRate / 100).toFixed(2);
    const totalAmount = +(baseAmount + gstAmount).toFixed(2);

    plan.totalPayable = totalAmount;
    plan.gstAmount = gstAmount;
    plan.gst_percentage = gstRate;
    this.subscriptionService.createRazorpayOrder(totalAmount).subscribe({
      next: (order: any) => this.launchRazorpay(order, plan),
      error: () => this.toastService.showError('Failed to initiate payment.')
    });
  }

  launchRazorpay(order: any, plan: any): void {
    const options = {
      key: projectConstantsLocal.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'MYLOANCRM',
      description: plan.plan_name,
      order_id: order.id,
      handler: (response: any) => this.verifyPayment(response, plan),
      prefill: {
        name: this.user.name,
        email: this.user.email,
        contact: this.user.phone
      },
      theme: { color: '#3399cc' }
    };

    try {
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (e) {
      this.toastService.showError('Razorpay failed to load. Please try again.');
    }
  }

  verifyPayment(paymentResponse: any, plan: any): void {
    this.loading = true;
    const subscriptionData = {
      accountId: this.accountId,
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      price: plan.price,
      gst_percentage: plan.gst_percentage || 0,
      gst_amount: plan.gstAmount || 0,
      total_amount: plan.totalPayable || plan.price,
      durationDays: plan.duration_days,
      auto_renew: 1,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_signature: paymentResponse.razorpay_signature
    };

    this.subscriptionService.verifyAndStoreSubscription(subscriptionData).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.showSuccess(`${plan.plan_name} activated!`);
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError(err)
      }
    });
  }

  createSubscription(plan: any): void {
    const subscriptionData = {
      accountId: this.accountId,
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      price: plan.price,
      durationDays: plan.duration_days,
      auto_renew: 1
    };

    this.subscriptionService.createSubscription(subscriptionData).subscribe({
      next: (response) => {
        // console.log('Subscription response:', response);
        this.toastService.showSuccess('Free Trial Activated!');
        // this.router.navigate(['/user/dashboard']);
        this.routingService.handleRoute('user/dashboard', null);
      },
      error: (err) => this.toastService.showError(err)
    });
  }
}
