
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
  private readonly FILTER_STORAGE_KEY = 'socialMediaLeadsFilters';
  // ── Bulk Upload ────────────────────────────────────────
  bulkUploadVisible: boolean = false;
  selectedBulkFile: File | null = null;
  bulkValidationData: any = null;
  bulkUploadResults: any = null;
  bulkUploadProgress: number = 0;
  isBulkValidating: boolean = false;
  handleDuplicates: string = 'skip';
  globalSearchValue: string = '';
  // Add this new property alongside handleDuplicates
  handleExcelDuplicates: string = 'skip';
  // selectedPlatform: string = 'all';
  // selectedPlatforms: string[] = [];
  selectedPlatforms: string[] = ['Facebook', 'Website'];
  platformOptions: { label: string; value: string }[] = [
  // { label: 'All Platforms', value: 'all' },
  { label: 'Facebook',      value: 'Facebook' },
  { label: 'Instagram',     value: 'Instagram' },
  { label: 'Manual', value: 'Manual'},
  { label: 'Excel Import', value: 'ExcelImport'},
  { label: 'Website', value: 'Website'},
  { label: 'Others', value: 'Others'}
  // { label: 'LinkedIn',      value: 'LinkedIn' },
  // { label: 'Twitter',       value: 'Twitter' },
  // { label: 'YouTube',       value: 'YouTube' },
  // ← Add / remove platforms to match your actual data
  ];
  selectedStatus: number = 1;
  statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 2 },
    { label: 'All', value: 'all' }
  ];
  // ── Admin Remarks Dropdown ─────────────────────────────
  adminRemarkOptions: { label: string; value: any }[] = [];
  adminRemarksLoaded: boolean = false;
  // ── Add these properties alongside selectedStatus ──
  selectedRegistrationStatus: string = '';

  registrationStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Not Registered', value: 'notRegistered' },
    { label: 'Registered',     value: 'registered' },
  ];
  // ── Book a Demo ────────────────────────────────────────
  bookDemoDialogVisible: boolean = false;
  bookDemoLead: any = null;
  bookDemoDate: Date | null = null;
  bookDemoTime: string = '';
  bookDemoSlots: { label: string; value: string }[] = [];
  bookDemoSlotsLoading: boolean = false;
  bookDemoSubmitting: boolean = false;
  today: Date = new Date();
  bookDemoUsers: { label: string; value: any }[] = [];
  bookDemoAssignTo: any = null;
  selectedDemoStatus: string = '';
  demoStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Not Demo Booked', value: 'notBooked' }, 
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Rescheduled', value: 'rescheduled' },
  ];

  enquiryTypeOptions = [
  { label: 'All',           value: '' },
  { label: 'Loan Enquiry',  value: 'loanEnquiry' },
  { label: 'CRM Enquiry',   value: 'crmEnquiry' },
];
selectedEnquiryType: string = '';
selectedRemark: string = '';
// Add alongside other properties
socialMediaFilterConfig: any[] = [];
socialMediaAppliedFilter: any = {};
assignFilterOptions: { label: string; value: any }[] = [];
selectedAssignFilter: any = null;
loggedInUserRole: number = 0;
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
  ngOnInit(): void {
  this.loadFiltersFromStorage();
  this.setSocialMediaFilterConfig();

  // ✅ Sync appliedFilter from restored values
  if (this.selectedStatus && this.selectedStatus !== ('all' as any)) {
    this.appliedFilter['status-eq'] = this.selectedStatus;
  }
  if (this.selectedPlatforms && this.selectedPlatforms.length > 0) {
    this.appliedFilter['Platform-eq'] = this.selectedPlatforms.join(',');
  }
  if (this.selectedRegistrationStatus) {
    this.appliedFilter['registrationStatus'] = this.selectedRegistrationStatus;
  }
  if (this.selectedDemoStatus) {
    this.appliedFilter['demoStatus-eq'] = this.selectedDemoStatus;
  }
  if (this.selectedEnquiryType) {
    this.appliedFilter['enquiryType-eq'] = this.selectedEnquiryType;
  }

  const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');
  this.loggedInUserRole = Number(adminDetails?.user?.role || 0);
  const loggedInUserId = adminDetails?.user?.id;

  // ✅ Role 2: only show leads assigned to this user (exclude null assign_to)
  if (this.loggedInUserRole === 2 && loggedInUserId) {
    this.appliedFilter['assign_to-eq'] = loggedInUserId;
  }

  if (this.loggedInUserRole === 1) {
    this.loadAssignFilterOptions();
  }

  this.loadAdminRemarks();
  this.loadBookDemoUsers();
}

  loadBookDemoUsers(): void {
    this.leadsService.getUsers({ 'status-eq': 1 }).subscribe(
      (data: any) => {
        this.bookDemoUsers = data
          .filter((u: any) => u.status === 1)
          .map((u: any) => ({ label: u.name, value: u.id }));
      },
      () => {
        // silently fail — auto-assign will handle it
      }
    );
  }
  // ngOnInit(): void {
  //   // ✅ Default = Active
  //   this.loadFiltersFromStorage(); 
  //   this.appliedFilter['status-eq'] = 1;
  //   this.appliedFilter['Platform-eq'] = this.selectedPlatforms.join(',');
  //   this.loadAdminRemarks();
  // }
  // ── Table Methods ──────────────────────────────────────

 loadAdminRemarks() {
  const filter = { 'status-eq': 3, 'remarkInternalStatus-eq': 1 };
  this.leadsService.getAdminRemarks(filter).subscribe(
    (data: any) => {
      this.adminRemarkOptions = data.map((r: any) => ({
        label: r.displayName,
        value: String(r.remarkId),
      }));
      this.adminRemarksLoaded = true;

      // ✅ Update remarks options in filter config after they load
      const remarkOptions = [
        { label: 'All', value: '' },
        ...this.adminRemarkOptions
      ];
      const remarkField = this.socialMediaFilterConfig
        .find(c => c.header === 'Remarks')?.data?.[0];
      if (remarkField) {
        remarkField.options = remarkOptions;
      }
    },
    (error: any) => {
      this.toastService.showError('Failed to load remarks');
      this.adminRemarksLoaded = true;
    }
  );
}
 
