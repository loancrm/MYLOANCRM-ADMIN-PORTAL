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
  providers: [MessageService]
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
  monthLabels: any = []
  currentTableEvent: any;
  selectedDropdownOption: any = null;
  dateOptions = [
    { label: 'Total', value: 'total' },
    { label: 'Today', value: 'today' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Previous Month', value: 'previousMonth' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'Custom Range', value: 'custom' },
  ];

  selectedDateOption: string = 'thisMonth';
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
  }

  getMonthName(offset: number): string {
    return this.moment().subtract(offset, 'months').format('MMMYYYY');
  }
  onRowSelect(event: any) {
    // console.log('Row clicked:', event.data);
    this.routingService.handleRoute('leads/profile/' + event.data.id, null);
    // You can also open a dialog or navigate based on `event.data`
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
        apiCall: () => this.leadsService.getAccountsCount()
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
        apiCall: () => this.leadsService.getPlansCount()
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
        apiCall: () => this.leadsService.getContactsCount()
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
        apiCall: () => this.leadsService.getSubscibersCount()
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
        apiCall: () => this.leadsService.getFetchedCibilReportsCount()
      },
    ];
  }

  loadCounts() {
  const observables = this.countsAnalytics
    .filter(card => card.apiCall)
    .map(card => card.apiCall());

  forkJoin(observables).subscribe({
    next: (results: any[]) => {
      results.forEach((res, index) => {
        this.countsAnalytics[index].count = res?.total || res || 0;
      });
      console.log('Dashboard counts:', this.countsAnalytics);
    },
    error: (err) => {
      console.error('Error fetching counts:', err);
    }
  });
}

  goToRoute(route) {
    this.routingService.setFeatureRoute('admin');
    this.routingService.handleRoute(route, null);
  }
}
