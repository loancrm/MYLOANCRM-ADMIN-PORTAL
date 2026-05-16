import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-whatsapp-templates',
  templateUrl: './whatsapp-templates.component.html',
  styleUrl: './whatsapp-templates.component.scss'
})
export class WhatsappTemplatesComponent implements OnInit, AfterViewInit {

  // ── Emit selected template to campaign component ──────────────────────────
  @Output() templateSelected = new EventEmitter<any>();

  @ViewChild('templateTable') templateTable!: Table;

  // ── Table data ────────────────────────────────────────────────────────────
  templates: any[]   = [];
  templatesCount     = 0;
  apiLoading         = false;

  // ── Pagination (same as accounts sample) ─────────────────────────────────
  initialFirst = 0;
  initialRows  = 10;
  currentTableEvent: any;

  // ── Search & Filters ──────────────────────────────────────────────────────
  searchText             = '';
  searchFilter: any      = {};
  selectedApprovalStatus = 'ALL';
  selectedCategory       = 'ALL';

  approvalStatusOptions = [
    { label: 'All Status',  value: 'ALL' },
    { label: 'Approved',    value: 'APPROVED' },
    { label: 'Pending',     value: 'PENDING' },
    { label: 'Rejected',    value: 'REJECTED' },
    { label: 'Paused',      value: 'PAUSED' },
    { label: 'Disabled',    value: 'DISABLED' },
  ];

  categoryOptions = [
    { label: 'All Categories',  value: 'ALL' },
    { label: 'Marketing',       value: 'MARKETING' },
    { label: 'Utility',         value: 'UTILITY' },
    { label: 'Authentication',  value: 'AUTHENTICATION' },
  ];

  // ── Dialog ────────────────────────────────────────────────────────────────
  showCreateDialog  = false;
  showPreviewDialog = false;
  editTemplateData: any = null;
  selectedTemplate: any = null;

  // ── Sync ──────────────────────────────────────────────────────────────────
  isSyncing = false;

  submittingIds: Set<number> = new Set();
  currentPage = 0;
  activeTab = 'META';

  customTemplatesCount = 0;
  approvedTemplatesCount = 0;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // nothing here — AfterViewInit triggers load
  }

  // ngAfterViewInit(): void {
  //   // ── Same pattern as accounts sample ──────────────────────────────────
  //   if (this.templateTable) {
  //     this.templateTable.first = this.initialFirst;
  //     this.templateTable.rows  = this.initialRows;
  //     this.loadTemplates({
  //       first:     this.initialFirst,
  //       rows:      this.initialRows,
  //       sortOrder: -1,
  //     });
  //   }
  // }
  ngAfterViewInit(): void {
  this.loadTemplates({
    first: this.initialFirst,
    rows: this.initialRows,
    sortOrder: -1,
  });
}

  // ── MAIN LOAD (lazy — same pattern as accounts loadAccounts) ──────────────

//   loadTemplates(event: any): void {
//   if (!event) {
//     event = { first: this.initialFirst, rows: this.initialRows, sortOrder: -1 };
//   }
//   this.currentTableEvent = event;
//   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
//   api_filter = Object.assign({}, api_filter, this.searchFilter);
//   if (this.selectedApprovalStatus !== 'ALL') {
//     api_filter['approval_status-eq'] = this.selectedApprovalStatus;
//   }
//   if (this.selectedCategory !== 'ALL') {
//     api_filter['category-eq'] = this.selectedCategory;
//   }

//   // ✅ ONE call — no separate count API needed
//   this.apiLoading = true;
//   this.leadsService.getWhatsappTemplatesFromDB(api_filter).subscribe(
//     (res: any) => {
//       this.templates      = res.data  || [];
//       this.templatesCount = res.total || 0;  // ✅ total from same response
//       this.apiLoading     = false;
//     },
//     (err: any) => {
//       this.toastService.showError(err);
//       this.apiLoading = false;
//     }
//   );
// }

