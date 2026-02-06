import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing-service';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { forkJoin } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  leadsCallbacksChartOptions: any;
  callerLeadsCallbacksChartOptions: any;
  ApprovedDisbursedAmountChartOptions: any;
  AgentWiseBarChartOptions: any;
  pieChartOptions: any;
  pieChartOptionsforFilter: any;
  barChartData: any;
  barChartOptions: any;
  totalLeadsCount: any = 0;
  apiLoading: any;
  fallowupLoading: any;
  filesInProcessCount: any = 0;
  filesInProcessleads: any = [];
  leadsCountforFilter: any = 0;
  followupsCountforFilter: any = 0;
  callbacksCountforFilter: any = 0;
  disbursalCountforFilter: any = 0;
  filesCountforFilter: any = 0;
  partialsCountforFilter: any = 0;
  fiProcessCountforFilter: any = 0;
  approvalCountforFilter: any = 0;
  callBacksCount: any = 0;
  fiProcessCount: any = 0;
  totalSanAmount: any = 0;
  totalDisbAmount: any = 0;
  months: any[] = [0];
  monthwiseLeadCount: any[] = [0];
  monthwiseCallbackCount: any[] = [0];
  monthWiseLeadCountStatus: any = 0;
  monthWiseCallbackCountStatus: any = 0;
  loading: any;
  totalbankrejectLeadsCount: any = 0;
  totalcniLeadsCount: any = 0;
  totalFilesCount: any = 0;
  // totalPartialCount: any = 0;
  totalCreditCount: any = 0;
  bankersCount: any = 0;
  loginsCount: any = 0;
  followupsCount: any = 0;
  totalRejectsCount: any = 0;
  totalMonthLeadsCount: any = 0;
  totalMonthCallbacksCount: any = 0;
  createdAccountsCount: number = 0;
  countsAnalytics: any[] = [];
  dropdownOptions: any[] = [];
  bardropdownOptions: any[] = [];
  leadUsers: any = [];
  allleadUsers: any = [];
  selectedSoucedByStatus: any;
  totalLastWeekLeadsCount: any = 0;
  totalLastWeekCallbackCount: any = 0;
  totalLastMonthLeadsCount: any = 0;
  totalLastMonthCallbackCount: any = 0;
  totalLast6MonthLeadsCount: any = 0;
  totalLast6MonthCallbackCount: any = 0;
  totalLastYearLeadsCount: any = 0;
  totalLastYearCallbackCount: any = 0;
  chartDisplayMessage: string;
  capabilities: any;
  teamCount: any = 0;
  userDetails: any;
  moment: any;
  greetingMessage = '';
  chartDisplayMessage1 = '../../../../assets/images/menu/no-data.gif';
  image = '../../../../assets/images/menu/no-data.gif';
  currentMonth: string;
  previousMonth: string;
  twoMonthsAgo: string;
  userId: string | null = null;
  userName: string | null = null;
  sanctionedAmounts: number[] = [];
  disbursedAmounts: number[] = [];
  monthLabels: any = [];
  currentTableEvent: any;
  selectedDropdownOption: any = null;
  accounts: any = [];
  accountsCount: any = 0;
  selectedFollowupDate: any = new Date(); // default today
  selectedCreatedDate: any = new Date();
  todayAccounts: any= [];
  createdAccounts: any = [];
  todayContacts: any= [];
  todayContactsCount: number = 0;
  selectedSubmittedDate: any = new Date();
  todaySubscribers: any = [];
  todaySubscribersCount: number = 0;
  selectedSubscribedDate: any = new Date(); // today

  dateOptions = [
    { label: 'Total', value: 'total' },
    { label: 'Today', value: 'today' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Previous Month', value: 'previousMonth' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'Custom Range', value: 'custom' },
  ];

  selectedDateOption: string = 'thisMonth';
  selectedTodayTable: 'accounts' | 'contacts' | 'subscribers' = 'accounts';
  selectedtableoptions = [
    { label: 'Today Accounts', value: 'accounts' },
    { label: 'Today Contacts', value: 'contacts' },
    { label: 'Today Subscribers', value: 'subscribers' },
  ]

  constructor(
    private routingService: RoutingService,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }
  ngOnInit(): void {
    this.currentMonth = this.getMonthName(0);
    this.previousMonth = this.getMonthName(1);
    this.twoMonthsAgo = this.getMonthName(2);
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('adminDetails');
    this.userDetails = userDetails.user;
    // this.leadsService.connect(this.userDetails.id, this.userDetails?.userType);
    // this.leadsService.onDocumentAdded((data) => {
    //   console.log(data)
    //   if (this.userDetails.usertype == 1) { // Confirm it's Super Admin on frontend
    //     console.log(data.message)
    //     this.messageService.add({ severity: 'info', summary: 'Document Uploaded', detail: data.message });
    //   }
    // });

    // this.capabilities = this.leadsService.getUserRbac();
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      this.greetingMessage = 'Good Morning';
    } else if (currentTime < 18) {
      this.greetingMessage = 'Good Afternoon';
    } else {
      this.greetingMessage = 'Good Evening';
    }
    this.updateCountsAnalytics();
    this.loadCounts();
    this.onLazyLoadCreated({ first: 0, rows: 10 });
  }

  getMonthName(offset: number): string {
    return this.moment().subtract(offset, 'months').format('MMMYYYY');
  }
  onRowSelect(event: any) {
    // console.log('Row clicked:', event.data);
    this.routingService.handleRoute('leads/profile/' + event.data.id, null);
    // You can also open a dialog or navigate based on `event.data`
  }

  // onLazyLoadData(event) {
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   if (this.selectedFollowupDate) {
  //     const startOfMonth = this.moment(this.selectedFollowupDate);
  //     const endOfMonth = this.moment(this.selectedFollowupDate).add(1, 'day');
  //     api_filter['followupDate-gte'] = startOfMonth.format('YYYY-MM-DD'); // e.g. '2025-07-01'
  //     api_filter['followupDate-lte'] = endOfMonth.format('YYYY-MM-DD'); // e.g. '2025-07-31'

  //   }
  //   console.log(api_filter);
  //   this.loadAccounts(api_filter);
  // }

  onLazyLoadData(event) {
  this.currentTableEvent = event;
  let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  if (this.selectedFollowupDate) {
    const start = this.moment(this.selectedFollowupDate);
    const end = this.moment(this.selectedFollowupDate).add(1, 'day');

    api_filter['followupDate-gte'] = start.format('YYYY-MM-DD');
    api_filter['followupDate-lte'] = end.format('YYYY-MM-DD');
  }

  console.log('FOLLOWUP API FILTER:', api_filter); // ✅ console check
  this.loadFollowupAccounts(api_filter);
}

  // onLazyLoadCreated(event) {
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   if (this.selectedCreatedDate) {
  //     const startOfMonth = this.moment(this.selectedCreatedDate);
  //     const endOfMonth = this.moment(this.selectedCreatedDate).add(1, 'day');
  //     api_filter['createdOn-gte'] = startOfMonth.format('YYYY-MM-DD'); // e.g. '2025-07-01'
  //     api_filter['createdOn-lte'] = endOfMonth.format('YYYY-MM-DD'); // e.g. '2025-07-31'

  //   }
  //   console.log(api_filter);
  //   this.loadAccounts(api_filter);
  // }
  onLazyLoadCreated(event) {
  this.currentTableEvent = event;
  let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  if (this.selectedCreatedDate) {
    const start = this.moment(this.selectedCreatedDate);
    const end = this.moment(this.selectedCreatedDate).add(1, 'day');

    api_filter['createdOn-gte'] = start.format('YYYY-MM-DD');
    api_filter['createdOn-lte'] = end.format('YYYY-MM-DD');
  }

  console.log('CREATED API FILTER:', api_filter); // ✅ console first check
  this.loadCreatedAccounts(api_filter);
}
loadFollowupAccounts(api_filter) {
  this.fallowupLoading = true;

  this.leadsService.getAccountsCount(api_filter).subscribe(
    (countRes: any) => {
      this.accountsCount = Number(countRes) || 0;
    }
  );

  this.leadsService.getAccounts(api_filter).subscribe(
    (res) => {
      this.accounts = res;
      this.fallowupLoading = false;
    },
    (err) => {
      this.toastService.showError(err);
      this.fallowupLoading = false;
    }
  );
}


// loadFollowupAccounts(api_filter) {
//   this.apiLoading = true;

//   this.leadsService.getAccounts(api_filter).subscribe(
//     (res) => {
//       console.log('FOLLOWUP DATA:', res); // ✅ confirm data
//       this.accounts = res;
//       this.apiLoading = false;
//     },
//     (err) => {
//       this.toastService.showError(err);
//       this.apiLoading = false;
//     }
//   );
// }
loadCreatedAccounts(api_filter) {
  this.apiLoading = true;

  this.leadsService.getAccountsCount(api_filter).subscribe(
    (countRes: any) => {
      this.createdAccountsCount = Number(countRes) || 0;
    }
  );

  this.leadsService.getAccounts(api_filter).subscribe(
    (res) => {
      this.createdAccounts = res;
      this.apiLoading = false;
    },
    (err) => {
      this.toastService.showError(err);
      this.apiLoading = false;
    }
  );
}

// loadCreatedAccounts(api_filter) {
//   this.apiLoading = true;

//   this.leadsService.getAccounts(api_filter).subscribe(
//     (res) => {
//       console.log('CREATED DATA:', res); // ✅ FIRST data check
//       this.createdAccounts = res;       // ✅ FIX
//       this.apiLoading = false;
//     },
//     (err) => {
//       this.toastService.showError(err);
//       this.apiLoading = false;
//     }
//   );
// }
onLazyLoadTodayContacts(event) {
  let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  if (this.selectedSubmittedDate) {
    const start = this.moment(this.selectedSubmittedDate);
    const end = this.moment(this.selectedSubmittedDate).add(1, 'day');

    api_filter['submitted_on-gte'] = start.format('YYYY-MM-DD');
    api_filter['submitted_on-lte'] = end.format('YYYY-MM-DD');
  }

  console.log('TODAY CONTACTS FILTER:', api_filter); // ✅ console check
  this.loadTodayContacts(api_filter);
}
loadTodayContacts(api_filter) {
  this.apiLoading = true;

  // ✅ COUNT API
  this.leadsService.getContactsCount(api_filter).subscribe(
    (countRes: any) => {
      this.todayContactsCount = Number(countRes) || 0;
    }
  );

  // ✅ DATA API
  this.leadsService.getContacts(api_filter).subscribe(
    (res) => {
      this.todayContacts = res;
      this.apiLoading = false;
    },
    (err) => {
      this.toastService.showError(err);
      this.apiLoading = false;
    }
  );
}

// loadTodayContacts(api_filter) {
//   this.apiLoading = true;

//   this.leadsService.getContacts(api_filter).subscribe(
//     (res) => {
//       console.log('TODAY CONTACTS DATA:', res); // ✅ data check
//       this.todayContacts = res;
//       this.apiLoading = false;
//     },
//     (err) => {
//       this.toastService.showError(err);
//       this.apiLoading = false;
//     }
//   );
// }
onLazyLoadTodaySubscribers(event) {
  let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  if (this.selectedSubscribedDate) {
    const start = this.moment(this.selectedSubscribedDate);
    const end = this.moment(this.selectedSubscribedDate).add(1, 'day');

    api_filter['subscribed_on-gte'] = start.format('YYYY-MM-DD');
    api_filter['subscribed_on-lte'] = end.format('YYYY-MM-DD');
  }

  console.log('TODAY SUBSCRIBERS FILTER:', api_filter); // ✅ debug
  this.loadTodaySubscribers(api_filter);
}
loadTodaySubscribers(api_filter) {
  this.apiLoading = true;

  // ✅ COUNT API
  this.leadsService.getSubscibersCount(api_filter).subscribe(
    (countRes: any) => {
      this.todaySubscribersCount = Number(countRes) || 0;
    }
  );

  // ✅ DATA API
  this.leadsService.getsubscribers(api_filter).subscribe(
    (res) => {
      this.todaySubscribers = res;
      this.apiLoading = false;
    },
    (err) => {
      this.toastService.showError(err);
      this.apiLoading = false;
    }
  );
}

// loadTodaySubscribers(api_filter) {
//   this.apiLoading = true;

//   this.leadsService.getsubscribers(api_filter).subscribe(
//     (res) => {
//       console.log('TODAY SUBSCRIBERS DATA:', res); // ✅ confirm data
//       this.todaySubscribers = res;
//       this.apiLoading = false;
//     },
//     (err) => {
//       this.toastService.showError(err);
//       this.apiLoading = false;
//     }
//   );
// }


  getTeamCount(filter) {
    this.leadsService.getAccountsCount(filter).subscribe(
      (teamsCount) => {
        this.accountsCount = teamsCount;
        // console.log(this.accountsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  viewAccount(event) {
    const lead = event.data;
    this.routingService.handleRoute('accounts/profile/' + lead.accountId, null);
  }
  getTeam(filter) {
    this.apiLoading = true;
    this.leadsService.getAccounts(filter).subscribe(
      (team) => {
        this.accounts = team;
        this.apiLoading = false;
      },
      (error: any) => {
        this.toastService.showError(error);
        this.apiLoading = false;
      }
    );
  }
  loadAccounts(api_filter) {
    
    // console.log(event);

    api_filter = Object.assign(
      {},
      api_filter
      // this.searchFilter,
      // this.appliedFilter
    );

    if (api_filter) {
      // console.log(api_filter);
      this.getTeamCount(api_filter);
      this.getTeam(api_filter);
    }
  }

  updateCountsAnalytics() {
    this.countsAnalytics = [
      {
        name: 'accounts',
        displayName: 'Accounts',
        count: 0,
        routerLink: 'accounts',
        condition: true,
        backgroundColor: '#EBF3FE',
        color: '#EE7846',
        icon: '../../../assets/images/icons/leads.svg',
        apiCall: () => this.leadsService.getAccountsCount({"status-eq": 1}), // Only Active Accounts
      },
      {
        name: 'subscription-plans',
        displayName: 'Plans',
        count: 0,
        routerLink: 'subscription-plans',
        condition: true,
        backgroundColor: '#FBF2EF',
        color: '#FFC001',
        icon: '../../../assets/images/icons/files.svg',
        apiCall: () => this.leadsService.getPlansCount(),
      },
      {
        name: 'contact-submissions',
        displayName: 'Contacts',
        count: 0,
        routerLink: 'contact-submissions',
        condition: true,
        backgroundColor: '#EBF3FE',
        color: '#EE7846',
        icon: '../../../assets/images/icons/leads.svg',
        apiCall: () => this.leadsService.getContactsCount(),
      },
      {
        name: 'subscribers',
        displayName: 'Subscribers',
        count: 0,
        routerLink: 'subscribers',
        condition: true,
        backgroundColor: '#FBF2EF',
        color: '#FFC001',
        icon: '../../../assets/images/icons/files.svg',
        apiCall: () => this.leadsService.getSubscibersCount(),
      },
      {
        name: 'cibil-reports',
        displayName: 'Cibil Reports',
        count: 0,
        routerLink: 'cibil-reports',
        condition: true,
        backgroundColor: '#FBF2EF',
        color: '#FFC001',
        icon: '../../../assets/images/icons/files.svg',
        apiCall: () => this.leadsService.getFetchedCibilReportsCount(),
      },
    ];
  }

  loadCounts() {
    const observables = this.countsAnalytics
      .filter((card) => card.apiCall)
      .map((card) => card.apiCall());

    forkJoin(observables).subscribe({
      next: (results: any[]) => {
        results.forEach((res, index) => {
          this.countsAnalytics[index].count = res?.total || res || 0;
        });
        console.log('Dashboard counts:', this.countsAnalytics);
      },
      error: (err) => {
        console.error('Error fetching counts:', err);
      },
    });
  }

  goToRoute(route) {
    this.routingService.setFeatureRoute('admin');
    this.routingService.handleRoute(route, null);
  }
}
