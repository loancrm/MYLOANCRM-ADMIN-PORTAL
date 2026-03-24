
import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Table } from 'primeng/table';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LeadsService } from '../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-social-media-leads',
  templateUrl: './social-media-leads.component.html',
  styleUrls: ['./social-media-leads.component.scss']
})
export class SocialMediaLeadsComponent {

  // ── Table ──────────────────────────────────────────────
  breadCrumbItems: any = [];
  searchFilter: any = {};
  currentTableEvent: any;
  socialMediaLeads: any = [];
  socialMediaLeadsCount: any = 0;
  apiLoading: any;
  appliedFilter: any = {};
  filterConfig: any[] = [];
  accountsCount: any = 0;
  viewDialogVisible = false;
selectedLead: any = null;
  version = projectConstantsLocal.VERSION_DESKTOP;
  @ViewChild('SocialMediaLeadsTable') socialMediaLeadsTable!: Table;

  // ── Bulk Upload ────────────────────────────────────────
  bulkUploadVisible: boolean = false;
  selectedBulkFile: File | null = null;
  bulkValidationData: any = null;
  bulkUploadResults: any = null;
  bulkUploadProgress: number = 0;
  isBulkValidating: boolean = false;
  handleDuplicates: string = 'skip';

  constructor(
    private location: Location,
    private routingService: RoutingService,
    private confirmationService: ConfirmationService,
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/admin/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Social Media Leads' },
    ];
  }

  // ── Table Methods ──────────────────────────────────────

  loadsocialmediaLeads(event: any) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.searchFilter, this.appliedFilter);
    if (api_filter) {
      this.getSocilaMediaCount(api_filter);
      this.getSocialMediaLeads(api_filter);
    }
  }

  getSocialMediaLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getSocialMediaLeads(filter).subscribe(
      (data) => {
        this.socialMediaLeads = data;
        this.apiLoading = false;
      },
      (error) => {
        this.toastService.showError('Error fetching social media leads');
        this.apiLoading = false;
      }
    );
  }

  getSocilaMediaCount(filter = {}) {
    this.leadsService.getSocilaMediaCount().subscribe(
      (socialmediaCount) => {
        this.socialMediaLeadsCount = socialmediaCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  exportSocialLeadsToCSV() {
    const headers = [
      'Lead ID', 'Name', 'Email', 'Phone',
      'Company', 'City', 'State', 'PinCode', 'Platform', 'Created Time'
    ];
    const rows = this.socialMediaLeads.map((lead: any) => [
      lead.id || '',
      lead.Name || '',
      lead.Email || '',
      lead.PhoneNumber || '',
      lead.Company || '',
      lead.City || '',
      lead.State || '',
      lead.pinCode || '',
      lead.Platform || '',
      lead.CreatedOn ? new Date(lead.CreatedOn).toLocaleDateString() : ''
    ]);
    const csvContent =
      headers.join(',') + '\n' +
      rows.map((r: any[]) => r.map(this.escapeCSVValue).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'social_media_leads.csv';
    link.click();
  }

  escapeCSVValue(value: any) {
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  goBack() {
    this.location.back();
  }

  // ── Bulk Upload Methods ────────────────────────────────

  showBulkUploadDialog() {
    this.bulkUploadVisible = true;
    this.resetBulkUploadForm();
  }

  closeBulkUploadDialog() {
    this.bulkUploadVisible = false;
    this.resetBulkUploadForm();
  }

  resetBulkUploadForm() {
    this.selectedBulkFile = null;
    this.bulkValidationData = null;
    this.bulkUploadResults = null;
    this.bulkUploadProgress = 0;
    this.isBulkValidating = false;
    this.handleDuplicates = 'skip';
    const fileInput = document.getElementById('socialLeadsExcelFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onBulkFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      this.toastService.showError(
        'Invalid file type. Please upload an Excel file (.xlsx or .xls only)'
      );
      event.target.value = '';
      return;
    }

    this.selectedBulkFile = file;
    this.bulkValidationData = null;
    this.bulkUploadResults = null;
    this.bulkUploadProgress = 0;
  }

  clearBulkFile() {
    this.selectedBulkFile = null;
    this.bulkValidationData = null;
    this.bulkUploadResults = null;
    this.bulkUploadProgress = 0;
    const fileInput = document.getElementById('socialLeadsExcelFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // ── Step 1: Validate ───────────────────────────────────

  validateSocialLeadsFile() {
    if (!this.selectedBulkFile) {
      this.toastService.showError('Please select a file');
      return;
    }

    this.isBulkValidating = true;
    const formData = new FormData();
    formData.append('file', this.selectedBulkFile);

    this.leadsService.validateSocialMediaLeadsBulk(formData).subscribe(
      (result: any) => {
        this.isBulkValidating = false;
        const totalRows = result.totalRowsInFile || 0;

        if (totalRows === 0) {
          this.toastService.showError(
            'No data found in Excel file. Please add data rows.'
          );
          this.clearBulkFile();
          return;
        }

        this.bulkValidationData = result;
        this.handleDuplicates = 'skip';
      },
      (error: any) => {
        this.isBulkValidating = false;
        const errorMessage =
          error?.error?.error || error?.error || 'Validation failed';

        if (error?.error?.hasTemplateError) {
          this.bulkValidationData = {
            hasTemplateError: true,
            error: errorMessage,
            missingHeaders: error?.error?.missingHeaders || [],
            receivedHeaders: error?.error?.receivedHeaders || []
          };
          return;
        }
        this.toastService.showError(errorMessage);
      }
    );
  }

  // ── Step 2: Upload ─────────────────────────────────────

  proceedWithBulkUpload() {
    if (!this.selectedBulkFile || !this.bulkValidationData) return;

    this.bulkUploadProgress = 10;
    this.bulkUploadResults = null;

    const formData = new FormData();
    formData.append('file', this.selectedBulkFile);
    formData.append('handleDuplicates', this.handleDuplicates);

    this.leadsService.bulkUploadSocialMediaLeadsFile(formData).subscribe(
      (response: any) => {
        this.bulkUploadProgress = 100;
        const results = response.results || response;
        this.bulkUploadResults = results;

        if (results.success > 0) {
          this.toastService.showSuccess(
            `${results.success} lead(s) imported successfully` +
            (results.skipped > 0 ? `. ${results.skipped} duplicate(s) skipped` : '')
          );
        }

        if (results.failed > 0) {
          this.toastService.showError(
            `${results.failed} lead(s) failed to import`
          );
        }

        // Refresh table then auto-close if no errors
        setTimeout(() => {
          this.loadsocialmediaLeads(this.currentTableEvent);
          const hasErrors =
            results.failed > 0 ||
            (results.errors && results.errors.length > 0);
          if (!hasErrors) {
            this.closeBulkUploadDialog();
          }
          this.bulkUploadProgress = 0;
        }, 2000);
      },
      (error: any) => {
        this.bulkUploadProgress = 0;
        this.toastService.showError(
          error?.error?.error || 'Upload failed. Please try again.'
        );
      }
    );
  }

  // ── Template Download ──────────────────────────────────

  downloadSocialLeadsTemplate() {
    this.leadsService.downloadSocialLeadsTemplate().subscribe(
      (response: any) => {
        const blob = response instanceof Blob ? response : response.body;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Social_Media_Leads_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.toastService.showSuccess('Template downloaded successfully');
      },
      (error: any) => {
        this.toastService.showError('Failed to download template');
      }
    );
  }

  addLead(): void {
  this.router.navigate(['/admin/social-media-leads/create']);
}

editLead(lead: any): void {
  this.router.navigate(
    ['/admin/social-media-leads/create'],
    { queryParams: { id: lead.id } }
  );
}
viewLead(event: any): void {
  this.selectedLead = event.data; // ✅ onRowSelect wraps in {data: lead}
  this.viewDialogVisible = true;
}
goToCampaign(lead: any): void {
  this.viewDialogVisible = false;
  this.router.navigate(['/admin/social-media-leads/single-campaign'], {
    queryParams: {
      phone:    lead.PhoneNumber,
      name:     lead.Name,
      email:    lead.Email    || '',
      city:     lead.City     || '',
      company:  lead.Company  || '',
      state:    lead.State    || '',
      platform: lead.Platform || ''
    }
  });
}

sendEmail(lead: any): void {
  if (lead.Email) {
    window.location.href = `mailto:${lead.Email}`;
  } else {
    this.toastService.showError('No email address found for this lead');
  }
}
}