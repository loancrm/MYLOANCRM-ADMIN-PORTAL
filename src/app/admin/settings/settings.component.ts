
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

  // ── Remarks ────────────────────────────────────────────────────────────────
  @ViewChild('remarksTable') remarksTable!: Table;

  remarks: any[]       = [];
  remarksCount         = 0;
  loading              = false;
  currentTableEvent: any;

  showRemarkDialog     = false;
  editRemarkMode       = false;
  currentRemarkId: any = null;
  remarkForm!: FormGroup;

  selectedStatusFilter = 'all';
  statusFilterOptions  = [
    { label: 'All',      value: 'all' },
    { label: 'Active',   value: '1'   },
    { label: 'Inactive', value: '2'   },
  ];

  leadStatus               = projectConstantsLocal.REMARK_STATUS;
  remarkInternalStatusList = projectConstantsLocal.REMARKS_STATUS;

  // ── Slots ──────────────────────────────────────────────────────────────────
  @ViewChild('slotsTable') slotsTable!: Table;

  slots: any[]         = [];
  slotsCount           = 0;
  slotsLoading         = false;
  currentSlotsEvent: any;

  showSlotDialog       = false;
  editSlotMode         = false;
  currentSlotId: any   = null;
  slotForm!: FormGroup;

  selectedSlotStatusFilter = 'all';
  slotStatusFilterOptions  = [
    { label: 'All',      value: 'all' },
    { label: 'Active',   value: '1'   },
    { label: 'Inactive', value: '2'   },
  ];

  // ── Slot Config ────────────────────────────────────────────────────────────
  maxUsersPerSlot = 5;

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initRemarkForm();
    this.initSlotForm();
    this.loadSlotConfig();
  }

  // ── Form init ──────────────────────────────────────────────────────────────

  initRemarkForm() {
    this.remarkForm = this.fb.group({
      status:      ['', Validators.required],
      displayName: ['', Validators.required],
    });
  }

  initSlotForm() {
    this.slotForm = this.fb.group({
      // Pattern: 1-12 : 00-59 space AM/PM  (case-insensitive)
      slot_time: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i)]],
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  REMARKS
  // ══════════════════════════════════════════════════════════════════════════

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
      (data: any) => { this.remarks = data; this.loading = false; },
      (error: any) => { this.toastService.showError(error); this.loading = false; }
    );
  }

  getRemarksCount(filter = {}) {
    this.leadsService.getAdminRemarksCount(filter).subscribe(
      (count: any) => { this.remarksCount = count; },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  onStatusFilterChange(event: any) {
    this.selectedStatusFilter = event.value;
    if (this.remarksTable) this.remarksTable.first = 0;
    const ev = this.currentTableEvent ? { ...this.currentTableEvent, first: 0 } : { first: 0, rows: 10 };
    this.loadRemarks(ev);
  }

  openRemarkDialog(remark?: any) {
    this.editRemarkMode = !!remark;
    if (remark) {
      this.currentRemarkId = remark.remarkId;
      this.remarkForm.patchValue({ status: remark.status, displayName: remark.displayName });
    } else {
      this.currentRemarkId = null;
      this.remarkForm.reset();
    }
    this.showRemarkDialog = true;
  }

  saveRemark() {
    if (this.remarkForm.invalid) { this.remarkForm.markAllAsTouched(); return; }

    const req = this.editRemarkMode
      ? this.leadsService.updateAdminRemark(this.currentRemarkId, this.remarkForm.value)
      : this.leadsService.addAdminRemark(this.remarkForm.value);

    req.subscribe(
      () => {
        this.showRemarkDialog = false;
        this.toastService.showSuccess(this.editRemarkMode ? 'Remark updated successfully' : 'Remark added successfully');
        this.loadRemarks(this.currentTableEvent);
      },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  deleteRemark(remarkId: any) {
    this.leadsService.deleteAdminRemark(remarkId).subscribe(
      () => { this.toastService.showSuccess('Remark deleted successfully'); this.loadRemarks(this.currentTableEvent); },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  changeRemarkInternalStatus(remarkId: any, statusId: number) {
    this.leadsService.changeAdminRemarkInternalStatus(remarkId, statusId).subscribe(
      () => { this.toastService.showSuccess('Status updated successfully'); this.loadRemarks(this.currentTableEvent); },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  getTypeName(statusId: string | number): string {
    const s = this.leadStatus.find((x: any) => x.id === statusId?.toString());
    return s ? s.displayName : '-';
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SLOT CONFIG
  // ══════════════════════════════════════════════════════════════════════════

  loadSlotConfig() {
    this.leadsService.getSlotConfig().subscribe(
      (data: any) => { this.maxUsersPerSlot = data?.max_users_per_slot || 5; },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  saveSlotConfig() {
    if (!this.maxUsersPerSlot || this.maxUsersPerSlot < 1) {
      this.toastService.showError('Must be at least 1'); return;
    }
    this.leadsService.updateSlotConfig({ max_users_per_slot: this.maxUsersPerSlot }).subscribe(
      () => { this.toastService.showSuccess('Config saved successfully'); },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SLOTS TABLE
  // ══════════════════════════════════════════════════════════════════════════

  loadSlots(event: any) {
    this.currentSlotsEvent = event;

    const filter: any = { from: event.first, count: event.rows };
    if (this.selectedSlotStatusFilter !== 'all') {
      filter['status'] = this.selectedSlotStatusFilter;
    }

    this.slotsLoading = true;

    this.leadsService.getSlotSettingsCount(filter).subscribe(
      (count: any) => { this.slotsCount = Number(count); },
      (error: any) => { this.toastService.showError(error); }
    );

    this.leadsService.getSlotSettings(filter).subscribe(
      (data: any) => { this.slots = data; this.slotsLoading = false; },
      (error: any) => { this.toastService.showError(error); this.slotsLoading = false; }
    );
  }

  onSlotStatusFilterChange(event: any) {
    this.selectedSlotStatusFilter = event.value;
    if (this.slotsTable) this.slotsTable.first = 0;
    const ev = this.currentSlotsEvent ? { ...this.currentSlotsEvent, first: 0 } : { first: 0, rows: 10 };
    this.loadSlots(ev);
  }

  openSlotDialog(slot?: any) {
    this.editSlotMode = !!slot;
    if (slot) {
      this.currentSlotId = slot.id;
      this.slotForm.patchValue({ slot_time: slot.slot_time });
    } else {
      this.currentSlotId = null;
      this.slotForm.reset();
    }
    this.showSlotDialog = true;
  }

  saveSlot() {
    if (this.slotForm.invalid) { this.slotForm.markAllAsTouched(); return; }

    const req = this.editSlotMode
      ? this.leadsService.updateSlotSetting(this.currentSlotId, this.slotForm.value)
      : this.leadsService.createSlotSetting(this.slotForm.value);

    req.subscribe(
      () => {
        this.showSlotDialog = false;
        this.toastService.showSuccess(this.editSlotMode ? 'Slot updated successfully' : 'Slot added successfully');
        this.loadSlots(this.currentSlotsEvent || { first: 0, rows: 10 });
      },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  changeSlotStatus(slotId: number, statusId: number) {
    this.leadsService.changeSlotSettingStatus(slotId, statusId).subscribe(
      () => {
        this.toastService.showSuccess('Slot status updated');
        this.loadSlots(this.currentSlotsEvent || { first: 0, rows: 10 });
      },
      (error: any) => { this.toastService.showError(error); }
    );
  }

  goBack() { this.location.back(); }
}