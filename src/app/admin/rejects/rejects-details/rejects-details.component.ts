import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';

@Component({
  selector: 'app-rejects-details',
  templateUrl: './rejects-details.component.html',
  styleUrl: './rejects-details.component.scss',
})
export class RejectsDetailsComponent implements OnInit {
  breadCrumbItems: any = [];
  leads: any = null;
  loading: any;
  leadId: string | null = null;
  version = projectConstantsLocal.VERSION_DESKTOP;
  rejectedFilesInProcess: any[] = [];
  bankRejectesData: any[] = [];
  filesInProcessDetails: any[] = [];
  displayedItems: any = [];
  constructor(
    private location: Location,

    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Rejects',
        routerLink: '/user/rejects',
        queryParams: { v: this.version },
      },
      { label: 'Rejects Details' },
    ];
  }

  ngOnInit(): void {
    // this.leadId = this.route.snapshot.paramMap.get('id');
    // if (this.leadId) {
    //   this.getLeadById(this.leadId);
    //   this.getBankRejectsDetailsById(this.leadId);
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
      this.getBankRejectsDetailsById(this.leadId);
    }
  }
  getBankRejectsDetailsById(leadId: string): void {
    this.leadsService.getBankRejectsDetailsById(leadId).subscribe(
      (response: any) => {
        // console.log('Response data:', response);
        this.bankRejectesData = response;
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
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
  shouldDisplayBlock(): boolean {
    const lead = this.leads?.[0];
    if (!lead) return false;
    const isSelfEmployedHomeOrLap =
      (lead.loanType === 'homeLoan' || lead.loanType === 'lap') &&
      lead.employmentStatus === 'self-employed';
    const loanTypeNotExists = !('loanType' in lead);
    return isSelfEmployedHomeOrLap || loanTypeNotExists;
  }
  goBack() {
    this.location.back();
  }
}
