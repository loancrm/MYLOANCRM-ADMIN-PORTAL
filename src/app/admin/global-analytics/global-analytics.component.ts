import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LeadsService } from '../leads/leads.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { RoutingService } from 'src/app/services/routing-service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-global-analytics',
  templateUrl: './global-analytics.component.html',
  styleUrl: './global-analytics.component.scss'
})
export class GlobalAnalyticsComponent implements OnInit, OnDestroy {

  @ViewChild('breakdownTable') breakdownTable: any;
  @ViewChild('cibilTable')     cibilTable:     any;
  @ViewChild('amountTable')    amountTable:    any;

  loading          = false;
  // ── Page-level loan type (KPI cards only) ──
  selectedLoanType = 'all';

  loanTypeOptions = [
    { label: 'All',                     value: 'all',                  short: 'All'   },
    { label: 'Business Loan',           value: 'businessLoan',         short: 'BL'    },
    { label: 'Personal Loan',           value: 'personalLoan',         short: 'PL'    },
    { label: 'Home Loan',               value: 'homeLoan',             short: 'HL'    },
    { label: 'Mortgage Loan',           value: 'lap',                  short: 'ML'    },
    { label: 'Professional Loan',       value: 'professionalLoans',    short: 'PF.L'  },
    { label: 'Car Loan',                value: 'carLoan',              short: 'CL'    },
    { label: 'Commercial Vehicle Loan', value: 'commercialVehicleLoan',short: 'CVL'   },
    { label: 'Educational Loan',        value: 'educationalLoan',      short: 'EDL'   },
  ];

  stats = {
    callbacks: 0, enquiries: 0, leads: 0, files: 0,
    credit: 0, logins: 0, sanctioned: 0, disbursed: 0,
    inhouseRejects: 0, bankRejects: 0, cniRejects: 0, bankers: 0,
    cibilReports: 0,cities: 0
  };

  // ── Breakdown dialog ──
  showBreakdownDialog  = false;
  breakdownLoading     = false;
  breakdownMetric      = '';
  breakdownMetricLabel = '';
  breakdownAccounts: any[] = [];
  breakdownTotal       = 0;
  breakdownSearch      = '';
  // Independent loan type for this dialog — does NOT affect the main page
  breakdownLoanType    = 'all';
  // Guard: blocks p-table auto-fire on component init
  breakdownDialogReady = false;

  // ── Cibil dialog ──
  showCibilDialog      = false;
  cibilDialogLoading   = false;
  cibilTypeSummary: any[] = [];
  cibilAccounts: any[] = [];
  cibilTotal           = 0;
  cibilGrandTotal      = 0;
  cibilSearch          = '';
  cibilSelectedType    = '';
  cibilDialogReady     = false;

  // ── Amount dialog ──
  showAmountDialog     = false;
  amountDialogLoading  = false;
  amountType: 'sanctioned' | 'disbursed' = 'sanctioned';
  amountDialogTitle    = '';
  amountAccounts: any[] = [];
  amountSummary: any[]  = [];
  amountTotal          = 0;
  amountGrandFiles     = 0;
  amountGrandTotal     = 0;
  amountSearch         = '';
  // Independent loan type for this dialog — does NOT affect the main page
  amountLoanType       = 'all';
  amountDialogReady    = false;

  // ── City dialog ──
showCityDialog      = false;
cityDialogLoading   = false;
cityAccounts: any[] = [];
cityTotal           = 0;
cityGrandTotal      = 0;
citySearch          = '';
cityDialogReady     = false;
// ── City right panel (accounts in selected city) ──
selectedCity         = '';
selectedCityTotal    = 0;
cityPanelLoading     = false;
cityPanelAccounts: any[] = [];
cityPanelTotal       = 0;
cityPanelSearch      = '';
cityPanelReady       = false;

// ── Lenders dialog ──
showLendersDialog      = false;
lendersDialogLoading   = false;
lendersAccounts: any[] = [];
lendersTotal           = 0;
lendersGrandTotal      = 0;
lendersSearch          = '';
lendersDialogReady     = false;

private lendersSearchSubject = new Subject<string>();

@ViewChild('lendersTable') lendersTable: any;

private cityPanelSearchSubject = new Subject<string>();

@ViewChild('cityPanelTable') cityPanelTable: any;

private citySearchSubject = new Subject<string>();

@ViewChild('cityTable') cityTable: any;

  private searchSubject       = new Subject<string>();
  private cibilSearchSubject  = new Subject<string>();
  private amountSearchSubject = new Subject<string>();
  private destroy$            = new Subject<void>();

