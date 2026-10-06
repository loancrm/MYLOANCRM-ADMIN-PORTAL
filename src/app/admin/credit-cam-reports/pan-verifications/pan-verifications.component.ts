import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { REPORT_DATE_TIME_FORMAT } from '../report-date-format';

/** PAN Verifications tab — every account's Satmat PAN verifications,
 * newest first. Same lazy p-table pattern as the Credit Reports tab. */
@Component({
  selector: 'app-pan-verifications',
  templateUrl: './pan-verifications.component.html',
  styleUrl: './pan-verifications.component.scss',
  providers: [DatePipe],
})
export class PanVerificationsComponent {
  @ViewChild('panTable') panTable!: Table;

  readonly dateTimeFormat = REPORT_DATE_TIME_FORMAT;
  verifications: any[] = [];
  totalRecords = 0;
  apiLoading = false;
  currentTableEvent: any;

  /** One search box: matches account ID, business name or PAN number. */
  searchText = '';
  selectedStatus = 'ALL';
  /** "View Response" dialog state. */
  responseDialogVisible = false;
  responseLoading = false;
  selectedVerification: any = null;
  responseJson = '';

  statusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
  ];

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private datePipe: DatePipe,
  ) {}

  loadVerifications(event: any): void {
    if (!event) {
      event = { first: 0, rows: 10, sortField: 'createdOn', sortOrder: -1 };
    }
    this.currentTableEvent = event;

    // Always sorted by Created On only — newest first unless the user
    // clicks the Created On header to flip it.
    const filter: any = {
      from: event.first ?? 0,
      count: event.rows ?? 10,
      sort: `createdOn,${event.sortOrder === 1 ? 'asc' : 'desc'}`,
    };
    const search = this.searchText.trim();
    if (search) filter.search = search;
    if (this.selectedStatus !== 'ALL') filter['status-eq'] = this.selectedStatus;

    this.apiLoading = true;
    this.leadsService.getAdminPanVerifications(filter).subscribe({
      next: (res: any) => {
        this.verifications = res?.data || [];
        this.totalRecords = Number(res?.total) || 0;
        this.apiLoading = false;
      },
      error: (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      },
    });
  }

  /** Search / status change: back to page 1, sorted by Created On
   * (newest first). table.reset() is not used because it clears the sort
   * and the next load would come back oldest first. */
  applyFilters(): void {
    if (this.panTable) {
      this.panTable.first = 0;
      this.panTable.sortField = 'createdOn';
      this.panTable.sortOrder = -1;
    }
    this.loadVerifications({
      first: 0,
      rows: this.panTable?.rows || this.currentTableEvent?.rows || 10,
      sortField: 'createdOn',
      sortOrder: -1,
    });
  }

  onSearchChange(value: string): void {
    if (!value) this.applyFilters();
  }

  viewResponse(row: any): void {
    this.selectedVerification = row;
    this.responseJson = '';
    this.responseDialogVisible = true;
    this.responseLoading = true;
    this.leadsService.getAdminPanVerificationById(row.id).subscribe({
      next: (res: any) => {
        const data = res?.data || {};
        this.selectedVerification = { ...row, ...data };
        this.responseJson =
          data.rawResponse != null
            ? JSON.stringify(data.rawResponse, null, 2)
            : 'No response stored for this verification.';
        this.responseLoading = false;
      },
      error: (error: any) => {
        this.responseLoading = false;
        this.responseJson = 'Failed to load the response.';
        this.toastService.showError(error);
      },
    });
  }

  copyResponse(): void {
    if (!this.responseJson) return;
    navigator.clipboard.writeText(this.responseJson).then(
      () => this.toastService.showSuccess('Response copied to clipboard'),
      () => this.toastService.showError({ error: 'Could not copy response' }),
    );
  }

  exportToCSV(): void {
    const headers = [
      'Account Id',
      'Business Name',
      'Reference No',
      'PAN',
      'Name',
      'Status',
      'Message',
      'Mobile',
      'Amount Charged',
      'Verified By',
      'Created On',
    ];
    const rows = this.verifications.map((v: any) => [
      v.accountId ?? '',
      v.businessName || '',
      v.referenceNumber || '',
      v.pan || '',
      v.fullName || '',
      v.status || '',
      v.message || '',
      v.mobile || '',
      v.amountCharged ?? 0,
      v.createdByName || '',
      v.createdOn ? this.datePipe.transform(v.createdOn, this.dateTimeFormat) : '',
    ]);
    const escape = (value: any) => {
      const str = value == null ? '' : String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const csv =
      headers.join(',') + '\n' + rows.map((r) => r.map(escape).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = 'PAN_Verifications.csv';
    link.click();
  }
}