loadTemplates(event: any): void {

  if (!event) {
    event = {
      first: this.initialFirst,
      rows: this.initialRows,
      sortOrder: -1
    };
  }

  this.currentTableEvent = event;

  let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  api_filter = Object.assign({}, api_filter, this.searchFilter);

  if (this.selectedApprovalStatus !== 'ALL') {
    api_filter['approval_status-eq'] = this.selectedApprovalStatus;
  }

  if (this.selectedCategory !== 'ALL') {
    api_filter['category-eq'] = this.selectedCategory;
  }

  this.apiLoading = true;

  this.leadsService.getWhatsappTemplatesFromDB(api_filter).subscribe(

    (res: any) => {

      this.templates = res.data || [];
      this.templatesCount = res.total || 0;

      // ✅ Counts
      this.customTemplatesCount =
        this.templates.filter((x: any) => x.template_type === 'CUSTOM').length;

      this.approvedTemplatesCount =
        this.templates.filter((x: any) => x.approval_status === 'APPROVED').length;

      this.apiLoading = false;
    },

    (err: any) => {
      this.toastService.showError(err);
      this.apiLoading = false;
    }

  );
}

  // ── GET count ─────────────────────────────────────────────────────────────
  getTemplatesCount(filter = {}): void {
    this.leadsService.getWhatsappTemplatesCount(filter).subscribe(
      (count: any) => { this.templatesCount = count; },
      (err: any)   => { this.toastService.showError(err); }
    );
  }

  // ── GET data ──────────────────────────────────────────────────────────────
  getTemplatesData(filter = {}): void {
    this.apiLoading = true;
    this.leadsService.getWhatsappTemplatesFromDB(filter).subscribe(
      (res: any) => {
        this.templates  = res.data || [];
        this.apiLoading = false;
      },
      (err: any) => {
        this.toastService.showError(err);
        this.apiLoading = false;
      }
    );
  }

  // ── SEARCH ────────────────────────────────────────────────────────────────
  onSearchChange(value: string): void {
    if (!value) {
      this.searchFilter = {};
      if (this.templateTable) this.templateTable.reset();
    }
  }

  filterWithName(): void {
    const trimmed = this.searchText?.trim() || '';
    if (!trimmed) {
      this.searchFilter = {};
    } else {
      this.searchFilter = { 'name-like': trimmed };
    }
    this.loadTemplates(this.currentTableEvent);
  }

  // ── FILTER CHANGES ────────────────────────────────────────────────────────
  onApprovalStatusChange(): void {
    if (this.templateTable) this.templateTable.reset();
    this.loadTemplates(null);
  }

  onCategoryChange(): void {
    if (this.templateTable) this.templateTable.reset();
    this.loadTemplates(null);
  }

  // ── DIALOG ────────────────────────────────────────────────────────────────
  openCreateDialog(): void {
    this.editTemplateData = null;
    this.showCreateDialog = true;
  }

  openEditDialog(template: any): void {
    this.editTemplateData = { ...template };
    this.showCreateDialog = true;
  }

  onDialogClose(): void {
    this.showCreateDialog = false;
    this.editTemplateData = null;
  }

  onTemplateSaved(): void {
    this.showCreateDialog = false;
    this.loadTemplates(this.currentTableEvent);
  }

  openPreview(template: any): void {
    this.selectedTemplate = template;
    this.showPreviewDialog = true;
  }

  // ── YOUR EXISTING LOGIC — NOT TOUCHED ─────────────────────────────────────
  selectTemplate(template: any): void {
    this.selectedTemplate = template;
    this.templateSelected.emit(template);
  }

  deleteTemplate(template: any): void {
    if (!confirm(`Delete template "${template.name}"?`)) return;
    this.leadsService.deleteWhatsappTemplate(template.id).subscribe(
      () => {
        this.toastService.showSuccess('Template deleted');
        this.loadTemplates(this.currentTableEvent);
        if (this.selectedTemplate?.id === template.id) {
          this.selectedTemplate = null;
          this.templateSelected.emit(null);
        }
      },
      () => this.toastService.showError('Failed to delete template')
    );
  }

  refreshTemplateStatus(template: any): void {
    this.leadsService.checkWhatsappTemplateStatus(template.id).subscribe(
      (res: any) => {
        template.approval_status  = res.approval_status;
        template.rejection_reason = res.rejection_reason;
        this.toastService.showSuccess(`Status: ${res.approval_status}`);
      },
      () => this.toastService.showError('Failed to check status')
    );
  }

  syncAllTemplateStatus(): void {
    this.isSyncing = true;
    this.leadsService.syncWhatsappTemplateStatus().subscribe(
      (res: any) => {
        this.isSyncing = false;
        this.toastService.showSuccess(res.message);
        this.loadTemplates(this.currentTableEvent);
      },
      () => {
        this.isSyncing = false;
        this.toastService.showError('Failed to sync');
      }
    );
  }

  isSubmitting(id: number): boolean {
  return this.submittingIds.has(id);
}

submitToMeta(template: any): void {
  if (this.submittingIds.has(template.id)) return;
  if (!confirm(`Submit "${template.name}" to Meta for approval?`)) return;

  this.submittingIds.add(template.id);
  this.leadsService.submitWhatsappTemplate(template.id).subscribe(
    (res: any) => {
      this.submittingIds.delete(template.id);
      this.toastService.showSuccess(`Submitted! Status: ${res.metaStatus || 'SUBMITTED'}`);
      this.loadTemplates(this.currentTableEvent);
    },
    (err: any) => {
      this.submittingIds.delete(template.id);
      this.toastService.showError('Submit failed: ' + (err?.error?.error || 'Unknown error'));
    }
  );
}

get totalPages(): number {
  return Math.ceil(this.templatesCount / this.initialRows);
}
 
getPageNumbers(): number[] {
  const total = this.totalPages;
  const cur   = this.currentPage;
  // Show up to 5 page buttons, centered on current page
  let start = Math.max(0, cur - 2);
  let end   = Math.min(total - 1, start + 4);
  start = Math.max(0, end - 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
 
minVal(a: number, b: number): number {
  return Math.min(a, b);
}
 
onPageChange(page: number): void {
  this.currentPage = page;
  const event = {
    ...this.currentTableEvent,
    first: page * this.initialRows,
    rows:  this.initialRows,
  };
  this.loadTemplates(event);
}
 
onRowsChange(event: Event): void {
  this.initialRows  = Number((event.target as HTMLSelectElement).value);
  this.currentPage  = 0;
  this.loadTemplates({ first: 0, rows: this.initialRows, sortOrder: -1 });
}

changeTab(tab: string): void {

  this.activeTab = tab;

  // Reset filters
  this.searchFilter = {};
  this.searchText = '';

  // META Templates
  if (tab === 'META') {

    this.selectedApprovalStatus = 'ALL';

  }

  // CUSTOM Templates
  else if (tab === 'CUSTOM') {

    // Example filter
    this.searchFilter['template_type-eq'] = 'CUSTOM';

  }

  // APPROVED Templates
  else if (tab === 'APPROVED') {

    this.selectedApprovalStatus = 'APPROVED';

  }

  // Reload templates
  this.loadTemplates({
    first: 0,
    rows: this.initialRows,
    sortOrder: -1,
  });
}
  goBack(): void { this.location.back(); }
}