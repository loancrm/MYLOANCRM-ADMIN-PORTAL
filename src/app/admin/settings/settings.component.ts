import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @ViewChild('remarksTable') remarksTable!: Table;

  // ── Table ──────────────────────────────────────────────
  remarks: any[] = [];
  remarksCount: number = 0;
  loading: boolean = false;
  currentTableEvent: any;

  // ── Dialog ─────────────────────────────────────────────
  showDialog: boolean = false;
  editMode: boolean = false;
  currentRemarkId: any = null;
  remarkForm!: FormGroup;

  // ── Filters ────────────────────────────────────────────
  selectedStatusFilter: string = 'all';
  statusFilterOptions = [
    { label: 'All',      value: 'all' },
    { label: 'Active',   value: '1'   },
    { label: 'Inactive', value: '2'   },
  ];

  // ── Constants ──────────────────────────────────────────
  leadStatus               = projectConstantsLocal.REMARK_STATUS;
  remarkInternalStatusList = projectConstantsLocal.REMARKS_STATUS;

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initRemarkForm();
  }

  // ── Form ───────────────────────────────────────────────

  initRemarkForm() {
    this.remarkForm = this.fb.group({
      status:      ['', Validators.required],
      displayName: ['', Validators.required],
    });
  }

  // ── Load ───────────────────────────────────────────────

  loadRemarks(event: any) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

    if (this.selectedStatusFilter === 'all') {
      api_filter['remarkInternalStatus-or'] = '1,2';
    } else {
      api_filter['remarkInternalStatus-eq'] = this.selectedStatusFilter;
    }

    this.getRemarksCount(api_filter);
    this.getRemarks(api_filter);
  }

  getRemarks(filter = {}) {
    this.loading = true;
    this.leadsService.getAdminRemarks(filter).subscribe(
      (data: any) => {
        this.remarks = data;
        this.loading = false;
      },
      (error: any) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  getRemarksCount(filter = {}) {
    this.leadsService.getAdminRemarksCount(filter).subscribe(
      (count: any) => { this.remarksCount = count; },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  // ── Filter Change ──────────────────────────────────────

  onStatusFilterChange(event: any) {
    this.selectedStatusFilter = event.value;
    if (this.remarksTable) {
      this.remarksTable.first = 0;
    }
    const tableEvent = this.currentTableEvent
      ? { ...this.currentTableEvent, first: 0 }
      : { first: 0, rows: 10 };
    this.loadRemarks(tableEvent);
  }

  // ── Dialog ─────────────────────────────────────────────

  openDialog(remark?: any) {
    this.editMode = !!remark;
    if (remark) {
      this.currentRemarkId = remark.remarkId;
      this.remarkForm.patchValue({
        status:      remark.status,
        displayName: remark.displayName,
      });
    } else {
      this.currentRemarkId = null;
      this.remarkForm.reset();
    }
    this.showDialog = true;
  }

  saveRemark() {
    if (this.remarkForm.invalid) {
      this.remarkForm.markAllAsTouched();
      return;
    }
    const payload = this.remarkForm.value;

    const req = this.editMode
      ? this.leadsService.updateAdminRemark(this.currentRemarkId, payload)
      : this.leadsService.addAdminRemark(payload);

    req.subscribe(
      () => {
        this.showDialog = false;
        this.toastService.showSuccess(
          this.editMode ? 'Remark updated successfully' : 'Remark added successfully'
        );
        this.loadRemarks(this.currentTableEvent);
      },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  // ── Delete ─────────────────────────────────────────────

  deleteRemark(remarkId: any) {
    this.leadsService.deleteAdminRemark(remarkId).subscribe(
      () => {
        this.toastService.showSuccess('Remark deleted successfully');
        this.loadRemarks(this.currentTableEvent);
      },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  // ── Status Change ──────────────────────────────────────

  changeRemarkInternalStatus(remarkId: any, statusId: number) {
    this.leadsService.changeAdminRemarkInternalStatus(remarkId, statusId).subscribe(
      () => {
        this.toastService.showSuccess('Status updated successfully');
        this.loadRemarks(this.currentTableEvent);
      },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  // ── Helpers ────────────────────────────────────────────

  getTypeName(statusId: string | number): string {
    const status = this.leadStatus.find(
      (s: any) => s.id === statusId?.toString()
    );
    return status ? status.displayName : '-';
  }
   goBack() {
    this.location.back();
  }

}