  metricLabelMap: any = {
    leads: 'Leads', files: 'Files', logins: 'Logins',
    inhouseRejects: 'Inhouse Rejects', bankRejects: 'Bank Rejects',
    cniRejects: 'CNI Rejects', bankers: 'Bankers',
    sanctioned: 'Sanctioned',   // ← add
    disbursed:  'Disbursed',    // ← add
  };

  metricIconMap: any = {
    leads: 'pi-users', files: 'pi-folder-open', logins: 'pi-sign-in',
    inhouseRejects: 'pi-home', bankRejects: 'pi-building',
    cniRejects: 'pi-times-circle', bankers: 'pi-id-card',
    sanctioned: 'pi-check-circle',  // ← add
    disbursed:  'pi-wallet',        // ← add
  };
selectedAccount: any;
  constructor(private leadsService: LeadsService, private routingService: RoutingService,private location: Location,) {}

  ngOnInit(): void {
    // Load ONLY the KPI cards — no dialog APIs here
    this.loadAnalytics();
    this.citySearchSubject.pipe(
  debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)
).subscribe(() => {
  this.onCityLazyLoad({ first: 0, rows: 10 });
});

this.cityPanelSearchSubject.pipe(
  debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)
).subscribe(() => {
  this.onCityPanelLazyLoad({ first: 0, rows: 10 });
});

    // Debounced search — breakdown dialog
    this.searchSubject.pipe(
      debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onBreakdownLazyLoad({ first: 0, rows: 10 });
    });

    // Debounced search — cibil dialog
    this.cibilSearchSubject.pipe(
      debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onCibilLazyLoad({ first: 0, rows: 10 });
    });

    // Debounced search — amount dialog
    this.amountSearchSubject.pipe(
      debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onAmountLazyLoad({ first: 0, rows: 10 });
    });
    this.lendersSearchSubject.pipe(
  debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)
).subscribe(() => {
  this.onLendersLazyLoad({ first: 0, rows: 10 });
});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ════════════════════════════════
  // MAIN PAGE — KPI CARDS
  // ════════════════════════════════
  loadAnalytics(): void {
    this.loading = true;
    this.leadsService.getGlobalDashboardMetrics({ loanType: this.selectedLoanType }).subscribe(
      (res: any) => {
        const kpi = res.kpiMetrics || {};
        this.stats.callbacks      = kpi.callbacks?.total      || 0;
        this.stats.enquiries      = kpi.enquiries?.total      || 0;
        this.stats.leads          = kpi.leads?.total          || 0;
        this.stats.files          = kpi.files?.total          || 0;
        this.stats.credit         = kpi.credit?.total         || 0;
        this.stats.logins         = kpi.logins?.total         || 0;
        this.stats.sanctioned     = kpi.sanctioned?.total     || 0;
        this.stats.disbursed      = kpi.disbursed?.total      || 0;
        this.stats.inhouseRejects = kpi.inhouseRejects?.total || 0;
        this.stats.bankRejects    = kpi.bankRejects?.total    || 0;
        this.stats.cniRejects     = kpi.cniRejects?.total     || 0;
        this.stats.bankers        = kpi.bankers?.total        || 0;
        this.loading = false;
      },
      () => { this.loading = false; }
    );
    this.leadsService.getFetchedCibilReportsCount({}).subscribe(
      (res: any) => { this.stats.cibilReports = Number(res) || 0; }
    );
    this.leadsService.getCityWiseAccountCount().subscribe(
      (res: any) => { this.stats.cities = Number(res) || 0; }
    );
  }

  // Page-level loan type change — only reloads KPI cards, never touches dialogs
  onLoanTypeChange(): void {
    this.loadAnalytics();
  }

  // ════════════════════════════════
  // BREAKDOWN DIALOG
  // ════════════════════════════════

  // Called ONLY on card click
  openBreakdown(metric: string): void {
    this.breakdownMetric      = metric;
    this.breakdownMetricLabel = this.metricLabelMap[metric] || metric;
    this.breakdownSearch      = '';
    // this.breakdownLoanType    = 'all';   // reset dialog loan type filter
    this.breakdownLoanType = this.selectedLoanType;
    this.breakdownAccounts    = [];
    this.breakdownTotal       = 0;
    this.breakdownDialogReady = true;    // ← unlock API calls
    this.showBreakdownDialog  = true;
    // Manually fire first load — p-table onLazyLoad timing is unreliable
    this.onBreakdownLazyLoad({ first: 0, rows: 10 });
  }

  onBreakdownLazyLoad(event: any): void {
    // Guard: ignore any calls before card is clicked (p-table auto-fires on init)
    if (!this.breakdownDialogReady) return;

    this.breakdownLoading = true;
    const from  = event.first ?? 0;
    const count = event.rows  ?? 10;

    this.leadsService.getAccountWiseBreakdown(
      this.breakdownMetric,
      this.breakdownLoanType,   // ← uses dialog's own loan type, not the page's
      from,
      count,
      this.breakdownSearch.trim()
    ).subscribe(
      (res: any) => {
        this.breakdownAccounts = res.accounts || [];
        this.breakdownTotal    = res.total    || 0;
        this.breakdownLoading  = false;
      },
      () => { this.breakdownLoading = false; }
    );
  }

  onSearchChange(): void {
    this.searchSubject.next(this.breakdownSearch);
  }

  // Dialog-level loan type change — only reloads this dialog's table
  onBreakdownLoanTypeChange(): void {
    if (this.breakdownTable) { this.breakdownTable.first = 0; }
    this.onBreakdownLazyLoad({ first: 0, rows: 10 });
  }

  // Resets guard when dialog closes
  onBreakdownDialogHide(): void {
    this.breakdownDialogReady = false;
  }

  // ════════════════════════════════
  // CIBIL DIALOG
  // ════════════════════════════════

  // Called ONLY on card click
  openCibilBreakdown(): void {
    this.cibilSearch       = '';
    this.cibilSelectedType = '';
    this.cibilAccounts     = [];
    this.cibilTotal        = 0;
    this.cibilGrandTotal   = 0;
    this.cibilTypeSummary  = [];
    this.cibilDialogReady  = true;      // ← unlock API calls
    this.showCibilDialog   = true;
    this.onCibilLazyLoad({ first: 0, rows: 10 });
  }

  onCibilLazyLoad(event: any): void {
    if (!this.cibilDialogReady) return;

    this.cibilDialogLoading = true;
    const from  = event.first ?? 0;
    const count = event.rows  ?? 10;

    this.leadsService.getCibilBreakdown(
      from,
      count,
      this.cibilSearch.trim(),
      this.cibilSelectedType
    ).subscribe(
      (res: any) => {
        if (from === 0) {
          this.cibilTypeSummary = res.typeSummary || [];
          this.cibilGrandTotal  = res.grandTotal  || 0;
        }
        this.cibilAccounts      = res.accounts || [];
        this.cibilTotal         = res.total    || 0;
        this.cibilDialogLoading = false;
      },
      () => { this.cibilDialogLoading = false; }
    );
  }

  // Toggle type filter chip
  onCibilTypeSelect(cibilType: string): void {
    this.cibilSelectedType = this.cibilSelectedType === cibilType ? '' : cibilType;
    if (this.cibilTable) { this.cibilTable.first = 0; }
    this.onCibilLazyLoad({ first: 0, rows: 10 });
  }

  onCibilSearchChange(): void {
    this.cibilSearchSubject.next(this.cibilSearch);
  }

  onCibilDialogHide(): void {
    this.cibilDialogReady = false;
  }

  // ════════════════════════════════
  // AMOUNT DIALOG (Sanctioned / Disbursed)
  // ════════════════════════════════

  // Called ONLY on card click
  openAmountBreakdown(type: 'sanctioned' | 'disbursed'): void {
    this.amountType        = type;
    this.amountDialogTitle = type === 'sanctioned' ? 'Total Sanctioned' : 'Total Disbursed';
    this.amountSearch      = '';
    this.amountLoanType    = 'all';     // reset dialog loan type filter
    this.amountAccounts    = [];
    this.amountSummary     = [];
    this.amountTotal       = 0;
    this.amountGrandFiles  = 0;
    this.amountGrandTotal  = 0;
    this.amountDialogReady = true;      // ← unlock API calls
    this.showAmountDialog  = true;
    this.onAmountLazyLoad({ first: 0, rows: 10 });
  }

  onAmountLazyLoad(event: any): void {
    if (!this.amountDialogReady) return;

    this.amountDialogLoading = true;
    const from  = event.first ?? 0;
    const count = event.rows  ?? 10;

    this.leadsService.getSanctionedDisbursedBreakdown(
      this.amountType,
      this.amountLoanType,      // ← uses dialog's own loan type, not the page's
      from,
      count,
      this.amountSearch.trim()
    ).subscribe(
      (res: any) => {
        if (from === 0) {
          this.amountSummary    = res.summary     || [];
          this.amountGrandFiles = res.grandFiles  || 0;
          this.amountGrandTotal = res.grandAmount || 0;
        }
        this.amountAccounts      = res.accounts || [];
        this.amountTotal         = res.total    || 0;
        this.amountDialogLoading = false;
      },
      () => { this.amountDialogLoading = false; }
    );
  }

  onAmountSearchChange(): void {
    this.amountSearchSubject.next(this.amountSearch);
  }

  // Dialog-level loan type change — only reloads this dialog's table
  onAmountLoanTypeChange(): void {
    if (this.amountTable) { this.amountTable.first = 0; }
    this.onAmountLazyLoad({ first: 0, rows: 10 });
  }

  onAmountDialogHide(): void {
    this.amountDialogReady = false;
  }

  // ════════════════════════════════
  // HELPERS
  // ════════════════════════════════
  getMetricIcon(): string {
    return this.metricIconMap[this.breakdownMetric] || 'pi-chart-bar';
  }

  formatAmount(amount: number): string {
    if (!amount || amount === 0) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + ' Cr';
    if (amount >= 100000)   return '₹' + (amount / 100000).toFixed(1)   + ' L';
    if (amount >= 1000)     return '₹' + (amount / 1000).toFixed(1)     + ' K';
    return '₹' + amount;
  }

  getLoanTypeLabel(value: string): string {
    const found = this.loanTypeOptions.find(o => o.value === value);
    return found ? found.label : value;
  }

  getLoanTypeShort(value: string): string {
    const found = this.loanTypeOptions.find(o => o.value === value);
    return found ? found.short : value;
  }

  getCibilTypeIcon(type: string): string {
    const map: any = {
      'Individual': 'pi-user', 'Commercial': 'pi-building',
      'MSME': 'pi-briefcase',  'Unknown': 'pi-question-circle',
    };
    return map[type] || 'pi-file';
  }

  getCibilTypeColor(index: number): string {
    return ['#534AB7', '#0F6E56', '#993C1D', '#185FA5'][index % 4];
  }

  getCibilTypeBg(index: number): string {
    return ['#EEEDFE', '#E1F5EE', '#FAECE7', '#E6F1FB'][index % 4];
  }

  getAmountColor(): string {
    return this.amountType === 'sanctioned' ? '#0F6E56' : '#534AB7';
  }

  getAmountBg(): string {
    return this.amountType === 'sanctioned' ? '#E1F5EE' : '#EEEDFE';
  }

  getAmountIcon(): string {
    return this.amountType === 'sanctioned' ? 'pi-check-circle' : 'pi-wallet';
  }

  getLoanTypeSummaryColor(index: number): string {
    return ['#534AB7', '#0F6E56', '#993C1D', '#185FA5', '#854F0B', '#A32D2D'][index % 6];
  }

  getLoanTypeSummaryBg(index: number): string {
    return ['#EEEDFE', '#E1F5EE', '#FAECE7', '#E6F1FB', '#FAEEDA', '#FCEBEB'][index % 6];
  }

  openCityBreakdown(): void {
  this.citySearch      = '';
  this.cityAccounts    = [];
  this.cityTotal       = 0;
  this.cityGrandTotal  = 0;
  this.cityDialogReady = true;
  this.showCityDialog  = true;
  this.onCityLazyLoad({ first: 0, rows: 10 });
}

