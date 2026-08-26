import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent {
  breadCrumbItems: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;

  searchFilter: any = {};
  appliedFilter: any = {};
  filterConfig: any[] = [];
  currentTableEvent: any;

  invoices: any[] = [];
  invoicesCount: any = 0;
  apiLoading: any = false;

  businessNameToSearch: any;
  /** 'month' when the This Month quick-filter is active, so the button can show as selected. */
  activeQuickRange: 'month' | null = null;

  viewInvoiceDialog = false;
  selectedInvoicePdfUrl: SafeResourceUrl | null = null;
  selectedInvoiceHasPdf = true;
  exportingExcel = false;

  @ViewChild('invoiceTable') invoiceTable!: Table;

  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/admin/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Invoices' },
    ];
    this.setFilterConfig();
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Account',
        data: [
          {
            field: 'accountId',
            title: 'Account Id',
            type: 'text',
            filterType: 'like',
          },
          {
            field: 'businessName',
            title: 'Business Name',
            type: 'text',
            filterType: 'like',
          },
          {
            field: 'gstNumber',
            title: 'GST Number',
            type: 'text',
            filterType: 'like',
          },
          {
            field: 'mobile',
            title: 'Mobile Number',
            type: 'text',
            filterType: 'like',
          },
          {
            field: 'emailId',
            title: 'Email Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Plan',
        data: [
          {
            field: 'plan_name',
            title: 'Plan',
            type: 'dropdown',
            filterType: 'like',
            options: [
              { label: 'All', value: '' },
              { label: 'Basic', value: 'Basic' },
              { label: 'Premium', value: 'Premium' },
              { label: 'Professional', value: 'Professional' },
            ],
          },
        ],
      },
      {
        header: 'Invoice Number',
        data: [
          {
            field: 'invoice_number',
            title: 'Invoice Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Invoice Date',
        data: [
          {
            field: 'invoice_date',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'invoice_date',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
    ];
  }

  goBack() {
    this.location.back();
  }

  applyConfigFilters(event) {
    this.activeQuickRange = null;
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.loadInvoices(null);
  }

  /** One-click "this calendar month" filter — the common admin ask
   *  ("show me this month's invoices") without having to open the filter
   *  panel and pick two dates by hand. */
  filterThisMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    this.appliedFilter = {
      'invoice_date-gte': fmt(start),
      'invoice_date-lte': fmt(end),
    };
    this.activeQuickRange = 'month';
    this.loadInvoices(null);
  }

  clearFilters() {
    this.appliedFilter = {};
    this.searchFilter = {};
    this.businessNameToSearch = '';
    this.activeQuickRange = null;
    this.loadInvoices(null);
  }

  loadInvoices(event) {
    if (!event) {
      event = {
        first: 0,
        rows: 10,
        sortField: 'invoice_number',
        sortOrder: 1,
      };
    }
    this.currentTableEvent = event;

    let api_filter: any = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );

    // setFiltersFromPrimeTable doesn't translate sortField/sortOrder — do
    // it here so column-header clicks are actually sorted server-side.
    if (event.sortField) {
      api_filter['sort'] = `${event.sortField},${
        event.sortOrder === -1 ? 'desc' : 'asc'
      }`;
    }

    this.getInvoicesCount(api_filter);
    this.getInvoices(api_filter);
  }

  getInvoicesCount(filter = {}) {
    this.leadsService.getSubscriptionInvoicesCount(filter).subscribe({
      next: (count: any) => {
        this.invoicesCount = parseInt(count) || 0;
      },
      error: (error: any) => {
        this.toastService.showError(error);
      },
    });
  }

  getInvoices(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getSubscriptionInvoicesList(filter).subscribe({
      next: (rows: any) => {
        this.invoices = rows || [];
        this.apiLoading = false;
      },
      error: (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      },
    });
  }

  inputValueChangeEvent(_dataType, value) {
    if (value === '') {
      this.searchFilter = {};
      this.invoiceTable.reset();
    }
  }

  filterWithBusinessName() {
    this.searchFilter = this.businessNameToSearch
      ? { 'businessName-like': this.businessNameToSearch }
      : {};
    this.loadInvoices(this.currentTableEvent);
  }

  /** Shows the invoice PDF inline, in-app, rather than opening a new tab. */
  viewInvoice(row: any) {
    this.selectedInvoiceHasPdf = !!row?.pdf_relative_path;
    this.selectedInvoicePdfUrl = row?.pdf_relative_path
      ? this.sanitizer.bypassSecurityTrustResourceUrl(row.pdf_relative_path)
      : null;
    this.viewInvoiceDialog = true;
  }

  closeViewInvoiceDialog() {
    this.viewInvoiceDialog = false;
    this.selectedInvoicePdfUrl = null;
  }

  openPdfInNewTab(row: any) {
    if (row?.pdf_relative_path) {
      window.open(row.pdf_relative_path, '_blank');
    }
  }

  /** Bulk Excel export of every invoice matching the current filters (not
   *  just the current page). Uses fetch() directly rather than Angular's
   *  HttpClient — the app's http interceptor forces responseType to 'json'
   *  on every request, which would corrupt a binary .xlsx download. */
  async exportInvoicesToExcel() {
    const filter: any = Object.assign({}, this.searchFilter, this.appliedFilter);
    const query = Object.keys(filter)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filter[key])}`)
      .join('&');
    const url = `${projectConstantsLocal.BASE_URL}admin/subscription-invoices/export${
      query ? '?' + query : ''
    }`;
    const token = this.localStorageService.getItemFromLocalStorage('accessToken');

    this.exportingExcel = true;
    try {
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        throw new Error('Export failed with status ' + response.status);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `Subscription-Invoices-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      this.toastService.showError('Failed to export invoices to Excel');
    } finally {
      this.exportingExcel = false;
    }
  }
}
