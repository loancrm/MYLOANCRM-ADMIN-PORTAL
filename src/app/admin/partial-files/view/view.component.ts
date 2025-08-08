import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  // leadId: any;
  // leadData: any;
  // loading: any;
  // createdOn: any;
  // leadDocuments: any = {};
  // breadCrumbItems: any = [];
  // version = projectConstantsLocal.VERSION_DESKTOP;
  // constructor(
  //   private location: Location,
  //   private toastService: ToastService,
  //   private activatedRoute: ActivatedRoute,
  //   private leadsService: LeadsService
  // ) {}

  // ngOnInit(): void {
  //   this.activatedRoute.params.subscribe((params) => {
  //     if (params && params['id']) {
  //       this.leadId = params['id'];
  //       this.getLeadById(this.leadId);
  //       this.getLeadDocumentsById(this.leadId).then((data) => {
  //         if (data) {
  //           console.log('Lead documents loaded');
  //         }
  //       });
  //     }
  //   });

  //   this.breadCrumbItems = [
  //     {
  //
  //       label: ' Home',
  //       routerLink: '/user/dashboard',
  //       queryParams: { v: this.version },
  //     },
  //     {
  //       label: 'partial',
  //       routerLink: '/user/partial',
  //       queryParams: { v: this.version },
  //     },
  //     { label: 'Uploaded Partial Files' },
  //   ];
  // }

  // getLeadById(leadId: any): void {
  //   this.leadsService.getLeadDetailsById(leadId).subscribe(
  //     (leadData: any) => {
  //       this.leadData = leadData;
  //       console.log('leadData', leadData);
  //       this.updateBreadcrumb();
  //       this.loading = false;
  //     },
  //     (error) => {
  //       this.toastService.showError(error);
  //       this.loading = false;
  //     }
  //   );
  // }

  // getLeadDocumentsById(leadId: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.leadsService.getLeadDocumentsById(leadId).subscribe(
  //       (leadDocuments: any) => {
  //         this.leadDocuments = leadDocuments;
  //         console.log('lead documents:', leadDocuments);
  //         resolve(true);
  //       },
  //       (error) => {
  //         resolve(false);
  //         this.toastService.showError(error);
  //       }
  //     );
  //   });
  // }

  // updateBreadcrumb(): void {
  //   this.breadCrumbItems = [
  //     {
  //
  //       label: ' Home',
  //       routerLink: '/user/dashboard',
  //       queryParams: { v: this.version },
  //     },
  //     {
  //       label: 'partial',
  //       routerLink: '/user/partial',
  //       queryParams: { v: this.version },
  //     },
  //     { label: this.leadData?.businessName || 'Uploaded Partial Files' },
  //   ];
  // }

  // getFinancialYear(yearsAgo: number = 0): string {
  //   const currentYear = new Date().getFullYear();
  //   const startYear = currentYear - yearsAgo - 1;
  //   const endYear = startYear + 1;
  //   return `AY ${startYear}-${endYear}`;
  // }

  // goBack(): void {
  //   this.location.back();
  // }
}
