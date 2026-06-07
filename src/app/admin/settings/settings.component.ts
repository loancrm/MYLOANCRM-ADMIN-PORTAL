
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Clipboard } from '@angular/cdk/clipboard'; 

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

    // ── Table ──────────────────────────────────────────────────────────────
  @ViewChild('plTable') plTable!: Table;
 
  paymentLinks: any[]      = [];
  paymentLinksCount        = 0;
  plLoading                = false;
  currentPlEvent: any;
 
  // ── Filters ────────────────────────────────────────────────────────────
  selectedPlStatusFilter   = 'all';
  plStatusFilterOptions    = [
    { label: 'All',               value: 'all'            },
    { label: 'Created (Pending)', value: 'created'        },
    { label: 'Paid',              value: 'paid'           },
    { label: 'Partially Paid',    value: 'partially_paid' },
    { label: 'Cancelled',         value: 'cancelled'      },
    { label: 'Expired',           value: 'expired'        },
  ];
 
  // ── Create dialog ──────────────────────────────────────────────────────
  showPlDialog   = false;
  plCreating     = false;
  plForm!: FormGroup;
  minExpiryDate  = new Date();   // p-calendar min date
 
  // ── Detail dialog ──────────────────────────────────────────────────────
  showPlDetailDialog  = false;
  selectedPaymentLink: any = null;
  plNotes: { key: string; value: string }[] = []; 

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private location: Location,
    private clipboard: Clipboard,
  ) {}

  ngOnInit(): void {
    this.initRemarkForm();
    this.initSlotForm();
    this.loadSlotConfig();
    this.initPlForm();
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

  // initPlForm() {
  //   this.plForm = this.fb.group({
  //     amount:           [null, [Validators.required, Validators.min(1)]],
  //     description:      ['',   Validators.required],
  //     customer_name:    ['',   Validators.required],
  //     customer_contact: ['',   [Validators.required, Validators.pattern(/^\d{10}$/)]],
  //     customer_email:   ['',   [Validators.email]],
  //     expire_by:        [null, Validators.required],
  //     send_sms:         [true],
  //     send_email:       [false],
  //     reference_id:     [''],
  //   });
  // }

  initPlForm() {
    this.plForm = this.fb.group({
      amount:                   [null, [Validators.required, Validators.min(1)]],
      description:              ['',   Validators.required],
      customer_name:            ['',   Validators.required],
      customer_contact:         ['',   [Validators.required, Validators.pattern(/^\d{10}$/)]],
      customer_email:           ['',   [Validators.email]],
 
      // Expiry
      no_expiry:                [false],             // ← NEW
      expire_by:                [null],              // required only when no_expiry=false
 
      // Notifications
      send_sms:                 [true],
      send_email:               [false],
      reminder_enable:          [true],              // ← NEW
 
      // Partial payment
      accept_partial:           [false],             // ← NEW
      first_min_partial_amount: [null],              // ← NEW (paise – set by UX)
 
      // Reference
      reference_id:             [''],
    });
 
    // Reset notes list too
    this.plNotes = [];
 
    // When no_expiry is toggled, clear/restore the expire_by validator
    this.plForm.get('no_expiry')!.valueChanges.subscribe((noExpiry: boolean) => {
      const expireByCtrl = this.plForm.get('expire_by')!;
      if (noExpiry) {
        expireByCtrl.clearValidators();
        expireByCtrl.setValue(null);
      } else {
        expireByCtrl.setValidators(Validators.required);
      }
      expireByCtrl.updateValueAndValidity();
    });
 
    // When accept_partial is toggled, manage first_min_partial_amount validator
    this.plForm.get('accept_partial')!.valueChanges.subscribe((partial: boolean) => {
      const minCtrl = this.plForm.get('first_min_partial_amount')!;
      if (partial) {
        minCtrl.setValidators([Validators.min(1)]);
      } else {
        minCtrl.clearValidators();
        minCtrl.setValue(null);
      }
      minCtrl.updateValueAndValidity();
    });
  }
 
// ── Note helpers (ADD THESE METHODS) ──────────────────────────────────────
 
  addNote() {
    if (this.plNotes.length < 15) {
      this.plNotes.push({ key: '', value: '' });
    }
  }
 
  removeNote(index: number) {
    this.plNotes.splice(index, 1);
  }
 
// ── Replace createPaymentLink() with this ─────────────────────────────────
 
  createPaymentLink() {
    if (this.plForm.invalid) { this.plForm.markAllAsTouched(); return; }
 
    const v = this.plForm.value;
 
    // Validate notes (no empty keys)
    const validNotes = this.plNotes.filter(n => n.key?.trim() && n.value?.trim());
 
    // Convert Date → Unix timestamp (Razorpay expects seconds)
    const expireByUnix = (!v.no_expiry && v.expire_by)
      ? Math.floor(new Date(v.expire_by).getTime() / 1000)
      : null;
 
    const payload: any = {
      amount:          v.amount * 100,          // paise
      currency:        'INR',
      accept_partial:  v.accept_partial,
      description:     v.description,
      customer: {
        name:    v.customer_name,
        contact: v.customer_contact,
        email:   v.customer_email || undefined,
      },
      no_expiry:       v.no_expiry,
      expire_by:       expireByUnix,
      notify: {
        sms:   v.send_sms,
        email: v.send_email,
      },
      reminder_enable: v.reminder_enable,
      notes:           validNotes,
    };
 
    // Partial minimum (convert ₹ → paise)
    if (v.accept_partial && v.first_min_partial_amount && v.first_min_partial_amount > 0) {
      payload.first_min_partial_amount = v.first_min_partial_amount * 100;
    }
 
    if (v.reference_id?.trim()) {
      payload.reference_id = v.reference_id.trim();
    }
 
    this.plCreating = true;
 
    this.leadsService.createPaymentLink(payload).subscribe(
      (res: any) => {
        this.plCreating   = false;
        this.showPlDialog = false;
        this.toastService.showSuccess('Payment link created & sent successfully');
        this.loadPaymentLinks(this.currentPlEvent || { first: 0, rows: 10 });
      },
      (err: any) => {
        this.plCreating = false;
        this.toastService.showError(err);
      }
    );
  }

   loadPaymentLinks(event: any) {
    this.currentPlEvent = event;
 
    const filter: any = {
      from:  event.first,
      count: event.rows,
    };
 
    if (this.selectedPlStatusFilter !== 'all') {
      filter['status'] = this.selectedPlStatusFilter;
    }
 
    this.plLoading = true;
 
    this.leadsService.getPaymentLinksCount(filter).subscribe(
      (count: any) => { this.paymentLinksCount = Number(count); },
      (err: any)   => { this.toastService.showError(err); }
    );
 
    this.leadsService.getPaymentLinks(filter).subscribe(
      (data: any) => { this.paymentLinks = data; this.plLoading = false; },
      (err: any)  => { this.toastService.showError(err); this.plLoading = false; }
    );
  }
 
  // ── Filter change ──────────────────────────────────────────────────────
  onPlStatusFilterChange(event: any) {
    this.selectedPlStatusFilter = event.value;
    if (this.plTable) this.plTable.first = 0;
    const ev = this.currentPlEvent
      ? { ...this.currentPlEvent, first: 0 }
      : { first: 0, rows: 10 };
    this.loadPaymentLinks(ev);
  }
 
  // ── Open create dialog ─────────────────────────────────────────────────
  openPaymentLinkDialog() {
    this.initPlForm();
    this.minExpiryDate = new Date();
    this.showPlDialog  = true;
  }
 
  // ── Create & send ──────────────────────────────────────────────────────
  // createPaymentLink() {
  //   if (this.plForm.invalid) { this.plForm.markAllAsTouched(); return; }
 
  //   const v = this.plForm.value;
 
  //   // Convert Date → Unix timestamp (Razorpay expects seconds)
  //   const expireByUnix = Math.floor(new Date(v.expire_by).getTime() / 1000);
 
  //   const payload: any = {
  //     amount:      v.amount * 100,           // paise
  //     currency:    'INR',
  //     accept_partial: false,
  //     description: v.description,
  //     customer: {
  //       name:    v.customer_name,
  //       contact: v.customer_contact,
  //       email:   v.customer_email || undefined,
  //     },
  //     expire_by:   expireByUnix,
  //     notify: {
  //       sms:   v.send_sms,
  //       email: v.send_email,
  //     },
  //   };
 
  //   if (v.reference_id?.trim()) {
  //     payload.reference_id = v.reference_id.trim();
  //   }
 
  //   this.plCreating = true;
 
  //   this.leadsService.createPaymentLink(payload).subscribe(
  //     (res: any) => {
  //       this.plCreating    = false;
  //       this.showPlDialog  = false;
  //       this.toastService.showSuccess('Payment link created & sent successfully');
  //       this.loadPaymentLinks(this.currentPlEvent || { first: 0, rows: 10 });
  //     },
  //     (err: any) => {
  //       this.plCreating = false;
  //       this.toastService.showError(err);
  //     }
  //   );
  // }
 
  // ── Resend notification ────────────────────────────────────────────────
  resendPaymentLinkNotification(linkId: string) {
    this.leadsService.resendPaymentLinkNotification(linkId).subscribe(
      () => { this.toastService.showSuccess('Notification resent successfully'); },
      (err: any) => { this.toastService.showError(err); }
    );
  }
 
  // ── Cancel ─────────────────────────────────────────────────────────────
  cancelPaymentLink(linkId: string) {
    if (!confirm('Are you sure you want to cancel this payment link? This cannot be undone.')) {
      return;
    }
    this.leadsService.cancelPaymentLink(linkId).subscribe(
      () => {
        this.toastService.showSuccess('Payment link cancelled');
        this.loadPaymentLinks(this.currentPlEvent || { first: 0, rows: 10 });
      },
      (err: any) => { this.toastService.showError(err); }
    );
  }
 
  // ── View details ───────────────────────────────────────────────────────
  viewPaymentLinkDetails(pl: any) {
    // Fetch fresh from server to get latest payments array
    this.leadsService.getPaymentLinkById(pl.id).subscribe(
      (data: any) => {
        this.selectedPaymentLink   = data;
        this.showPlDetailDialog    = true;
      },
      (err: any) => { this.toastService.showError(err); }
    );
  }
 
  // ── Copy short URL ─────────────────────────────────────────────────────
  copyPaymentLink(url: string) {
    if (!url) return;
    // Works without CDK – fallback using execCommand
    try {
      const el = document.createElement('textarea');
      el.value = url;
      el.style.position = 'fixed';
      el.style.opacity  = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.toastService.showSuccess('Payment link copied to clipboard');
    } catch {
      this.toastService.showError('Could not copy link');
    }
  }

  goBack() { this.location.back(); }
}