loadsocialmediaLeads(event: any) {
  this.currentTableEvent = event;

  const start  = event.first ?? 0;
  const length = event.rows  ?? 10;
  let sortField = 'CreatedOn';
  let sortOrder = 'desc';

  if (event.sortField) {
    sortField = event.sortField;
    sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
  }

  const baseParams: any = { start, length, sort: sortField, order: sortOrder };

  let columnFilters: any = {};
  if (event.filters) {
    Object.keys(event.filters).forEach(key => {
      const filterMeta = event.filters[key];
      const filterArr = Array.isArray(filterMeta) ? filterMeta : [filterMeta];
      filterArr.forEach((f: any) => {
        if (f.value !== null && f.value !== undefined && f.value !== '') {
          columnFilters[key] = f.value;
        }
      });
    });
  }

  const api_filter = Object.assign({}, baseParams, columnFilters, this.searchFilter, this.appliedFilter);

  // ✅ Role 2: always force assign_to filter
  if (this.loggedInUserRole === 2) {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');
    const loggedInUserId = adminDetails?.user?.id;
    api_filter['assign_to-eq'] = loggedInUserId;
    api_filter['excludeNullAssign'] = true;
  }

  // ✅ For role 2, skip separate count call - set count from data length
  if (this.loggedInUserRole === 2) {
    this.getSocialMediaLeadsWithCount(api_filter);
  } else {
    this.getSocilaMediaCount(api_filter);
    this.getSocialMediaLeads(api_filter);
  }
}

