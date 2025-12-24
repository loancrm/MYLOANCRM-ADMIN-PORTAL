import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LeadsService } from '../../leads/leads.service';

interface TabItem {
  label: string;
  id: string;
}

@Component({
  selector: 'app-analyzed-bank-report',
  templateUrl: './analyzed-bank-report.component.html',
  styleUrls: ['./analyzed-bank-report.component.scss']
})
export class AnalyzedBankReportComponent implements OnInit {
  activeTabIndex: number = 0;
  monthwiseKeys: string[] = [];      // All row keys
  monthwiseMatrix: any[] = [];       // Array of month maps for easy lookup
  bankAccountDetails: any = {};      // Bank account key-value pairs
  reportData: any[] = [];
  monthwiseData: any[] = [];
  loanAnalysisData: any;
  accountData: any = {};         // Full report from API
  loading: boolean = false;
  overviewData: any;
  months: any;
  dailyBalanceData: any;
  bouncedChequeData: any;
  categoriesData: any;
  irregularitiesData: any;
  cashFlowData: any;
  cashFlowAnalysisData: any;
  bizCashFlow: any;
  duplicateTxnsData: any;
  recurringPaymentsData: any;
  amlAnalysisData: any;
  monthlyCounterPartyData: any;
  loansData: any;
  emiPaymentsData: any;
  circularTransactionsData: any
  interBankTransfersData: any;
  recurringDepositsData: any;
  salaryData: any;
  odccUtilizationData: any;
  avaliableBalanceData: any;
  monthlySummaryData: any[] = [];
  chartOptions: any;
  countePartyData: any;
  upiTxnsData: any;
  overviewLoading = false;
  transactionData: any[] = [];
  totalTransactions = 0;
  activeIndex: number = 0;
  transactionLoading = false;
  inflowCategories: TreeNode[] = [];
  outflowCategories: TreeNode[] = [];
  chequeTabs: { label: string; data: any }[] = [];
  sortField: string = 'transaction_date';
  sortOrder: number = 1; // -1 = DESC, 1 = ASC
  @ViewChild('tabContainer') tabContainer!: ElementRef;
  @ViewChild('overflowMenu') overflowMenu!: any;
  @ViewChild('menuButton', { read: ElementRef }) menuButton!: ElementRef;
  menuOpen: boolean = false;

  allTabs: TabItem[] = [
    { label: 'Summary', id: 'summary' },
    { label: 'Overview', id: 'overview' },
    { label: 'Transactions', id: 'transactions' },
    { label: 'Irregularities', id: 'irregularities' },
    // { label: 'Monthly Counterparty', id: 'monthly-counterparty' },
    { label: 'Counterparty', id: 'counterparty' },
    { label: 'AML Analysis', id: 'aml-analysis' },
    { label: 'Recurring Payments', id: 'recurring-payments' },
    { label: 'Loans', id: 'loans' },
    // { label: 'Loans Analysis', id: 'loans-analysis' },
    { label: 'Daily Balance', id: 'daily-balance' },
    // { label: 'Monthly Summary', id: 'monthly-summary' },
    { label: 'Categories', id: 'categories' },
    { label: 'EMI Payments', id: 'emi-payments' },
    { label: 'Bounced Cheques', id: 'bounced-cheques' },
    { label: 'UPI TXNS Analysis', id: 'upi-txns-analysis' },
    { label: 'Cash Flow', id: 'cash-flow' },
    { label: 'Cash Flow Analysis', id: 'cash-flow-analysis' },
    { label: 'Recurring Deposits', id: 'recurring-deposits' },
    { label: 'Biz Cash Flow', id: 'biz-cash-flow' },
    { label: 'Available Balance', id: 'available-balance' },
    { label: 'Duplicate Txns', id: 'duplicate-txns' },
    // { label: 'Inter Bank Transfers', id: 'inter-bank-transfers' },
    // { label: 'Circular Txns', id: 'circular-txns' },
    { label: 'Salary', id: 'salary' },
    { label: 'OD/CC Utilization', id: 'od-cc-utilization' }
  ];
  selectedTab = this.allTabs[0];
  accountId: any;
  accountReferenceNumber: any;
  visibleTabs: TabItem[] = [];
  overflowTabs: TabItem[] = [];
  activeTabId: string = 'summary';
  monthList: string[] = [];
  reportId: any;
  adminDetails: any;
  mainaccountId: any;
  dailyBalanceTable: any[] = [];
  report: any
  constructor(
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private location: Location,
    private bankService: LeadsService,
    private localStorageService: LocalStorageService,

  ) { }

