import { Component, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { REPORT_DATE_TIME_FORMAT } from '../credit-cam-reports/report-date-format';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Table } from 'primeng/table';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LeadsService } from '../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-cibil-reports',
  templateUrl: './cibil-reports.component.html',
  styleUrl: './cibil-reports.component.scss',
  providers: [DatePipe],
})
export class CibilReportsComponent {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  currentTableEvent: any;
  userNameToSearch: any;
  accounts: any = [];
  leadSources: any = [];
  accountsCount: any = 0;
  loading: any;
  apiLoading: any;
  appliedFilter: {};
  filterConfig: any[] = [];
  capabilities: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  @ViewChild('accountTable') accountTable!: Table;
  selectedReportType: string = 'ALL';
  selectedProvider: string = 'ALL';

  /** Values are cibil_reports.reportProvider lists; Verifyal includes the
   * newer CRIF flow ('verifyal_new'). */
  providerOptions = [
    { label: 'All Providers', value: 'ALL' },
    { label: 'Verifyal', value: 'verifyal,verifyal_new' },
    { label: 'Surepass', value: 'surepass' },
    { label: 'Satmat', value: 'satmat' },
    { label: 'AV Management', value: 'avmanagement' },
  ];
  readonly dateTimeFormat = REPORT_DATE_TIME_FORMAT;

  /** Request details dialog — only fields that have a value are listed. */
  detailsVisible = false;
  detailRows: { label: string; value: string }[] = [];

  private readonly detailFields: {
    field: string;
    label: string;
    format?: (value: any) => string;
  }[] = [
    { field: 'accountId', label: 'Account ID' },
    { field: 'businessName', label: 'Business Name' },
    {
      field: 'report_type',
      label: 'Report Type',
      format: (v) => String(v).toUpperCase(),
    },
    {
      field: 'reportProvider',
      label: 'Provider',
      format: (v) => this.providerLabel(v),
    },
    { field: 'client_id', label: 'Reference' },
    { field: 'name', label: 'Name' },
    { field: 'mobile', label: 'Mobile' },
    { field: 'pan', label: 'PAN' },
    { field: 'gender', label: 'Gender' },
    { field: 'dob', label: 'Date of Birth', format: (v) => this.formatDob(v) },
    { field: 'email', label: 'Email' },
    { field: 'aadhar_number', label: 'Aadhaar Number' },
    { field: 'address', label: 'Address' },
    { field: 'city', label: 'City' },
    { field: 'state', label: 'State' },
    { field: 'pincode', label: 'Pincode' },
    {
      field: 'consent',
      label: 'Consent',
      format: (v) => (v === 'Y' ? 'Yes' : 'No'),
    },
    {
      field: 'credit_score',
      label: 'Credit Score',
      format: (v) => (Number(v) > 0 ? String(v) : ''),
    },
    { field: 'status', label: 'Status' },
    { field: 'sourceType', label: 'Source' },
    { field: 'leadId', label: 'Lead ID' },
    {
      field: 'created_at',
      label: 'Fetched On',
      format: (v) =>
        this.datePipe.transform(v, this.dateTimeFormat) || String(v),
    },
  ];

  /** API response dialog for FAILED rows. */
  responseDialogVisible = false;
  responseLoading = false;
  responseReport: any = null;
  responseMessage = '';
  responseJson = '';

  readonly providerLabels: Record<string, string> = {
    verifyal: 'Verifyal',
    verifyal_new: 'Verifyal',
    surepass: 'Surepass',
    satmat: 'Satmat',
    avmanagement: 'AV Management',
  };

  reportTypeOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Experian', value: 'experian' },
    { label: 'CIBIL', value: 'cibil' },
    { label: 'CRIF', value: 'crif' },
    { label: 'Equifax', value: 'equifax' },
  ];

  constructor(
    private routingService: RoutingService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private router: Router,
    private datePipe: DatePipe,
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/admin/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Team' },
    ];
  }

  ngOnInit(): void {}

  actionItems(team: any): MenuItem[] {
    // const menuItems: MenuItem[] = [];
    const menuItems: any = [{ label: 'Actions', items: [] }];
    // menuItems[0].items.push({
    //   label: 'Update',
    //   icon: 'pi pi-refresh',
    //   command: () => this.updateAccount(team.id),
    // });
    return menuItems;
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'Active':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Inactive':
        return { textColor: '#FF555A', backgroundColor: '#FFE2E3' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }
  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'teamAppliedFilter',
      this.appliedFilter,
    );
    this.loadCibilReports(null);
  }

  updateAccount(accountId) {
    this.routingService.handleRoute('team/update/' + accountId, null);
  }
  viewAccount(event) {
    const user = event.data;
    this.routingService.handleRoute('team/view/' + user.id, null);
  }
  goBack() {
    this.location.back();
  }

  providerLabel(provider: string): string {
    return provider ? this.providerLabels[provider] || provider : '-';
  }

  openDetails(report: any, event: Event): void {
    event.stopPropagation();
    this.detailRows = this.detailFields
      .map(({ field, label, format }) => {
        const raw = report?.[field];
        if (raw === null || raw === undefined || String(raw).trim() === '') {
          return null;
        }
        const value = format ? format(raw) : String(raw).trim();
        return value ? { label, value } : null;
      })
      .filter((r): r is { label: string; value: string } => !!r);
    this.detailsVisible = true;
  }

  /** Stored PDF on files.loancrm.org, else the provider's link. */
  reportLink(report: any): string | null {
    const url = report?.uploaded_url || report?.report_url;
    if (!url) return null;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  downloadReport(report: any, event: Event): void {
    event.stopPropagation();
    const url = this.reportLink(report);
    if (url) window.open(url, '_blank');
  }

  /** Stored as YYYY-MM-DD -> DD-MM-YYYY. */
  private formatDob(value: any): string {
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : String(value);
  }

  /** Opens the exact provider response stored for a row. */
  viewApiResponse(report: any, event: Event): void {
    event.stopPropagation();
    this.responseReport = report;
    this.responseMessage = '';
    this.responseJson = '';
    this.responseDialogVisible = true;
    this.responseLoading = true;
    this.leadsService.getCibilReportApiResponse(report.id).subscribe(
      (res: any) => {
        const stored = res?.data?.api_response;
        this.responseMessage = this.extractMessage(stored);
        this.responseJson =
          stored == null
            ? 'No API response was stored for this report.'
            : typeof stored === 'string'
              ? stored
              : JSON.stringify(stored, null, 2);
        this.responseLoading = false;
      },
      (error: any) => {
        this.responseLoading = false;
        this.responseDialogVisible = false;
        this.toastService.showError(error);
      },
    );
  }

  copyApiResponse(): void {
    navigator.clipboard?.writeText(this.responseJson);
    this.toastService.showSuccess('Response copied');
  }

  /** Best-effort headline from the stored record (AV: {http_status,
   * response, error}; Satmat: {message, response, ...}). */
  private extractMessage(stored: any): string {
    if (!stored || typeof stored !== 'object') return '';
    const body = stored.response;
    const fromBody =
      body && typeof body === 'object'
        ? body.message || body.detail || body.error || body.response?.message
        : typeof body === 'string'
          ? body.slice(0, 300)
          : '';
    return stored.message || fromBody || stored.error || '';
  }

  /** True when shown as a tab inside Credit & CAM Reports — the container
   * already provides the back button and page title. */
  get embedded(): boolean {
    return this.router.url.includes('/credit-cam-reports');
  }

  loadCibilReports(event) {
    if (!event) {
      event = {
        first: 0,
        rows: 10,
        sortField: 'created_at',
        sortOrder: -1,
      };
    }

    this.currentTableEvent = event;

    // Build base filter from table event
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

    // Merge search filter
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter,
    );

    // ✅ Apply report type filter HERE (same pattern as accounts)
    if (this.selectedReportType && this.selectedReportType !== 'ALL') {
      api_filter['report_type-eq'] = this.selectedReportType;
    }
    if (this.selectedProvider && this.selectedProvider !== 'ALL') {
      api_filter['reportProvider-in'] = this.selectedProvider;
    }

    // Both count and data get the SAME filter
    this.getTeamCount(api_filter);
    this.getTeam(api_filter);
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.accountTable.reset();
    }
  }

  getTeamCount(filter = {}) {
    this.leadsService.getFetchedCibilReportsCount(filter).subscribe(
      (teamsCount) => {
        this.accountsCount = teamsCount;
        // console.log(this.accountsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      },
    );
  }

  getTeam(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getFetchedCibilReports(filter).subscribe(
      (team) => {
        this.accounts = team;
        this.apiLoading = false;
      },
      (error: any) => {
        this.toastService.showError(error);
        this.apiLoading = false;
      },
    );
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadCibilReports(this.currentTableEvent);
  }

  // filterWithName() {
  //   let searchFilter = { 'name-like': this.userNameToSearch };
  //   this.applyFilters(searchFilter);
  // }
  filterWithName() {
    let searchFilter = {};
    const trimmedInput = this.userNameToSearch?.trim() || '';

    if (!trimmedInput) {
      this.applyFilters({});
      return;
    }

    // ✅ Account ID (numeric but NOT 10-digit mobile)
    if (this.isNumeric(trimmedInput) && trimmedInput.length !== 10) {
      searchFilter = { 'accountId-like': trimmedInput };
    }

    // ✅ Mobile Number (10-digit)
    else if (this.isPhoneNumber(trimmedInput)) {
      searchFilter = { 'mobile-like': trimmedInput };
    }

    // ✅ Business Name
    else {
      searchFilter = {
        'name-like': trimmedInput,
      };
    }

    this.applyFilters(searchFilter);
  }
  isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[6-9]\d{9}$/;
    return phoneNumberPattern.test(value.trim());
  }

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedTeamStatus',
      event.value,
    );
    this.loadCibilReports(this.currentTableEvent);
  }

  exportCibilReportsToCSV() {
    const headers = [
      'Account Id',
      'Name',
      'Mobile',
      'Pan',
      'City',
      'Aadhar',
      'Gender',
      'Consent',
      'Credit Score',
      'Status',
      'Download URL',
      'Created On',
    ];

    const rows = this.accounts.map((report: any) => [
      report.accountId || '',
      report.name || '',
      report.mobile || '',
      report.pan || '',
      report.city || '',
      report.aadhar_number || '',
      report.gender || '',
      report.consent || '',
      report.credit_score || '',
      report.status || '',
      report.uploaded_url ? `https://${report.uploaded_url}` : '',
      report.created_at
        ? this.datePipe.transform(report.created_at, this.dateTimeFormat)
        : '',
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
    link.download = 'Cibil_Reports.csv';
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

  // Applied in loadCibilReports() (like report type) so name/mobile searches,
  // which replace searchFilter, keep the provider filter.
  onProviderChange(event: any) {
    this.accountTable.reset(); // reload table + API
  }

  onReportTypeChange(event: any) {
    // remove both filters first
    delete this.searchFilter['report_type-eq'];
    delete this.searchFilter['report_type-nin'];

    // apply filter only if NOT ALL
    if (event.value !== 'ALL') {
      this.searchFilter['report_type-eq'] = event.value;
    }

    this.accountTable.reset(); // reload table + API
  }

  //   exportCibilReportsToCSV() {
  //   const headers = [
  //     'Account Id',
  //     'Name',
  //     'Mobile',
  //     'Pan',
  //     'City',
  //     'Aadhar',
  //     'Gender',
  //     'Consent',
  //     'Credit Score',
  //     'Status',
  //     'Created On'
  //   ];

  //   const rows = this.accounts.map((report: any) => [
  //     report.accountId || '',
  //     report.name || '',
  //     report.mobile || '',
  //     report.pan || '',
  //     report.city || '',
  //     report.aadhar_number || '',
  //     report.gender || '',
  //     report.consent || '',
  //     report.credit_score || '',
  //     report.status || '',
  //     report.created_at
  //       ? new Date(report.created_at).toLocaleDateString()
  //       : ''
  //   ]);

  //   const csvContent =
  //     headers.join(',') +
  //     '\n' +
  //     rows.map(row => row.map(this.escapeCSVValue).join(',')).join('\n');

  //   const blob = new Blob([csvContent], {
  //     type: 'text/csv;charset=utf-8;'
  //   });

  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = 'Cibil_Reports.csv';
  //   link.click();
  // }
  // escapeCSVValue(value: any) {
  //   if (
  //     typeof value === 'string' &&
  //     (value.includes(',') || value.includes('"'))
  //   ) {
  //     value = `"${value.replace(/"/g, '""')}"`;
  //   }
  //   return value;
  // }
}
