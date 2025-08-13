import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/services/routing-service';
import { LeadsService } from '../../leads/leads.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  planForm: UntypedFormGroup;
  loading: any;
  planId: any;
  plansData: any;
  heading: any = 'Create Plan';
  actionType: any = 'create';
  submitted = false
  billingCycleOptions = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' }
  ];
  planTypes = [
    { label: 'Free', value: 'Free' },
    { label: 'Basic', value: 'Basic' },
    { label: 'Premium', value: 'Premium' }
  ];
  gstApplicableOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ];

  constructor(private location: Location, private fb: FormBuilder,
    private toastService: ToastService, private activatedRoute: ActivatedRoute, private routingService: RoutingService,
    private leadsService: LeadsService,
  ) {

    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.planId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Lead';
        this.getLeadDetailsById().then((data) => {
          if (data) {
            // console.log('plansData', this.plansData);
            this.planForm.patchValue({
              planId: this.plansData[0]?.planId,
              plan_name: this.plansData[0]?.plan_name,
              plan_type: this.plansData[0]?.plan_type,
              billing_cycle: this.plansData[0]?.billing_cycle,
              price: this.plansData[0]?.price,
              duration_days: this.plansData[0]?.duration_days,
              features: this.plansData[0]?.features,
              gst_applicable: this.plansData[0]?.gst_applicable,
              gst_percentage: this.plansData[0]?.gst_percentage,

            });

          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.createForm();
  }


  createForm() {
    this.planForm = this.fb.group({
      planId: ['', Validators.required],
      plan_name: ['', Validators.required],
      plan_type: ['', Validators.required],
      billing_cycle: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration_days: [0, Validators.required],
      features: ['', Validators.required],
      gst_applicable: [0, Validators.required],
      gst_percentage: [0],
    });

  }


  onSubmit(formValues) {
    this.submitted = true;
    if (this.planForm.invalid) {
      return
    }
    let formData: any = {
      planId: formValues.planId,
      plan_name: formValues.plan_name,
      plan_type: formValues.plan_type,
      billing_cycle: formValues.billing_cycle,
      price: formValues.price,
      duration_days: formValues.duration_days,
      features: formValues.features,
      gst_applicable: formValues.gst_applicable,
      gst_percentage: formValues.gst_percentage,
    };
    if (this.actionType == 'create') {
      this.loading = true;
      this.leadsService.createPlan(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Lead Created Successfully');
            this.routingService.handleRoute('subscription-plans', null);
          }
        },
        (error: any) => {
          this.loading = false;
          // console.log(error);
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      // console.log(formData);
      this.leadsService.updatePlan(this.planId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Lead Updated Successfully');
            this.routingService.handleRoute('subscription-plans', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  getLeadDetailsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getPlanById(this.planId, filter).subscribe(
        (plansData) => {
          this.plansData = plansData;
          console.log(this.plansData)
          this.loading = false;
          resolve(true);
        },
        (error: any) => {
          this.loading = false;
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }
  goBack() {
    this.location.back();
  }
}
