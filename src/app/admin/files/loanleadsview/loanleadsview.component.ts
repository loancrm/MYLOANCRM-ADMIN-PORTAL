import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-loanleadsview',
  templateUrl: './loanleadsview.component.html',
  styleUrl: './loanleadsview.component.scss',
})
export class LoanleadsviewComponent {
  loading: any;
  leadId: any;
  loanleads: any;
  displayedItems: any = [];
  breadCrumbItems: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.leadId = params['id'];
        this.getLoanLeadById(this.leadId);
      }
    });
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Files',
        routerLink: '/user/files',
        queryParams: { v: this.version },
      },
      { label: 'Uploaded  Files' },
    ];
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.loanleads && this.loanleads[0]?.employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      { data: this.loanleads, displayProperty: loanDisplayProperty },
    ];
  }
  getLoanLeadById(leadId) {
    return new Promise((resolve, reject) => {
      this.leadsService.getLoanLeadById(leadId).subscribe(
        (response: any) => {
          this.loanleads = response;
          // console.log(this.loanleads);
          this.updateDisplayedItems();
          resolve(true);
        },
        (error) => {
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }
  goBack(): void {
    this.location.back();
  }
}
