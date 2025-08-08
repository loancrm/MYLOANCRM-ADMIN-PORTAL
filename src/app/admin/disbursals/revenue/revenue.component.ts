import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from '../../../services/routing-service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
})
export class RevenueComponent implements OnInit {
  leads: any = null;
  bankMap = new Map<number, string>();
  banks: any = [];
  loading: any;
  totalRevenueValue: number = 0;
  leadId: string | null = null;
  breadCrumbItems: any = [];
  displayedItems: any = [];
  disbursalDetails: any[] = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Disbursals',
        routerLink: '/user/disbursals',
        queryParams: { v: this.version },
      },
      { label: 'Revenue Details' },
    ];
    this.getBankers();
  }
  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    // if (this.leadId) {
    //   this.getLeadById(this.leadId);
    //   this.getDisbursalsDetailsById(this.leadId);
    // }
    this.leadId = this.route.snapshot.paramMap.get('id');
    const status = this.route.snapshot.paramMap.get('status');
    if (this.leadId) {
      if (!status) {
        this.getLeadById(this.leadId);
      } else {
        const validStatuses = ['personalLoan', 'homeLoan', 'lap'];
        if (validStatuses.includes(status)) {
          this.getLoanLeadById(this.leadId);
        } else {
          console.warn('Unknown status:', status);
          this.getLeadById(this.leadId);
        }
      }
      this.getDisbursalsDetailsById(this.leadId);
    }
  }
  sumRevenueValues(disbursals: any[]): number {
    if (!disbursals || disbursals.length === 0) {
      return 0;
    }
    return disbursals.reduce((total, disbursal) => {
      return total + (disbursal.revenueValue || 0);
    }, 0);
  }
  getLoanLeadById(leadId: any): void {
    this.leadsService.getLoanLeadById(leadId).subscribe(
      (data: any) => {
        this.leads = data;
        this.updateDisplayedItems();
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.leads && this.leads[0].employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      // { data: this.leads[0], displayProperty: 'businessName' },
      { data: this.leads[0], displayProperty: loanDisplayProperty },
    ];
  }
  getBankers(filter = {}) {
    this.loading = true;
    this.leadsService.getBankers(filter).subscribe(
      (response: any) => {
        this.banks = [{ name: 'All' }, ...response];
        this.bankMap.clear();
        for (const bank of response) {
          if (bank.id && bank.name) {
            this.bankMap.set(bank.id, bank.name);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getDisbursalsDetailsById(leadId) {
    this.loading = true;
    this.leadsService.getDisbursalsDetailsById(leadId).subscribe(
      (lead: any) => {
        this.disbursalDetails = lead;
        this.totalRevenueValue = this.sumRevenueValues(this.disbursalDetails);
        // console.log('Disbursal details:', this.disbursalDetails);
        // console.log('Total Revenue Value:', this.totalRevenueValue);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  updateCalculatedRevenue(rowData: any): void {
    rowData.revenueValue =
      (rowData.sanctionedAmount * rowData.payoutValue) / 100;
  }
  shouldDisplayBlock(): boolean {
    const lead = this.leads?.[0];
    if (!lead) return false;
    const isSelfEmployedHomeOrLap =
      (lead.loanType === 'homeLoan' || lead.loanType === 'lap') &&
      lead.employmentStatus === 'self-employed';
    const loanTypeNotExists = !('loanType' in lead);
    return isSelfEmployedHomeOrLap || loanTypeNotExists;
  }
  goBack(): void {
    this.location.back();
  }
  getLeadById(id: string) {
    this.leadsService.getLeadDetailsById(id).subscribe(
      (lead) => {
        this.leads = lead;
        this.updateDisplayedItems();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  saveFormData(): void {
    const formData = this.disbursalDetails.map((detail) => ({
      id: detail.id,
      payoutValue: detail.payoutValue,
      revenueValue: detail.revenueValue,
    }));
    // console.log(formData);
    this.loading = true;
    this.leadsService.updateRevenueDetails(this.leadId, formData).subscribe(
      (response: any) => {
        this.loading = false;
        this.toastService.showSuccess('Revenue info Saved Successfully');
        // const targetUrl = `user/disbursals`;
        // this.router.navigateByUrl(targetUrl);
        this.routingService.handleRoute('disbursals', null);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLenderName(bankId: number): string {
    return this.bankMap.get(bankId) || '';
  }
}
