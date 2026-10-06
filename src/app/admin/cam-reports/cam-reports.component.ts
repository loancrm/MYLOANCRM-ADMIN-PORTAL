import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';

import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { REPORT_DATE_TIME_FORMAT } from '../credit-cam-reports/report-date-format';

@Component({
  selector: 'app-cam-reports',
  templateUrl: './cam-reports.component.html',
  styleUrl: './cam-reports.component.scss',
  providers: [DatePipe],
})
export class CamReportsComponent {
  @ViewChild('dt') dt!: Table;
  reports: any[] = [];
  loading = false;
  accountId: any;
  readonly dateTimeFormat = REPORT_DATE_TIME_FORMAT;

  constructor(
    private leadsService: LeadsService,

    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private routingService: RoutingService,
    private location: Location,
    private router: Router,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.accountId = userDetails?.user?.accountId;
    this.loadReports();
  }

  /** True when shown as a tab inside Credit & CAM Reports — the container
   * already provides the back button and page title. */
  get embedded(): boolean {
    return this.router.url.includes('/credit-cam-reports');
  }

  loadReports() {
    this.loading = true;

    this.leadsService.getBSAReports().subscribe({
      next: (res: any) => {
        const list = res?.reports || res || [];
        this.reports = [...list].sort(
          (a: any, b: any) =>
            new Date(b.createdOn || 0).getTime() -
            new Date(a.createdOn || 0).getTime(),
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading BSA reports:', err);
        this.toastService.showError({ error: 'Failed to load BSA reports' });
        this.loading = false;
      },
    });
  }

  getStatusKey(status: string): string {
    const statusUpper = (status || 'PENDING').toUpperCase();
    switch (statusUpper) {
      case 'ANALYSED':
        return 'success';
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return 'progress';
      case 'FAILED':
      case 'ERROR':
        return 'failed';
      default:
        return 'pending';
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
      null,
    );
  }

  goBack() {
    this.location.back();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }

  exportBSAReportsToCSV() {
    const headers = [
      'Account ID',
      'Report ID',
      'Report Name',
      'Account Number',
      'Account Type',
      'Bank ID',
      'Status',
      'Lead ID',
      'Created On',
      'Updated On',
      'Created By',
    ];

    const rows = this.reports.map((report: any) => [
      report.accountId || '',
      report.reportId || '',
      report.reportName || '',
      report.accountNumber || '',
      this.getAccountTypeName(report.accountType),
      report.bankId || '',
      report.reportStatus || '',
      report.leadId || '',
      report.createdOn
        ? this.datePipe.transform(report.createdOn, this.dateTimeFormat)
        : '',
      report.updatedOn
        ? this.datePipe.transform(report.updatedOn, this.dateTimeFormat)
        : '',
      report.createdBy || '',
    ]);

    const csvContent =
      headers.join(',') +
      '\n' +
      rows.map((r) => r.map(this.escapeCSVValue).join(',')).join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CAM_Reports.csv';
    link.click();
  }

  escapeCSVValue(value: any) {
    if (
      typeof value === 'string' &&
      (value.includes(',') || value.includes('"'))
    ) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