onCityLazyLoad(event: any): void {
  if (!this.cityDialogReady) return;

  this.cityDialogLoading = true;
  const from  = event.first ?? 0;
  const count = event.rows  ?? 10;

  this.leadsService.getCityWiseBreakdown(
    from, count, this.citySearch.trim()
  ).subscribe(
    (res: any) => {
      if (from === 0) {
        this.cityGrandTotal = res.grandTotal || 0;
      }
      this.cityAccounts      = res.cities  || [];
      this.cityTotal         = res.total   || 0;
      this.cityDialogLoading = false;
      if (from === 0 && this.cityAccounts.length > 0 && !this.selectedCity) {
  this.onCityRowClick(this.cityAccounts[0]);
}
    },
    () => { this.cityDialogLoading = false; }
  );
}

onCitySearchChange(): void {
  this.citySearchSubject.next(this.citySearch);
}

// onCityDialogHide(): void {
//   this.cityDialogReady = false;
// }

// Called when user clicks a city row in the left panel
onCityRowClick(city: any): void {
  this.selectedCity      = city.displayCity;
  this.selectedCityTotal = city.totalAccounts;
  this.cityPanelSearch   = '';
  this.cityPanelAccounts = [];
  this.cityPanelTotal    = 0;
  this.cityPanelReady    = true;
  if (this.cityPanelTable) { this.cityPanelTable.first = 0; }
  this.onCityPanelLazyLoad({ first: 0, rows: 10 });
}

