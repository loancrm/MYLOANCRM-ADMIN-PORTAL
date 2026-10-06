import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { REPORT_DATE_TIME_FORMAT } from '../report-date-format';

const PROVIDER_LABELS: Record<string, string> = {
  satmat: 'Satmat',
  avmanagement: 'AV Management',
};

/** Mobile Prefill tab — every account's mobile → PAN prefill calls with the
 * provider (Satmat / AV Management) that served each row, newest first.
 * Same lazy p-table pattern as the PAN Verifications tab. */
@Component({
  selector: 'app-mobile-prefills',
  templateUrl: './mobile-prefills.component.html',
  styleUrl: './mobile-prefills.component.scss',
  providers: [DatePipe],
})
export class MobilePrefillsComponent {
  @ViewChild('prefillTable') prefillTable!: Table;

  readonly dateTimeFormat = REPORT_DATE_TIME_FORMAT;
  prefills: any[] = [];
  totalRecords = 0;
  apiLoading = false;
  currentTableEvent: any;

  /** One search box: matches account ID, business name, mobile or PAN. */
  searchText = '';
  selectedStatus = 'ALL';
  selectedProvider = 'ALL';
  /** "View Response" dialog state. */
  responseDialogVisible = false;
  responseLoading = false;
  selectedPrefill: any = null;
  responseJson = '';

  statusOptions = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
  ];

  providerOptions = [
    { label: 'All Providers', value: 'ALL' },
    { label: 'Satmat', value: 'satmat' },
    { label: 'AV Management', value: 'avmanagement' },
  ];

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private datePipe: DatePipe,
  ) {}

  /** Only Satmat returns a credit score — the Score column is hidden when
   * the list is filtered to AV Management. */
  get showScore(): boolean {
    return this.selectedProvider !== 'avmanagement';
  }

  providerLabel(provider: string): string {
    return PROVIDER_LABELS[provider] || provider || '-';
  }

  loadPrefills(event: any): void {
    if (!event) {
      event = { first: 0, rows: 10, sortField: 'createdOn', sortOrder: -1 };
    }
    this.currentTableEvent = event;

    const filter: any = {
      from: event.first ?? 0,
      count: event.rows ?? 10,
      sort: `createdOn,${event.sortOrder === 1 ? 'asc' : 'desc'}`,
    };
    const search = this.searchText.trim();
    if (search) filter.search = search;
    if (this.selectedStatus !== 'ALL') filter['status-eq'] = this.selectedStatus;
    if (this.selectedProvider !== 'ALL') filter['provider-eq'] = this.selectedProvider;

    this.apiLoading = true;
    this.leadsService.getAdminMobilePrefills(filter).subscribe({
      next: (res: any) => {
        this.prefills = res?.data || [];
        this.totalRecords = Number(res?.total) || 0;
        this.apiLoading = false;
      },
      error: (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      },
    });
  }

  /** Search / status / provider change: back to page 1, newest first. */
  applyFilters(): void {
    if (this.prefillTable) {
      this.prefillTable.first = 0;
      this.prefillTable.sortField = 'createdOn';
      this.prefillTable.sortOrder = -1;
    }
    this.loadPrefills({
      first: 0,
      rows: this.prefillTable?.rows || this.currentTableEvent?.rows || 10,
      sortField: 'createdOn',
      sortOrder: -1,
    });
  }

  onSearchChange(value: string): void {
    if (!value) this.applyFilters();
  }

  viewResponse(row: any): void {
    this.selectedPrefill = row;
    this.responseJson = '';
    this.responseDialogVisible = true;
    this.responseLoading = true;
    this.leadsService.getAdminMobilePrefillById(row.id).subscribe({
      next: (res: any) => {
        const data = res?.data || {};
        this.selectedPrefill = { ...row, ...data };
        this.responseJson =
          data.rawResponse != null
            ? JSON.stringify(data.rawResponse, null, 2)
            : 'No response stored for this record.';
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
      'Provider',
      'Reference No',
      'Request Id',
      'Mobile',
      'Name',
      'PAN',
      'DOB',
      ...(this.showScore ? ['Score'] : []),
      'Status',
      'HTTP Status',
      'Message',
      'Amount Charged',
      'Fetched By',
      'Created On',
    ];
    const rows = this.prefills.map((p: any) => [
      p.accountId ?? '',
      p.businessName || '',
      this.providerLabel(p.provider),
      p.referenceNumber || '',
      p.requestId || '',
      p.mobile || '',
      p.name || '',
      p.pan || '',
      p.dob || '',
      ...(this.showScore ? [p.score || ''] : []),
      p.status || '',
      p.httpStatus ?? '',
      p.message || '',
      p.amountCharged ?? 0,
      p.createdByName || '',
      p.createdOn ? this.datePipe.transform(p.createdOn, this.dateTimeFormat) : '',
    ]);
    const escape = (value: any) => {
      const str = value == null ? '' : String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const csv =
      headers.join(',') + '\n' + rows.map((r) => r.map(escape).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = 'Mobile_Prefills.csv';
    link.click();
  }
}
