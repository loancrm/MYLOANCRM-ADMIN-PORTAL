import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from '../../leads/leads.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.scss',
})
export class ReportListComponent {
  breadCrumbItems: any = [];
  reportsData: any = [];
  loading: any;
  currentTableEvent: any;
  reportsCount: any = 0;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private routingService: RoutingService,
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
        label: 'Reports',
        routerLink: '/user/reports',
        queryParams: { v: this.version },
      },
      { label: 'Saved Reports' },
    ];
  }
  loadReports(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      // console.log(api_filter);
      this.getReportsCount(api_filter);
      this.getReports(api_filter);
    }
  }
  getReportsCount(filter = {}) {
    this.leadsService.getReportsCount(filter).subscribe(
      (response) => {
        this.reportsCount = response;
        // console.log(this.reportsCount);
      },
      (error: any) => {
        this.toastService.showError('error occurs');
      }
    );
  }
  getReports(filter = {}) {
    this.loading = true;
    this.leadsService.getReports(filter).subscribe(
      (response) => {
        this.reportsData = response;
        // console.log(this.reportsData);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