onCityPanelLazyLoad(event: any): void {
  if (!this.cityPanelReady || !this.selectedCity) return;

  this.cityPanelLoading = true;
  const from  = event.first ?? 0;
  const count = event.rows  ?? 10;

  this.leadsService.getCityAccountsBreakdown(
    this.selectedCity,
    from,
    count,
    this.cityPanelSearch.trim()
  ).subscribe(
    (res: any) => {
      this.cityPanelAccounts = res.accounts || [];
      this.cityPanelTotal    = res.total    || 0;
      this.cityPanelLoading  = false;
    },
    () => { this.cityPanelLoading = false; }
  );
}

onCityPanelSearchChange(): void {
  this.cityPanelSearchSubject.next(this.cityPanelSearch);
}

onCityDialogHide(): void {
  this.cityDialogReady   = false;
  this.cityPanelReady    = false;
  this.selectedCity      = '';
  this.cityPanelAccounts = [];
}
viewAccount(event) {
    const lead = event.data;
    this.routingService.handleRoute('accounts/profile/' + lead.accountId, null);
  }
goBack() {
    this.location.back();
  }
//  viewAccountBreakdown(event: any): void {
//   const acc = event.data;  // ← onRowSelect gives { data: acc, ... }
  
//   this.routingService.handleRoute(
//     'allaccounts-analytics/leads-breakdown/' + acc.accountId,
//     null,                          // ← pass null for extras
//     {                              // ← query params as 3rd arg
//       metric:      this.breakdownMetric,
//       loanType:    this.breakdownLoanType,
//       accountName: acc.accountName,
//     }
//   );
// }
viewAccountBreakdown(event: any): void {
  const acc = event.data;

  // ✅ Capture BEFORE dialog state resets
  const metric      = this.breakdownMetric;
  const loanType    = this.breakdownLoanType;
  const accountName = acc.accountName;

  // Store so the breakdown page can read it
  sessionStorage.setItem('breakdownParams', JSON.stringify({
    metric,
    loanType,
    accountName,
  }));

  this.showBreakdownDialog = false; // close dialog first
  this.routingService.handleRoute(
    'allaccounts-analytics/leads-breakdown/' + acc.accountId,
    null
  );
}

