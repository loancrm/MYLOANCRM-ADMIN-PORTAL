import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-in-house-details',
  templateUrl: './in-house-details.component.html',
  styleUrl: './in-house-details.component.scss',
})
export class InHouseDetailsComponent {
  breadCrumbItems: any = [];
  leads: any = null;
  creditSummary: any = null;
  version = projectConstantsLocal.VERSION_DESKTOP;
  leadId: string | null = null;
  loading: any;
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
      { label: 'In house Rejects Details' },
    ];
  }

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLeadById(this.leadId);
      this.getCreditSummary(this.leadId);
    }
  }

  getLeadById(id: string) {
    this.leadsService.getLeadDetailsById(id).subscribe(
      (lead) => {
        this.leads = lead;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getCreditSummary(id: string) {
    this.leadsService.getCreditSummary(id).subscribe(
      (lead) => {
        this.creditSummary = lead;
        // console.log(this.creditSummary);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