getSocialMediaLeadsWithCount(filter = {}) {
  this.apiLoading = true;
  
  // ✅ First get total count with a high limit to know actual total
  const countFilter = { ...filter, start: 0, length: 99999 };
  
  this.leadsService.getSocialMediaLeads(countFilter).subscribe(
    (allData: any) => {
      const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');
      const loggedInUserId = Number(adminDetails?.user?.id);

      // Filter strictly
      const allFiltered = allData
        .map((lead: any) => ({
          ...lead,
          remarkId: lead.remarkId != null ? String(lead.remarkId) : null,
          isRegistered: lead.isRegistered || false,
          assignedUserName: lead.assignedUserName || null,
        }))
        .filter((lead: any) =>
          lead.assign_to !== null &&
          lead.assign_to !== undefined &&
          Number(lead.assign_to) === loggedInUserId
        );

      // ✅ Set the TRUE count
      this.socialMediaLeadsCount = allFiltered.length;

      // ✅ Now paginate on frontend
      const start = filter['start'] || 0;
      const length = filter['length'] || 10;
      this.socialMediaLeads = allFiltered.slice(start, start + length);

      this.apiLoading = false;
    },
    (error) => {
      this.toastService.showError('Error fetching social media leads');
      this.apiLoading = false;
    }
  );
}

getSocialMediaLeads(filter = {}) {
  this.apiLoading = true;
  this.leadsService.getSocialMediaLeads(filter).subscribe(
    (data: any) => {
      const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');
      const loggedInUserId = Number(adminDetails?.user?.id);

      let leads = data.map((lead: any) => ({
        ...lead,
        remarkId: lead.remarkId != null ? String(lead.remarkId) : null,
        isRegistered: lead.isRegistered || false,
        assignedUserName: lead.assignedUserName || null,
      }));

      if (this.loggedInUserRole === 2) {
        leads = leads.filter((lead: any) => 
          lead.assign_to !== null && 
          lead.assign_to !== undefined && 
          Number(lead.assign_to) === loggedInUserId
        );
        // ✅ Fix count to match actual filtered data
        this.socialMediaLeadsCount = leads.length;
      }

      this.socialMediaLeads = leads;
      this.apiLoading = false;
    },
    (error) => {
      this.toastService.showError('Error fetching social media leads');
      this.apiLoading = false;
    }
  );
}

