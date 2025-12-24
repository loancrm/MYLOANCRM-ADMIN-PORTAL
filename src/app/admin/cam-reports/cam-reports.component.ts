import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Location } from '@angular/common';

import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';

@Component({
  selector: 'app-cam-reports',
  templateUrl: './cam-reports.component.html',
  styleUrl: './cam-reports.component.scss',
})
export class CamReportsComponent {
  @ViewChild('dt') dt!: Table;
  reports: any[] = [];
  loading = false;
  accountId: any;

  constructor(
    private leadsService: LeadsService,

    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private routingService: RoutingService,
    private location: Location
  ) {}

  ngOnInit() {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.accountId = userDetails?.user?.accountId;
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    // console.log(this.accountId)

    this.leadsService.getBSAReports().subscribe({
      next: (res: any) => {
        this.reports = res?.reports || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading BSA reports:', err);
        this.toastService.showError({ error: 'Failed to load BSA reports' });
        this.loading = false;
      },
    });
  }

  getStatusClass(status: string): string {
    const statusUpper = status?.toUpperCase() || '';
    switch (statusUpper) {
      case 'ANALYSED':
        return 'p-tag-success';
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return 'p-tag-warning';
      case 'FAILED':
      case 'ERROR':
        return 'p-tag-danger';
      case 'PENDING':
        return 'p-tag-info';
      default:
        return 'p-tag-secondary';
    }
  }

  getAccountTypeName(type: number): string {
    switch (type) {
      case 1:
        return 'Savings';
      case 2:
        return 'Current';
      case 3:
        return 'OD/CC';
      default:
        return 'N/A';
    }
  }

  viewReport(reportId: string) {
    this.routingService.handleRoute(
      `cam-reports/bank-report/${reportId}`,
      null
    );
  }

  goBack() {
    this.routingService.handleRoute('bsanalyzer', null);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }
}