  ngOnInit(): void {
    const adminDetails =
      this.localStorageService.getItemFromLocalStorage('adminDetails');
    this.adminDetails = adminDetails.user;
    this.mainaccountId = adminDetails.user.accountId;
    this.reportId = this.route.snapshot.paramMap.get('reportId');
    this.fetchReport();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateTabs();
      this.updateActiveIndex();
      this.executeTabFunction(this.activeTabId); // load first tab
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateTabs();
    this.updateActiveIndex();
  }

  editReport(reportId: string) {
    if (reportId) {
      this.routingService.handleRoute(`bsanalyzer/${reportId}`, null);
      // this.router.navigate(['/reports/edit', reportId]); // adjust route as per your routing config
    }
  }
  fetchReport() {
    console.log("Adfvdsv")
    const params = {
      reportId: this.reportId,
      // accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.fetchReport(params).subscribe({
      next: (res: any) => {
        this.report = res;
        this.accountId = this.report?.reportAccounts[0]?.account?.accountId
        this.accountReferenceNumber = this.report?.reportAccounts[0]?.account?.accountReferenceNumber
        this.calculateTabs();
        this.updateActiveIndex();
        this.executeTabFunction(this.activeTabId);
      },
      error: (err) => {
        console.error('Error fetching report', err);
      }
    });
  }
  calculateTabs() {
    if (!this.tabContainer?.nativeElement) return;

    const containerWidth = this.tabContainer.nativeElement.offsetWidth;
    const tabMinWidth = 140;
    let totalWidth = 0;

    this.visibleTabs = [];
    this.overflowTabs = [];

    for (const tab of this.allTabs) {
      totalWidth += tabMinWidth;
      if (totalWidth + 120 < containerWidth) {
        this.visibleTabs.push(tab);
      } else {
        this.overflowTabs.push(tab);
      }
    }
  }
  toggleOverflowMenu() {
    if (this.overflowMenu && this.menuButton) {
      this.overflowMenu.toggle(this.menuButton.nativeElement);
    }
  }

  updateActiveIndex() {
    this.activeTabIndex = this.allTabs.findIndex(t => t.id === this.activeTabId);
    if (this.activeTabIndex < 0) {
      this.activeTabIndex = 0;
      this.activeTabId = this.allTabs[0]?.id ?? '';
    }
  }

  onTabChange(event: { index: number }) {
    const tabId = this.allTabs[event.index]?.id;
    if (!tabId) return;
    this.activeTabId = tabId;
    this.updateActiveIndex();
    this.executeTabFunction(tabId);
  }


  get overflowMenuItems() {
    return this.overflowTabs.map(tab => ({
      label: tab.label,
      command: () => {

        this.activeTabId = tab.id;
        this.updateActiveIndex();
        this.executeTabFunction(tab.id);
      }
    }));
  }

  onDropdownChange(event: any) {
    const tabId = event.value.id;
    this.executeTabFunction(tabId);
  }

  executeTabFunction(tabId: string) {
    switch (tabId) {
      case 'summary':
        this.loadSummary();
        break;
      case 'overview':
        this.loadOverviewData();
        break;
      case 'transactions':
        this.loadTransactionsData(event);
        break;
      case 'irregularities':
        this.loadIrregularities();
        break;
      case 'monthly-counterparty':
        this.loadMonthlyCounterparty();
        break;
      case 'counterparty':
        this.loadCounterparty();
        break;
      case 'aml-analysis':
        this.loadAmlAnalysis();
        break;
      case 'recurring-payments':
        this.loadRecurringPayments();
        break;
      case 'loans':
        this.loadLoans();
        break;
      case 'loans-analysis':
        this.loadLoansAnalysis();
        break;
      case 'daily-balance':
        this.loadDailyBalance();
        break;
      case 'monthly-summary':
        this.loadMonthlySummary();
        break;
      case 'categories':
        this.loadCategories();
        break;
      case 'emi-payments':
        this.loadEmiPayments();
        break;
      case 'bounced-cheques':
        this.loadBouncedCheques();
        break;
      case 'upi-txns-analysis':
        this.loadUpiTxnsAnalysis();
        break;
      case 'cash-flow':
        this.loadCashFlow();
        break;
      case 'cash-flow-analysis':
        this.loadCashFlowAnalysis();
        break;
      case 'recurring-deposits':
        this.loadRecurringDeposits();
        break;
      case 'biz-cash-flow':
        this.loadBizCashFlow();
        break;
      case 'available-balance':
        this.loadAvailableBalance();
        break;
      case 'duplicate-txns':
        this.loadDuplicateTxns();
        break;
      case 'inter-bank-transfers':
        this.loadInterBankTransfers();
        break;
      case 'circular-txns':
        this.loadCircularTxns();
        break;
      case 'salary':
        this.loadSalary();
        break;
      case 'od-cc-utilization':
        this.loadOdCcUtilization();
        break;
      default:
        console.warn(`No function mapped for tabId: ${tabId}`);
    }
  }

  toggleMenu(event: Event, menu: any) {
    menu.toggle(event);
    this.menuOpen = !this.menuOpen;
  }
  loadSummary() {
    this.loading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractSummaryDetails(params).subscribe({
      next: (data: any[]) => {
        this.reportData = Array.isArray(data) ? data : [];
        const bankAccountsSection = this.reportData.filter(
          sec => sec.sectionName === 'Bank Accounts'
        );
        if (bankAccountsSection) {
          this.accountData = bankAccountsSection.find(
            (v: any) => v.setId === 2
          );
          if (this.accountData?.sectionValues) {
            this.bankAccountDetails = this.accountData.sectionValues.reduce(
              (acc: any, item: any) => {
                acc[item.key] = item.value || '-';
                return acc;
              },
              {}
            );
          }
        }
        this.monthwiseData = this.reportData.filter(
          sec => sec.sectionName === 'Monthwise details'
        );
        if (this.monthwiseData?.length) {
          const uniqueKeys = new Set<string>();
          this.monthwiseData.forEach(month => {
            month.sectionValues?.forEach((item: any) => uniqueKeys.add(item.key));
          });
          this.monthwiseKeys = Array.from(uniqueKeys);
          this.monthwiseMatrix = this.monthwiseData.map(month => {
            const map: any = {};
            month.sectionValues?.forEach((item: any) => {
              map[item.key] = item.value || '-';
            });
            return map;
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }


  loadOverviewData() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractOverviewDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.overviewData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.overviewData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadTransactionsData(event) {
    this.transactionLoading = true;

    const page = event.first / event.rows + 1;
    const rows = event.rows;
    const sortBy = event.sortField || 'transaction_date';
    const order = event.sortOrder === 1 ? 'asc' : 'desc';


    // Extract filters from PrimeNG table
    const tableFilters = {};
    if (event.filters) {
      Object.keys(event.filters).forEach(field => {
        const filterMeta = event.filters[field];
        if (filterMeta && filterMeta.value) {
          tableFilters[field] = [
            {
              [field]: filterMeta.value,
              operation: filterMeta.matchMode || '='
            }
          ];
        }
      });
    }

    const params = {
      page,
      rows,
      sortBy,
      order,
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber

    };

    this.bankService.extractTransactions(params, tableFilters)
      .subscribe({
        next: (res) => {
          this.transactionData = res.transactions || res; // adjust depending on API shape
          this.totalTransactions = res.pagination.totalElements || 0;
          this.transactionLoading = false;
        },
        error: () => {
          this.transactionData = [];
          this.transactionLoading = false;
        }
      });
  }



  loadIrregularities() {

    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractIrregularities(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.irregularitiesData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.irregularitiesData = null;
          this.overviewLoading = false;
        }
      });
  }



  loadInterBankTransfers() {

    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractInterBankTransfers(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.interBankTransfersData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.interBankTransfersData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadMonthlyCounterparty() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractMonthlyCounterParty(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.monthlyCounterPartyData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.monthlyCounterPartyData = null;
          this.overviewLoading = false;
        }
      });
  }
  loadLoansAnalysis() {

    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractLoanAnalysis(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.loanAnalysisData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.loanAnalysisData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadCircularTxns() {

    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractCircularTransactions(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.circularTransactionsData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.circularTransactionsData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadCounterparty() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractCounterparty(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.countePartyData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.countePartyData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadDailyBalance() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractDailyBalance(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.dailyBalanceData = res;
          this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.dailyBalanceData = null;
          this.overviewLoading = false;
        }
      });
  }

  transformDailyBalance() {
    if (!this.dailyBalanceData || !this.dailyBalanceData.day) return;
    // Extract month headers
    this.monthList = this.dailyBalanceData.month;
    // Put "Average" at the beginning of monthList
    if (!this.monthList.includes('Average')) {
      this.monthList = ['Average', ...this.monthList];
    }
    this.dailyBalanceTable = Object.keys(this.dailyBalanceData.day).map(dayKey => {
      const row: any = { day: dayKey };
      this.dailyBalanceData.day[dayKey].forEach((entry: any) => {
        row[entry.month] = parseFloat(entry.amount);
      });
      return row;
    });
  }

  loadCategories() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractCategories(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.categoriesData = res; // whole object
          this.inflowCategories = (this.categoriesData.inflows || [])
            .map((cat: any) => this.mapToTreeNode(cat));
          this.outflowCategories = (this.categoriesData.outflows || [])
            .map((cat: any) => this.mapToTreeNode(cat));
          this.overviewLoading = false;
        },
        error: () => {
          this.categoriesData = null;
          this.overviewLoading = false;
        }
      });
  }
  mapToTreeNode(category: any): TreeNode {
    return {
      data: {
        category: category.category,
        startDate: category.startDate,
        endDate: category.endDate,
        amount: category.amount,
        exposure: category.exposure,
        avgAmount: category.avgAmount,
        transactionCount: category.transactionCount
      },
      children: category.subCategories?.map((sub: any) => this.mapToTreeNode(sub)) || []
    };
  }

  loadBouncedCheques() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractBouncedChequeDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.bouncedChequeData = res;
          this.chequeTabs = [
            { label: 'Outward Cheques', data: this.bouncedChequeData.outwardChequeTransactions },
            { label: 'Inward Cheques', data: this.bouncedChequeData.inwardChequeTransactions },
            { label: 'Same-Day Cheques', data: this.bouncedChequeData.sameDayChequeTransactions }
          ];

          this.overviewLoading = false;
        },
        error: () => {
          this.bouncedChequeData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadCashFlow() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractCashFlowDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.cashFlowData = res;
          // this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.cashFlowData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadBizCashFlow() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractBusinessCashFlowDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.bizCashFlow = res;
          // this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.bizCashFlow = null;
          this.overviewLoading = false;
        }
      });
  }

  loadDuplicateTxns() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractDuplicateTransactions(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.duplicateTxnsData = res;
          // this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.duplicateTxnsData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadRecurringPayments() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber,
      type: "recurringPayments"
    };
    this.bankService.extractPatternDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.recurringPaymentsData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.recurringPaymentsData = null;
          this.overviewLoading = false;
        }
      });
  }
  loadLoans() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber,
      type: "loans"
    };
    this.bankService.extractPatternDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.loansData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.loansData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadEmiPayments() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber,
      type: "emi"
    };
    this.bankService.extractPatternDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.emiPaymentsData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.emiPaymentsData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadRecurringDeposits() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber,
      type: "recurringDeposits"
    };
    this.bankService.extractPatternDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.recurringDepositsData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.recurringDepositsData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadSalary() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber,
      type: "salary"
    };
    this.bankService.extractPatternDetails(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.salaryData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.salaryData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadOdCcUtilization() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractOdCCUtilization(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.odccUtilizationData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.odccUtilizationData = null;
          this.overviewLoading = false;
        }
      });
  }
  loadAvailableBalance() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractAvailableBalance(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.avaliableBalanceData = res;
          this.overviewLoading = false;
          this.setChartOptions();
        },
        error: () => {
          this.avaliableBalanceData = null;
          this.overviewLoading = false;
        }
      });
  }

  setChartOptions() {
    const categories = this.avaliableBalanceData.entirePeriod.map(item => Number(item.balanceBucket));
    const seriesData = this.avaliableBalanceData.entirePeriod.map(item => Number(item.availabilityPct));
    this.chartOptions = {
      series: [
        {
          name: "Occurrence %",
          data: seriesData
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      xaxis: {
        categories: categories,
        title: { text: "Balance Amount" },
        labels: {
          formatter: (val: any) => {
            if (val === undefined || val === null) return "";   // 👈 prevent crash
            return val.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",");
          }
        }
      },
      yaxis: {
        title: { text: "Occurrence % (Occurred Days / Total Days)" },
        max: 100
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`
        }
      }
    };
  }
  goBack() {
    this.location.back();
  }
  loadMonthlySummary() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractTransactionSummary(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.months = res.months;
          this.monthlySummaryData = this.transformPivot(res);
          this.overviewLoading = false;
        },
        error: () => {
          this.monthlySummaryData = [];
          this.overviewLoading = false;
        }
      });
  }

  transformPivot(apiResponse: any): any[] {
    const { months, closingBalance, ...categories } = apiResponse;

    const treeData: any[] = [];

    // ✅ 1. Opening Balance
    const openingNode: any = { data: { name: 'Opening Balance' } };
    months.forEach((m, idx) => {
      const prevBalance = idx === 0
        ? null
        : closingBalance.find((b: any) => b.month === months[idx - 1]);

      openingNode.data[m] = {
        amount: prevBalance ? Number(prevBalance.amount).toFixed(2) : '-',
        txn: null
      };
    });
    treeData.push(openingNode);

    // ✅ 2. Dynamic categories (Deposits, Withdrawals, etc.)
    Object.entries(categories).forEach(([catKey, catValue]: any) => {
      // Example: "dataDeposits": { Deposits: { data:[...], Loan:{}, Tax Return:{} } }
      Object.entries(catValue).forEach(([catName, catDetail]: any) => {
        const node: any = { data: { name: catName }, children: [] };

        // Fill parent (if it has direct "data")
        if (catDetail?.data) {
          months.forEach(m => {
            const match = catDetail.data.find(
              (d: any) => d.month.toLowerCase().replace(/\s+/g, '') === m.toLowerCase().replace(/\s+/g, '')
            );
            node.data[m] = {
              amount: match ? Number(match.amount).toFixed(2) : '-',
              txn: match ? match.count : '-'
            };
          });
        }

        // Fill children (Loan, Tax Return, etc.)
        Object.entries(catDetail).forEach(([subKey, subValue]: any) => {
          if (subKey === 'data') return; // skip main data
          const subNode: any = { data: { name: subKey } };

          months.forEach(m => {
            const match = subValue?.data?.find(
              (d: any) => d.month.toLowerCase().replace(/\s+/g, '') === m.toLowerCase().replace(/\s+/g, '')
            );
            subNode.data[m] = {
              amount: match ? Number(match.amount).toFixed(2) : '-',
              txn: match ? match.count : '-'
            };
          });

          node.children.push(subNode);
        });

        treeData.push(node);
      });
    });

    // ✅ 3. Closing Balance
    const closingNode: any = { data: { name: 'Closing Balance' } };
    months.forEach(m => {
      const cb = closingBalance.find(
        (b: any) => b.month.toLowerCase().replace(/\s+/g, '') === m.toLowerCase().replace(/\s+/g, '')
      );
      closingNode.data[m] = {
        amount: cb ? Number(cb.amount).toFixed(2) : '-',
        txn: null
      };
    });
    treeData.push(closingNode);

    return treeData;
  }
  downloadCam() {
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    const url = this.bankService.downloadCamFile(this.accountReferenceNumber);
    window.open(url, '_blank');
  }

  loadAmlAnalysis() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractAMLAnalysis(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.amlAnalysisData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.amlAnalysisData = null;
          this.overviewLoading = false;
        }
      });
  }


  loadUpiTxnsAnalysis() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractUPIAnalysis(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.upiTxnsData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.upiTxnsData = null;
          this.overviewLoading = false;
        }
      });
  }


  loadCashFlowAnalysis() {
    this.overviewLoading = true;
    const params = {
      accountId: this.accountId,
      accountReferenceNumber: this.accountReferenceNumber
    };
    this.bankService.extractCashFlowAnalysis(params) // replace with your API call
      .subscribe({
        next: (res) => {
          this.cashFlowAnalysisData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.cashFlowAnalysisData = null;
          this.overviewLoading = false;
        }
      });
  }
}