viewAmountAccountBreakdown(event: any): void {
  const acc = event.data;

  // Capture BEFORE dialog state resets
  const metric      = this.amountType;           // 'sanctioned' or 'disbursed'
  const loanType    = this.amountLoanType;
  const accountName = acc.businessName;          // amount dialog uses businessName, not accountName

  sessionStorage.setItem('breakdownParams', JSON.stringify({
    metric,
    loanType,
    accountName,
  }));

  this.showAmountDialog = false;
  this.routingService.handleRoute(
    'allaccounts-analytics/leads-breakdown/' + acc.accountId,
    null
  );
}
 // ════════════════════════════════
// LENDERS DIALOG
// ════════════════════════════════

openLendersBreakdown(): void {
  this.lendersSearch      = '';
  this.lendersAccounts    = [];
  this.lendersTotal       = 0;
  this.lendersGrandTotal  = 0;
  this.lendersDialogReady = true;
  this.showLendersDialog  = true;
  this.onLendersLazyLoad({ first: 0, rows: 10 });
}

onLendersLazyLoad(event: any): void {
  if (!this.lendersDialogReady) return;

  this.lendersDialogLoading = true;
  const from  = event.first ?? 0;
  const count = event.rows  ?? 10;

  this.leadsService.getLendersBreakdown(
    from, count, this.lendersSearch.trim()
  ).subscribe(
    (res: any) => {
      if (from === 0) {
        this.lendersGrandTotal = res.grandTotal || 0;
      }
      this.lendersAccounts      = res.accounts || [];
      this.lendersTotal         = res.total    || 0;
      this.lendersDialogLoading = false;
    },
    () => { this.lendersDialogLoading = false; }
  );
}

onLendersSearchChange(): void {
  this.lendersSearchSubject.next(this.lendersSearch);
}

onLendersDialogHide(): void {
  this.lendersDialogReady = false;
}

viewLenderAccountBreakdown(event: any): void {
  const acc = event.data;

  sessionStorage.setItem('breakdownParams', JSON.stringify({
    metric:      'bankers',              // ← tells the breakdown page to show bank analytics
    loanType:    'all',
    accountName: acc.businessName,
  }));

  this.showLendersDialog = false;
  this.routingService.handleRoute(
    'allaccounts-analytics/leads-breakdown/' + acc.accountId,
    null
  );
}
}