onRegistrationStatusChange(event: any): void {
  const value = event.value;

  if (!value) {
    delete this.appliedFilter['registrationStatus'];
  } else {
    this.appliedFilter['registrationStatus'] = value;
  }
  this.saveFiltersToStorage();
  this.reloadTable();
}

  // getSocilaMediaCount(filter = {}) {
  //   this.leadsService.getSocilaMediaCount().subscribe(
  //     (socialmediaCount) => {
  //       this.socialMediaLeadsCount = socialmediaCount;
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
 getSocilaMediaCount(filter = {}) {
  if (this.loggedInUserRole === 2) {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');
    const loggedInUserId = adminDetails?.user?.id;
    filter = { 
      ...filter, 
      'assign_to-eq': loggedInUserId, 
      'excludeNullAssign': true,
      'assign_to-notnull': true  // ✅ add this explicit not-null filter
    };
  }

  this.leadsService.getSocilaMediaCount(filter).subscribe(
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
      'Lead ID', 'Name', 'Website','Email', 'Phone',
      'Company', 'City', 'State', 'PinCode', 'Platform', 'Lead Management', 'EnquiryRange','Created Time'
    ];
    const rows = this.socialMediaLeads.map((lead: any) => [
      lead.id || '',
      lead.Name || '',
      lead.Website || '',
      lead.Email || '',
      lead.PhoneNumber || '',
      lead.Company || '',
      lead.City || '',
      lead.State || '',
      lead.pinCode || '',
      lead.Platform || '',
      lead.leadManagement || '',
      lead.enquiryRange || '',
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
  this.handleExcelDuplicates = 'skip'; // ✅ add this
  const fileInput = document.getElementById('socialLeadsExcelFile') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

  // resetBulkUploadForm() {
  //   this.selectedBulkFile = null;
  //   this.bulkValidationData = null;
  //   this.bulkUploadResults = null;
  //   this.bulkUploadProgress = 0;
  //   this.isBulkValidating = false;
  //   this.handleDuplicates = 'skip';
  //   const fileInput = document.getElementById('socialLeadsExcelFile') as HTMLInputElement;
  //   if (fileInput) fileInput.value = '';
  // }

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
    formData.append('handleExcelDuplicates', this.handleExcelDuplicates);
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

openWebsite(url: string): void {
  if (url) {
    window.open(url, '_blank');
  }
}
// ── Search ─────────────────────────────────────────────

onGlobalSearchChange(value: string): void {
  if (!value || !value.trim()) {
    this.searchFilter = {};
    this.reloadTable();
  }
}

onGlobalSearchSubmit(): void {
  const trimmed = (this.globalSearchValue || '').trim();

  if (!trimmed) {
    this.searchFilter = {};
  } else {
    // ✅ Backend expects a single 'search' param
    this.searchFilter = { search: trimmed };
  }

  this.reloadTable();
}

// ── Platform Dropdown ──────────────────────────────────
onPlatformFilterChange(event: any): void {
  const values: string[] = event.value; // array from multiSelect

  if (!values || values.length === 0) {
    delete this.appliedFilter['Platform-eq'];
  } else {
    // Send as comma-separated string → backend splits it
    this.appliedFilter['Platform-eq'] = values.join(',');
  }
  this.saveFiltersToStorage();
  this.reloadTable();
}
// onPlatformFilterChange(event: any): void {
//   const value = event.value;

//   if (!value || value === 'all') {
//     // ✅ Remove platform filter — backend uses handleGlobalFilters for 'Platform-eq'
//     delete this.appliedFilter['Platform-eq'];
//   } else {
//     this.appliedFilter['Platform-eq'] = value;
//   }

//   this.reloadTable();
// }

// ── Reload ─────────────────────────────────────────────

private reloadTable(): void {
  if (this.socialMediaLeadsTable) {
    this.socialMediaLeadsTable.first = 0;
  }

  const event = this.currentTableEvent
    ? { ...this.currentTableEvent, first: 0 }
    : { first: 0, rows: 10 };

  this.loadsocialmediaLeads(event);
}
changeStatus(lead: any, status: number) {
  this.leadsService.updateLeadStatus(lead.id, { status }).subscribe(
    () => {
      lead.status = status;

      this.toastService.showSuccess(
        status === 1 ? 'Activated successfully' : 'Deactivated successfully'
      );
    },
    () => {
      this.toastService.showError('Failed to update status');
    }
  );
}

onStatusFilterChange(event: any): void {
  const value = event.value;

  if (!value || value === 'all') {
    // ✅ Remove filter
    delete this.appliedFilter['status-eq'];
  } else {
    // ✅ Apply filter
    this.appliedFilter['status-eq'] = value;
  }
  this.saveFiltersToStorage();
  this.reloadTable();
}
saveRemark(lead: any, event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  const remark = textarea.value?.trim();

  if (!remark) return;

  this.leadsService.updateLeadRemark(lead.id, remark).subscribe(
    () => {
      lead.remarks = remark; // update UI instantly
      this.toastService.showSuccess('Remark saved');
    },
    (error) => {
      this.toastService.showError('Failed to save remark');
    }
  );
}

onRemarkChange(team: any, remarkId: any) {

  const finalRemarkId = remarkId ? String(remarkId) : null;

  this.leadsService.updateLeadRemark(team.id, finalRemarkId).subscribe(
    (res: any) => {
      team.remarkId = finalRemarkId;

      team.updatedBy = res.updatedBy;

      if (finalRemarkId) {
        this.toastService.showSuccess('Remark saved');
      } else {
        this.toastService.showSuccess('Remark removed');
      }
    },
    () => {
      this.toastService.showError('Failed to update remark');
    }
  );
}

private saveFiltersToStorage(): void {
  const filters = {
    selectedPlatforms:           this.selectedPlatforms,
    selectedStatus:              this.selectedStatus,
    selectedRegistrationStatus:  this.selectedRegistrationStatus,
    selectedEnquiryType:         this.selectedEnquiryType,
    selectedDemoStatus:          this.selectedDemoStatus,
  };
  this.localStorageService.setItemOnLocalStorage(this.FILTER_STORAGE_KEY, filters);
}

private loadFiltersFromStorage(): void {
  const stored = this.localStorageService.getItemFromLocalStorage(this.FILTER_STORAGE_KEY);
  if (!stored) return;
  this.selectedPlatforms          = stored.selectedPlatforms          ?? ['Facebook', 'Website'];
  this.selectedStatus             = stored.selectedStatus             ?? 1;
  this.selectedRegistrationStatus = stored.selectedRegistrationStatus ?? '';
  // this.selectedEnquiryType = '';
  this.selectedEnquiryType        = stored.selectedEnquiryType        ?? '';  // ✅ also fix this
  this.selectedDemoStatus         = stored.selectedDemoStatus         ?? '';  // ✅ ADD THIS
}

openBookDemoDialog(lead: any): void {
  this.bookDemoLead = lead;
  this.bookDemoDate = null;
  this.bookDemoTime = '';
  this.bookDemoSlots = [];
  this.bookDemoAssignTo=null;
  this.bookDemoDialogVisible = true;
}

closeBookDemoDialog(): void {
  this.bookDemoDialogVisible = false;
  this.bookDemoLead = null;
  this.bookDemoDate = null;
  this.bookDemoTime = '';
  this.bookDemoAssignTo=null;
  this.bookDemoSlots = [];
}

onBookDemoDateSelect(): void {
  if (!this.bookDemoDate) return;
  this.bookDemoTime = '';
  this.bookDemoSlots = [];
  this.bookDemoSlotsLoading = true;

  // Format date as YYYY-MM-DD in local time
  const date = this.bookDemoDate.toLocaleDateString('en-CA');

  this.leadsService.getSlots(date).subscribe(
    (res: any) => {
      this.bookDemoSlots = (res.availableSlots || []).map((s: string) => ({
        label: s,
        value: s,
      }));
      this.bookDemoSlotsLoading = false;
    },
    () => {
      this.toastService.showError('Failed to load slots');
      this.bookDemoSlotsLoading = false;
    }
  );
}

confirmBookDemo(): void {
  if (!this.bookDemoLead || !this.bookDemoDate || !this.bookDemoTime) return;

  this.bookDemoSubmitting = true;

  const date = this.bookDemoDate.toLocaleDateString('en-CA');
  const phone = this.bookDemoLead.PhoneNumber;

  this.leadsService.createBooking({
    phone,
    date,
    time: this.bookDemoTime,
    notes: '',
    assign_to: this.bookDemoAssignTo || null,
  }).subscribe(
    (res: any) => {
      this.toastService.showSuccess('Demo booked successfully!');
      this.bookDemoSubmitting = false;
      this.closeBookDemoDialog();
    },
    (error: any) => {
      this.bookDemoSubmitting = false;
      const msg =
        error?.error?.error ||
        error?.error?.message ||
        'Failed to book demo';

      // ✅ Already booked — show specific message
      if (error?.status === 409) {
        this.toastService.showError('A demo is already booked for this number.');
      } else if (error?.status === 409 && error?.error?.slotUnavailable) {
        this.toastService.showError('This time slot is fully booked. Please choose another.');
      } else {
        this.toastService.showError(msg);
      }
    }
  );
}

onDemoStatusFilterChange(event: any): void {
  const value = event.value;

  if (!value) {
    delete this.appliedFilter['demoStatus-eq'];
  } else {
    this.appliedFilter['demoStatus-eq'] = value;
  }

  this.saveFiltersToStorage();
  this.reloadTable();
}

get remarkFilterOptions(): { label: string; value: any }[] {
  return [{ label: 'All', value: '' }, ...this.adminRemarkOptions];
}

onRemarkFilterChange(event: any): void {
  const value = event.value;
  if (!value) {
    delete this.appliedFilter['remarkId-eq'];
  } else {
    this.appliedFilter['remarkId-eq'] = value;
  }
  this.saveFiltersToStorage();
  this.reloadTable();
}


onEnquiryTypeFilterChange(event: any): void {
  const value = event.value;
  if (!value) {
    delete this.appliedFilter['enquiryType-eq'];
  } else {
    this.appliedFilter['enquiryType-eq'] = value;
  }
  this.saveFiltersToStorage();
  this.reloadTable();
}
 
// markAsLoanEnquiry(lead: any): void {
//   this.leadsService.markAsLoanEnquiry(lead.id).subscribe(
//     () => {
//       lead.enquiryType = 'loanEnquiry';
//       this.toastService.showSuccess('Marked as Loan Enquiry');
//     },
//     (error: any) => {
//       this.toastService.showError('Failed to mark as loan enquiry');
//     }
//   );
// }
// unmarkLoanEnquiry(lead: any): void {
//   this.leadsService.unmarkLoanEnquiry(lead.id).subscribe(
//     () => {
//       lead.enquiryType = 'crmEnquiry';
//       this.toastService.showSuccess('Loan Enquiry removed');
//     },
//     () => { this.toastService.showError('Failed to unmark'); }
//   );
// }
toggleLoanEnquiry(lead: any): void {
  this.leadsService.toggleLoanEnquiry(lead.id).subscribe(
    (res: any) => {
      lead.enquiryType = res.enquiryType; // backend returns new value
      const msg = res.enquiryType === 'loanEnquiry'
        ? 'Marked as Loan Enquiry'
        : 'Loan Enquiry removed';
      this.toastService.showSuccess(msg);
    },
    () => { this.toastService.showError('Failed to update enquiry type'); }
  );
}

setSocialMediaFilterConfig(): void {
  this.socialMediaFilterConfig = [
    {
      header: 'Demo Status',
      data: [{ field: 'demoStatus', title: 'Demo Status', type: 'dropdown', filterType: 'eq',
        options: [
          { label: 'All', value: '' },
          { label: 'Not Demo Booked', value: 'notBooked' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Rescheduled', value: 'rescheduled' },
        ]
       }]
    },
    // {
    //   header: 'Registration Status',
    //   data: [{ field: 'registrationStatus', title: 'Registration Status', type: 'text', filterType: 'eq' }]
    // },
    {
      header: 'Enquiry Type',
      data: [{ field: 'enquiryType', title: 'Enquiry Type', type: 'dropdown', filterType: 'eq',
                options: [
          { label: 'All', value: '' },
          { label: 'Loan Enquiry', value: 'loanEnquiry' },
          { label: 'CRM Enquiry', value: 'crmEnquiry' },
        ]
       }]
    },
    {
      header: 'Remarks',
      data: [{ field: 'remarkId', title: 'Remarks', type: 'dropdown', filterType: 'eq',
        options: []
       }]
    },
    {
      header: 'Created Date Range',
      data: [
        {
          field: 'fromDate',
          title: 'From Date',
          type: 'date',
          filterType: 'eq'
        },
        {
          field: 'toDate',
          title: 'To Date',
          type: 'date',
          filterType: 'eq'
        }
      ]
    },
  ];
}


applySocialMediaConfigFilters(event: any): void {
  // console.log('Filter event received:', event); 
  if (event['reset']) {
    delete event['reset'];
    this.socialMediaAppliedFilter = {};
    this.selectedDemoStatus = '';           // ✅ sync UI dropdown
    this.selectedRegistrationStatus = '';
    this.selectedEnquiryType = '';
    this.selectedRemark = '';
    delete this.appliedFilter['demoStatus-eq'];
    delete this.appliedFilter['registrationStatus'];
    delete this.appliedFilter['enquiryType-eq'];
    delete this.appliedFilter['remarkId-eq'];
    delete this.appliedFilter['fromDate'];
    delete this.appliedFilter['toDate'];
    this.saveFiltersToStorage();            // ✅ ADD THIS
  } else {
    this.socialMediaAppliedFilter = { ...event };
    

    if (event['demoStatus-eq']) {
      this.appliedFilter['demoStatus-eq'] = event['demoStatus-eq'];
      this.selectedDemoStatus = event['demoStatus-eq'];   // ✅ sync UI dropdown
    } else {
      delete this.appliedFilter['demoStatus-eq'];
      this.selectedDemoStatus = '';
    }

    if (event['registrationStatus']) {
      this.appliedFilter['registrationStatus'] = event['registrationStatus'];
    } else {
      delete this.appliedFilter['registrationStatus'];
    }

    if (event['enquiryType-eq']) {
      this.appliedFilter['enquiryType-eq'] = event['enquiryType-eq'];
      this.selectedEnquiryType = event['enquiryType-eq'];  // ✅ sync UI dropdown
    } else {
      delete this.appliedFilter['enquiryType-eq'];
      this.selectedEnquiryType = '';
    }

    if (event['remarkId-eq']) {
      this.appliedFilter['remarkId-eq'] = event['remarkId-eq'];
    } else {
      delete this.appliedFilter['remarkId-eq'];
    }
     if (event['fromDate-eq']) {
  this.appliedFilter['fromDate'] = event['fromDate-eq'];
} else {
  delete this.appliedFilter['fromDate'];
}

if (event['toDate-eq']) {
  this.appliedFilter['toDate'] = event['toDate-eq'];
} else {
  delete this.appliedFilter['toDate'];
}

    this.saveFiltersToStorage();   // ✅ ADD THIS
  }
  this.reloadTable();
}
// REPLACE existing loadAssignFilterOptions()
loadAssignFilterOptions(): void {
  this.leadsService.getUsers({ 'status-eq': 1, 'role-eq': 2 }).subscribe((data: any) => {
    this.assignFilterOptions = [
      { label: 'All Users', value: null },
      ...data
        .filter((u: any) => u.status === 1 && Number(u.role) === 2)
        .map((u: any) => ({ label: u.name, value: u.id }))
    ];
  });
}

onAssignFilterChange(): void {
  if (this.selectedAssignFilter === null || this.selectedAssignFilter === undefined) {
    delete this.appliedFilter['assign_to-eq'];
  } else {
    this.appliedFilter['assign_to-eq'] = this.selectedAssignFilter;
  }
  this.reloadTable();
}

// REPLACE existing onLeadAssignChange()
onLeadAssignChange(lead: any, userId: any): void {
  this.leadsService.updateLeadAssign(lead.id, userId).subscribe(
    () => {
      lead.assign_to = userId;
      // ✅ Update displayed name instantly — same pattern as accounts table
      const found = this.assignFilterOptions.find(u => u.value === userId);
      lead.assignedUserName = found ? found.label : null;
      this.toastService.showSuccess('Lead reassigned successfully');
    },
    () => this.toastService.showError('Failed to reassign lead')
  );
}

// onLeadAssignChange(lead: any, userId: any): void {
//   this.leadsService.updateLeadAssign(lead.id, userId).subscribe(
//     () => {
//       lead.assign_to = userId;
//       this.toastService.showSuccess('Lead reassigned successfully');
//     },
//     () => this.toastService.showError('Failed to reassign lead')
//   );
// }
isDemoCompleted(remarkId: any): boolean {
  if (!remarkId || !this.adminRemarkOptions.length) return false;
  const found = this.adminRemarkOptions.find(r => r.value === String(remarkId));
  return found?.label?.toLowerCase().includes('demo completed') ?? false;
}
}