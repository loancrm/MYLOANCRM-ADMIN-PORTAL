import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';
import { RoutingService } from 'src/app/services/routing-service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-loanleadsevaluatecredit',
  templateUrl: './loanleadsevaluatecredit.component.html',
  styleUrl: './loanleadsevaluatecredit.component.scss'
})
export class LoanleadsevaluatecreditComponent {
  leadData: any;
  loading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  leadId: any;
  netSalary: number;
  obligations: number;
  ccOutstanding: number;
  plFoir: number;
  fiorValues: any = {};
  plEligibleEmi: number;

  breadCrumbItems: any = [];
  constructor(
    private location: Location,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService

  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.leadId = params['id'];
        this.getLeadById(this.leadId);
        this.getDscrValuesById(this.leadId).then((data) => {
          if (data) {
            this.setDscrValuesData();
            this.setAverageSalary();
          }
        });
      }
    });
  }


  getLeadById(leadId: any): void {
    this.leadsService.getLoanLeadById(leadId).subscribe(
      (leadData: any) => {
        this.leadData = leadData;
        // console.log('leadData', leadData);
        this.updateBreadcrumb();
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }
  setAverageSalary(): void {
    const paySlips = this.leadData[0]?.paySlips;
    if (!paySlips || paySlips.length === 0) {
      this.netSalary = 0;
      return;
    }

    const total = paySlips.reduce((sum, slip) => {
      const salary = parseFloat(slip.salary);
      return sum + (isNaN(salary) ? 0 : salary);
    }, 0);

    this.netSalary = Math.round(total / paySlips.length);
  }
  setDscrValuesData() {
    this.netSalary = this.fiorValues.netSalary || 0;
    this.obligations = this.fiorValues.obligations || 0;
    this.ccOutstanding = this.fiorValues.ccOutstanding || 0;
    this.plFoir = this.fiorValues.plFoir || 0;
    this.plEligibleEmi = this.fiorValues.plEligibleEmi || 0;
  }
  updateBreadcrumb(): void {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Credit Evaluation',
        routerLink: '/user/credit',
        queryParams: { v: this.version },
      },
      { label: this.leadData?.businessName || 'Lead Details' },
    ];
  }
  getDscrValuesById(leadId) {
    return new Promise((resolve, reject) => {
      this.leadsService.getDscrValuesById(leadId).subscribe(
        (data: any) => {
          this.fiorValues = data;
          // console.log('dscrValues,', this.fiorValues);
          resolve(true);
        },
        (error) => {
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }
  calculateEligibleEmi() {
    if (
      this.netSalary != null &&
      this.obligations != null &&
      this.plFoir != null
    ) {
      let adjustedNetSalary = this.netSalary;

      // Deduct 4% of credit card outstanding if it exists
      if (this.ccOutstanding && this.ccOutstanding > 0) {
        const ccDeduction = this.ccOutstanding * 0.04;
        adjustedNetSalary -= ccDeduction;
      }

      const incomeAfterObligations = adjustedNetSalary - this.obligations;
      this.plEligibleEmi = +(incomeAfterObligations * (this.plFoir / 100)).toFixed(2);
    } else {
      this.plEligibleEmi = 0;
    }

    const formData = {
      netSalary: this.netSalary,
      obligations: this.obligations,
      ccOutstanding: this.ccOutstanding,
      plFoir: this.plFoir,
      plEligibleEmi: this.plEligibleEmi,
    };
    // console.log('Form Data:', formData);
    this.loading = true;
    this.leadsService.calculateEligibleEmi(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        if (data?.success) {
          this.toastService.showSuccess('Calculated and saved Successfully');
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  // sendLeadToReadyToLogin(lead) {
  //   this.changeLoanLeadStatus(lead[0].leadId, 11);
  //   const id = lead[0].leadId;
  //   const targetUrl = `user/logins/bankSelection/${id}`;
  //   this.router.navigateByUrl(targetUrl);
  // }

  sendLeadToReadyToLogin(lead) {
    this.changeLoanLeadStatus(lead[0].leadId, 11);
    const loanType = lead[0].loanType; // e.g., 'personalloan', 'home loan', etc.
    // console.log(loanType)
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`logins/bankSelection/${loanType}/${lead[0].leadId}`, null);
    }
  }
  sendLeadToReject(lead) {
    this.changeLoanLeadStatus(lead[0].leadId, 10);
    // const targetUrl = `user/rejects`;
    // this.router.navigateByUrl(targetUrl);
    this.routingService.handleRoute('rejects', null);
  }
  changeLoanLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        // this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  isValidDate(date: any): boolean {
    return date && !isNaN(new Date(date).getTime());
  }

  goBack(): void {
    this.location.back();
  }
}



