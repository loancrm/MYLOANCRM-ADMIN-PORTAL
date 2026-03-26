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

  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // nothing here — AfterViewInit triggers load
  }

  ngAfterViewInit(): void {
    // ── Same pattern as accounts sample ──────────────────────────────────
    if (this.templateTable) {
      this.templateTable.first = this.initialFirst;
      this.templateTable.rows  = this.initialRows;
      this.loadTemplates({
        first:     this.initialFirst,
        rows:      this.initialRows,
        sortOrder: -1,
      });
    }
  }

  // ── MAIN LOAD (lazy — same pattern as accounts loadAccounts) ──────────────
  // loadTemplates(event: any): void {
  //   if (!event) {
  //     event = {
  //       first:     this.initialFirst,
  //       rows:      this.initialRows,
  //       sortOrder: -1,
  //     };
  //   }

  //   this.currentTableEvent = event;

  //   // ── Build API filter from PrimeNG table event ─────────────────────────
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  //   // ── Merge search filter ───────────────────────────────────────────────
  //   api_filter = Object.assign({}, api_filter, this.searchFilter);

  //   // ── Approval status filter ────────────────────────────────────────────
  //   if (this.selectedApprovalStatus && this.selectedApprovalStatus !== 'ALL') {
  //     api_filter['approval_status-eq'] = this.selectedApprovalStatus;
  //   }

  //   // ── Category filter ───────────────────────────────────────────────────
  //   if (this.selectedCategory && this.selectedCategory !== 'ALL') {
  //     api_filter['category-eq'] = this.selectedCategory;
  //   }

  //   // ── Call count + data APIs ────────────────────────────────────────────
  //   this.getTemplatesCount(api_filter);
  //   this.getTemplatesData(api_filter);
  // }
  loadTemplates(event: any): void {
  if (!event) {
    event = { first: this.initialFirst, rows: this.initialRows, sortOrder: -1 };
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

  // ✅ ONE call — no separate count API needed
  this.apiLoading = true;
  this.leadsService.getWhatsappTemplatesFromDB(api_filter).subscribe(
    (res: any) => {
      this.templates      = res.data  || [];
      this.templatesCount = res.total || 0;  // ✅ total from same response
      this.apiLoading     = false;
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

  goBack(): void { this.location.back(); }
}