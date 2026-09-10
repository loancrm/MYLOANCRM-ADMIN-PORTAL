import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';

type RangePreset = 'all' | 'thisMonth' | 'lastMonth' | 'custom';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {
  @ViewChild('subTable') subTable!: Table;
  @ViewChild('walletTable') walletTable!: Table;

  // Super Admin (role 1) sees all data + the "Assigned To" filter.
  loggedInUserRole = 0;

  // ── Date range (drives analytics cards/charts + both tables) ──
  //  Default view on first load = current month.
  rangePreset: RangePreset = 'thisMonth';
  fromDate: Date | null = null;
  toDate: Date | null = null;

  rangeOptions: { label: string; value: RangePreset }[] = [
    { label: 'All', value: 'all' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom Range', value: 'custom' },
  ];

  // ── Analytics (KPI cards only — charts removed) ──
  analyticsLoading = false;
  analytics: any = null;

  // ── Subscriptions table ──
  subscriptions: any[] = [];
  subscriptionsCount = 0;
  subSummary: any = { count: 0, planAmount: 0, creditApplied: 0, paid: 0 };
  subLoading = false;
  private subEvent: any;
  subSearch = '';
  subStatus: string | null = null;
  subPlans: string[] = [];
  subGateway: string | null = null;
  subKind: string | null = null;

  subStatusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
  ];
  subPlanOptions: { label: string; value: string }[] = [];
  // plans that may exist even with 0 rows in the current range
  private knownPlans = ['Free Trial', 'Basic', 'Premium', 'Professional'];
  subGatewayOptions = [
    { label: 'All Gateways', value: null },
    { label: 'Razorpay', value: 'RAZORPAY' },
    { label: 'Cashfree', value: 'CASHFREE' },
  ];
  // New (first payment) vs Renewal
  subKindOptions = [
    { label: 'All', value: null },
    { label: 'New (First Payment)', value: 'new' },
    { label: 'Renewal', value: 'renewal' },
  ];

  // ── Assigned-To filter (role 1 only, shared by both tabs) ──
  assignOptions: { label: string; value: any }[] = [];
  selectedAssigns: any[] = [];

  // ── Wallet transactions table ──
  walletTransactions: any[] = [];
  walletTransactionsCount = 0;
  walletSummary: any = {
    count: 0,
    totalAmount: 0,
    totalNet: 0,
    totalGst: 0,
    totalCredit: 0,
    totalDebit: 0,
  };
  walletLoading = false;
  private walletEvent: any;
  walletSearch = '';
  walletType: string | null = null;
  walletStatuses: string[] = [];
  walletGateway: string | null = null;

  walletTypeOptions = [
    { label: 'All Types', value: null },
    { label: 'Credit', value: 'CREDIT' },
    { label: 'Debit', value: 'DEBIT' },
  ];
  walletStatusOptions = [
    { label: 'Success', value: 'SUCCESS' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Captured', value: 'captured' },
    { label: 'Authorized', value: 'authorized' },
    { label: 'User Dropped', value: 'USER_DROPPED' },
  ];
  walletGatewayOptions = [
    { label: 'All Gateways', value: null },
    { label: 'Razorpay', value: 'RAZORPAY' },
    { label: 'Cashfree', value: 'CASHFREE' },
  ];

  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const adminDetails = JSON.parse(
      localStorage.getItem('adminDetails') || '{}',
    );
    this.loggedInUserRole = Number(adminDetails?.user?.role || 0);

    // Populate the plan dropdown right away so it is never empty, even if the
    // analytics call is slow or fails (analytics only enriches this list).
    this.buildPlanOptions();

    if (this.loggedInUserRole === 1) {
      this.loadAssignOptions();
    }

    // Seed the "This Month" range before the tables fire their first
    // lazy-load, so the initial table data is already scoped to this month.
    this.setPresetDates('thisMonth');
    this.loadAnalytics();
  }

  private loadAssignOptions(): void {
    this.leadsService.getUsers({ 'status-eq': 1 }).subscribe(
      (data: any) => {
        this.assignOptions = (data || [])
          .filter((u: any) => u && u.id != null)
          .map((u: any) => ({ label: u.name || 'User #' + u.id, value: u.id }));
      },
      () => {},
    );
  }

  onAssignChange(): void {
    this.reloadSubscriptions();
    this.reloadWallet();
  }

  onSubSearchChange(v: string): void {
    // when the box is cleared, fall back to the default (unfiltered) data
    if (!v || !v.trim()) this.reloadSubscriptions();
  }

  onWalletSearchChange(v: string): void {
    if (!v || !v.trim()) this.reloadWallet();
  }

  goBack(): void {
    this.location.back();
  }

  // ─────────────────────────────────────────────────────────────
  //  Date range
  // ─────────────────────────────────────────────────────────────
  private fmtDate(d: Date | null): string | null {
    if (!d) return null;
    const dt = new Date(d);
    const m = `${dt.getMonth() + 1}`.padStart(2, '0');
    const day = `${dt.getDate()}`.padStart(2, '0');
    return `${dt.getFullYear()}-${m}-${day}`;
  }

  private setPresetDates(preset: RangePreset): void {
    const now = new Date();
    if (preset === 'all') {
      this.fromDate = null;
      this.toDate = null;
    } else if (preset === 'thisMonth') {
      this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      this.toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 'lastMonth') {
      this.fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      this.toDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }
    // 'custom' -> leave dates as-is, user picks them
  }

  onRangePresetChange(preset: RangePreset): void {
    this.rangePreset = preset;
    this.setPresetDates(preset);
    if (preset !== 'custom') this.applyRange();
  }

  onCustomDateChange(): void {
    this.rangePreset = 'custom';
    this.applyRange();
  }

  applyRange(): void {
    this.loadAnalytics();
    this.reloadSubscriptions();
    this.reloadWallet();
  }

  private dateRangeParams(column: string): any {
    const params: any = {};
    const f = this.fmtDate(this.fromDate);
    const t = this.fmtDate(this.toDate);
    if (f) params[`${column}-gte`] = `${f} 00:00:00`;
    if (t) params[`${column}-lte`] = `${t} 23:59:59`;
    return params;
  }

  // ─────────────────────────────────────────────────────────────
  //  Analytics
  // ─────────────────────────────────────────────────────────────
  loadAnalytics(): void {
    const params: any = {};
    const f = this.fmtDate(this.fromDate);
    const t = this.fmtDate(this.toDate);
    if (f) params['fromDate'] = f;
    if (t) params['toDate'] = t;

    this.analyticsLoading = true;
    this.leadsService.getPaymentsAnalytics(params).subscribe(
      (res: any) => {
        this.analytics = res || null;
        this.buildPlanOptions();
        this.analyticsLoading = false;
      },
      (err) => {
        this.analyticsLoading = false;
        this.toastService.showError(err);
      },
    );
  }

  private buildPlanOptions(): void {
    const dynamic = (this.analytics?.subscriptions?.byPlan || [])
      .map((p: any) => p.planName)
      .filter((n: string) => !!n && n !== 'Unknown');
    const all = Array.from(new Set([...this.knownPlans, ...dynamic]));
    this.subPlanOptions = all.map((p: string) => ({ label: p, value: p }));
  }

  // ─────────────────────────────────────────────────────────────
  //  Subscriptions table
  // ─────────────────────────────────────────────────────────────
  private buildSubFilter(): any {
    const searchFilter: any = {};
    // one box, matches business name OR account id (backend handles the OR)
    if (this.subSearch?.trim()) searchFilter['search'] = this.subSearch.trim();
    if (this.subStatus) searchFilter['status-eq'] = this.subStatus;
    if (this.subPlans?.length)
      searchFilter['plan_name-in'] = this.subPlans.join(',');
    if (this.subGateway) searchFilter['payment_gateway-eq'] = this.subGateway;
    if (this.subKind) searchFilter['subscriptionKind'] = this.subKind;
    if (this.loggedInUserRole === 1 && this.selectedAssigns?.length)
      searchFilter['assign_to-in'] = this.selectedAssigns.join(',');
    return Object.assign({}, searchFilter, this.dateRangeParams('created_on'));
  }

  loadSubscriptions(event: any): void {
    this.subEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.buildSubFilter());

    this.subLoading = true;
    this.leadsService.getPaymentsSubscriptions(api_filter).subscribe(
      (res: any) => {
        this.subscriptions = res || [];
        this.subLoading = false;
      },
      (err) => {
        this.subLoading = false;
        this.toastService.showError(err);
      },
    );

    this.leadsService.getPaymentsSubscriptionsCount(api_filter).subscribe(
      (count: any) => (this.subscriptionsCount = parseInt(count) || 0),
      (err) => console.error(err),
    );

    this.leadsService.getPaymentsSubscriptionsSummary(api_filter).subscribe(
      (res: any) => (this.subSummary = res || this.subSummary),
      (err) => console.error(err),
    );
  }

  reloadSubscriptions(): void {
    if (this.subTable) {
      this.subTable.first = 0;
      this.loadSubscriptions({
        ...(this.subEvent || {}),
        first: 0,
        rows: this.subTable.rows || 10,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  Wallet transactions table
  // ─────────────────────────────────────────────────────────────
  private buildWalletFilter(): any {
    const searchFilter: any = {};
    // one box, matches business name OR account id (backend handles the OR)
    if (this.walletSearch?.trim())
      searchFilter['search'] = this.walletSearch.trim();
    if (this.walletType) searchFilter['transactionType-eq'] = this.walletType;
    if (this.walletStatuses?.length)
      searchFilter['paymentStatus-in'] = this.walletStatuses.join(',');
    if (this.walletGateway)
      searchFilter['paymentGateway-eq'] = this.walletGateway;
    if (this.loggedInUserRole === 1 && this.selectedAssigns?.length)
      searchFilter['assign_to-in'] = this.selectedAssigns.join(',');
    return Object.assign({}, searchFilter, this.dateRangeParams('created_on'));
  }

  loadWalletTransactions(event: any): void {
    this.walletEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.buildWalletFilter());

    this.walletLoading = true;
    this.leadsService.getPaymentsWalletTransactions(api_filter).subscribe(
      (res: any) => {
        this.walletTransactions = res || [];
        this.walletLoading = false;
      },
      (err) => {
        this.walletLoading = false;
        this.toastService.showError(err);
      },
    );

    this.leadsService.getPaymentsWalletTransactionsCount(api_filter).subscribe(
      (count: any) => (this.walletTransactionsCount = parseInt(count) || 0),
      (err) => console.error(err),
    );

    this.leadsService
      .getPaymentsWalletTransactionsSummary(api_filter)
      .subscribe(
        (res: any) => (this.walletSummary = res || this.walletSummary),
        (err) => console.error(err),
      );
  }

  reloadWallet(): void {
    if (this.walletTable) {
      this.walletTable.first = 0;
      this.loadWalletTransactions({
        ...(this.walletEvent || {}),
        first: 0,
        rows: this.walletTable.rows || 10,
      });
    }
  }

  // ── UI helpers ──
  subStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge bg-success';
      case 'Expired':
        return 'badge bg-danger';
      case 'Cancelled':
        return 'badge bg-secondary';
      case 'Trial':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-light text-dark';
    }
  }

  walletStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (['success', 'captured', 'authorized'].includes(s))
      return 'badge bg-success';
    if (s === 'pending') return 'badge bg-warning text-dark';
    if (s === 'failed') return 'badge bg-danger';
    return 'badge bg-light text-dark';
  }

  matchClass(kind: string): string {
    switch (kind) {
      case 'linked':
        return 'badge bg-success';
      case 'date-matched':
        return 'badge bg-info text-dark';
      case 'estimated':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-light text-dark';
    }
  }

  matchLabel(kind: string): string {
    switch (kind) {
      case 'linked':
        return 'Txn ID';
      case 'date-matched':
        return 'Date match';
      case 'estimated':
        return 'Est. −credit';
      default:
        return 'Plan amt';
    }
  }
}
