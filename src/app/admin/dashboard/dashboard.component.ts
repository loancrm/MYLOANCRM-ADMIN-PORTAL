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

    this.getLeadUsers();
    this.getAllLeadUsers();
  }
  ngOnInit(): void {
    this.currentMonth = this.getMonthName(0);
    this.previousMonth = this.getMonthName(1);
    this.twoMonthsAgo = this.getMonthName(2);
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    // this.leadsService.connect(this.userDetails.id, this.userDetails?.userType);
    // this.leadsService.onDocumentAdded((data) => {
    //   console.log(data)
    //   if (this.userDetails.usertype == 1) { // Confirm it's Super Admin on frontend
    //     console.log(data.message)
    //     this.messageService.add({ severity: 'info', summary: 'Document Uploaded', detail: data.message });
    //   }
    // });
    this.loadData();
    this.setChartOptions();
    this.capabilities = this.leadsService.getUserRbac();
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      this.greetingMessage = 'Good Morning';
    } else if (currentTime < 18) {
      this.greetingMessage = 'Good Afternoon';
    } else {
      this.greetingMessage = 'Good Evening';
    }
  }
  getMonthName(offset: number): string {
    return this.moment().subtract(offset, 'months').format('MMMYYYY');
  }
  onRowSelect(event: any) {
    // console.log('Row clicked:', event.data);
    this.routingService.handleRoute('leads/profile/' + event.data.id, null);
    // You can also open a dialog or navigate based on `event.data`
  }
  loadData() {
    this.loading = true;
    // console.log(this.loading);
    this.getCounts();
    this.getFollowUpsCount();
    this.getDisbursalLeadCountforFilter();
    this.getLeadCountforFilter();
    this.getFollowUpCountforFilter();
    this.getFilesCountforFilter();
    // this.getPartialFilesCountforFilter();
    this.getApprovalsCountforFilter();
    this.fetchAllAmounts();
    this.fetchFileCreditCounts();
    this.getFIPProcessDistinctLeadsCountforFilter();
    this.combineServiceCalls();
    this.getTotalAmountSums();
    // this.getMonthWiseLeadCountStatus();
    // this.getMonthWiseCallBacksCount();
    // console.log(this.loading);
  }

  getAmountsForMonth(offset: number) {
    const startOfMonth = this.moment()
      .subtract(offset, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    const endOfMonth = this.moment()
      .subtract(offset, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');

    const disbursalFilter = {
      'disbursalDate-gte': startOfMonth,
      'disbursalDate-lte': endOfMonth,
    };
    const sanctionedFilter = {
      'approvalDate-gte': startOfMonth,
      'approvalDate-lte': endOfMonth,
    };
    return forkJoin({
      disbursed: this.leadsService.getDisbursedAmount(disbursalFilter),
      sanctioned: this.leadsService.getSanctionedAmount(sanctionedFilter),
    });
  }

  fetchAllAmounts() {
    this.sanctionedAmounts = [];
    this.disbursedAmounts = [];
    this.monthLabels = [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();

    const observables: any[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const label = monthNames[date.getMonth()] + " " + date.getFullYear();
      this.monthLabels.push(label);

      observables.push(this.getAmountsForMonth(i));
    }

    forkJoin(observables).subscribe(
      (results) => {
        results.forEach((result, index) => {
          this.disbursedAmounts[index] = result.disbursed;
          this.sanctionedAmounts[index] = result.sanctioned;
        });

        this.setChartOptions(); // Make sure to use this.monthLabels in your chart
      },
      (error) => {
        this.toastService.showError('An error occurred while fetching amounts');
      }
    );
  }

  // getMonthWiseLeadCountStatus(filter = {}) {
  //   this.leadsService?.getMonthWiseLeadCountStatus(filter)?.subscribe(
  //     (teamsCount) => {
  //       this.monthWiseLeadCountStatus = teamsCount;
  //       this.months = this.monthWiseLeadCountStatus.months;
  //       this.monthwiseLeadCount = this.monthWiseLeadCountStatus.leadCounts;
  //       this.setChartOptions();
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  // getMonthWiseCallBacksCount(filter = {}) {
  //   this.leadsService?.getMonthWiseCallBacksCount(filter)?.subscribe(
  //     (teamsCount) => {
  //       this.monthWiseCallbackCountStatus = teamsCount;
  //       this.monthwiseCallbackCount =
  //         this.monthWiseCallbackCountStatus.callbackCounts;
  //       this.setChartOptions();
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  getTotalAmountSums(filter = {}) {
    forkJoin({
      totalSanctioned: this.leadsService?.getTotalSanctionedAmountSum(filter),
      totalDisbursed: this.leadsService?.getTotalDisbursedAmountSum(filter),
    }).subscribe(
      (response: any) => {
        this.totalSanAmount = this.convertToLakhsOrCrores(
          response.totalSanctioned?.totalSanctionedAmount
        );
        this.totalDisbAmount = this.convertToLakhsOrCrores(
          response.totalDisbursed?.totalDisbursedAmount
        );
        this.updateCountsAnalytics();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  convertToLakhsOrCrores(amount: number): string {
    if (amount >= 10000000) {
      const crores = amount / 10000000;
      return crores % 1 === 0
        ? crores.toFixed(0) + ' Cr'
        : crores.toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
      const lakhs = amount / 100000;
      return lakhs % 1 === 0
        ? lakhs.toFixed(0) + ' L'
        : lakhs.toFixed(2) + ' L';
    } else {
      return amount % 1 === 0 ? amount.toFixed(0) : amount.toString();
    }
  }
  getCounts(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    forkJoin([
      this.leadsService?.getLeadCountStatus(filter),
      this.leadsService?.getCallbackCountStatus(filter),
    ])?.subscribe(
      ([totalLeadsCount, callBacksCount]) => {
        this.totalLeadsCount = totalLeadsCount;
        this.callBacksCount = callBacksCount;
        this.updateDropdownOptions();
        this.updateCountsAnalytics();
        this.setChartOptions();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getFollowUpsCount(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 16;
    this.leadsService.getLeadsCount(filter).subscribe(
      (response) => {
        this.followupsCount = response;
        this.updateDropdownOptions();
        this.updateCountsAnalytics();
        this.setChartOptions();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLeadCountforFilter(filter = {}) {
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        filter['leadInternalStatus-eq'] = '1';
      } else {
        filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    // console.log(filter);
    this.leadsService.getLeadCountStatus(filter).subscribe(
      (response) => {
        this.leadsCountforFilter = response;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getFollowUpCountforFilter(filter = {}) {
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        filter['leadInternalStatus-eq'] = 16;
      } else {
        filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    filter['leadInternalStatus-eq'] = 16;
    this.leadsService.getLeadsCount(filter).subscribe(
      (response) => {
        this.followupsCountforFilter = response;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getDisbursalLeadCountforFilter(filter = {}) {
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
      } else {
        filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    this.leadsService.getDisbursalLeadCount(filter).subscribe(
      (response: any) => {
        this.disbursalCountforFilter = response;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getFilesCountforFilter(filter = {}) {
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
      } else {
        filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    this.leadsService.getFilesCountStatus(filter).subscribe(
      (response) => {
        this.filesCountforFilter = response;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  // getPartialFilesCountforFilter(filter = {}) {
  //   if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
  //     if (this.selectedSoucedByStatus.name == 'All') {
  //     } else {
  //       filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
  //     }
  //   }
  //   this.leadsService.getPartialCountStatus(filter).subscribe(
  //     (response) => {
  //       this.partialsCountforFilter = response;
  //       this.setBarChartOptionsForFilter();
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  getFIPProcessDistinctLeadsCountforFilter(filter = {}) {
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
      } else {
        filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    this.leadsService.getFIPProcessDistinctLeadsCount(filter).subscribe(
      (response: any) => {
        this.fiProcessCountforFilter = response;
        this.setBarChartOptionsForFilter();
        this.loading = false;
        // console.log(this.loading);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getApprovalsCountforFilter(filter = {}) {
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
      } else {
        filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    this.leadsService.getApprovedLeadCount(filter).subscribe(
      (response: any) => {
        this.approvalCountforFilter = response;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  fetchFileCreditCounts(filter = {}) {
    const filesFilter: any = { ...filter };
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      filesFilter['sourcedBy-eq'] = this.userDetails?.id;
    }
    forkJoin([
      this.leadsService?.getFilesCountStatus(filesFilter),
      // this.leadsService?.getPartialCountStatus(filter),
      this.leadsService?.getCreditEvaluationCountStatus(filter),
      this.leadsService?.getRejectsCountStatus(filter),
      this.leadsService?.getNewBankersCount(filter),
      this.leadsService?.getLoginsCountStatus(filter),
      this.leadsService?.getFIPProcessDistinctLeadsCount(filter),
      this.leadsService?.getCNIRejectedLeadCount(filter),
      this.leadsService?.getBankRejectedLeadCount(filter),
      this.leadsService?.getActiveUsersCount(filter),
    ]).subscribe(
      ([
        filesCount,
        // partialCount,
        creditCount,
        rejectsCount,
        bankersCount,
        loginsCount,
        fiProcessCount,
        cniLeadsCount,
        bankrejectLeadsCount,
        teamCount,
      ]: any) => {
        this.totalFilesCount = filesCount;
        // this.totalPartialCount = partialCount;
        this.totalCreditCount = creditCount;
        this.totalRejectsCount = rejectsCount || 0;
        this.bankersCount = bankersCount;
        this.loginsCount = loginsCount;
        this.fiProcessCount = fiProcessCount;
        this.totalcniLeadsCount = cniLeadsCount || 0;
        // this.totalbankrejectLeadsCount = bankrejectLeadsCount?.count ?? 0;
        this.totalbankrejectLeadsCount = bankrejectLeadsCount || 0;
        this.teamCount = teamCount;
        // console.log(this.totalRejectsCount)
        // console.log(this.totalcniLeadsCount)
        // console.log(this.totalbankrejectLeadsCount)
        this.updateCountsAnalytics();
        this.setChartOptions();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  combineServiceCalls(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    forkJoin([
      this.leadsService?.getPast7DaysLeadCountStatus(filter),
      this.leadsService?.getPast7DaysCallBacksCountStatus(filter),
      this.leadsService?.getLastMonthLeadCountStatus(filter),
      this.leadsService?.getLastMonthCallBacksCountStatus(filter),
      this.leadsService?.getLast6MonthsLeadCountStatus(filter),
      this.leadsService?.getLast6MonthsCallBacksCountStatus(filter),
      this.leadsService?.getLastYearLeadCountStatus(filter),
      this.leadsService?.getLastYearCallBacksCountStatus(filter),
    ])?.subscribe(
      ([
        lastWeekLeadCount,
        lastWeekCallbackCount,
        lastMonthLeadCount,
        lastMonthCallbackCount,
        last6MonthLeadCount,
        last6MonthcallbackCount,
        lastYearLeadCount,
        lastYearcallbackCount,
      ]) => {
        this.totalLastWeekLeadsCount = lastWeekLeadCount;
        this.totalLastWeekCallbackCount = lastWeekCallbackCount;
        this.totalLastMonthLeadsCount = lastMonthLeadCount;
        this.totalLastMonthCallbackCount = lastMonthCallbackCount;
        this.totalLast6MonthLeadsCount = last6MonthLeadCount;
        this.totalLast6MonthCallbackCount = last6MonthcallbackCount;
        this.totalLastYearLeadsCount = lastYearLeadCount;
        this.totalLastYearCallbackCount = lastYearcallbackCount;
        this.updateDropdownOptions();
        this.setChartOptions();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  updateCountsAnalytics() {
    // this.countsAnalytics = [
    //   {
    //     name: 'leads',
    //     displayName: 'Leads',
    //     count: this.totalLeadsCount,
    //     routerLink: 'leads',
    //     condition: this.capabilities.leads,
    //     backgroundColor: '#EBF3FE',
    //     color: '#1A3C5D',
    //   },
    //   {
    //     name: 'callbacks',
    //     displayName: 'Callbacks',
    //     count: this.callBacksCount,
    //     routerLink: 'callbacks',
    //     condition: this.capabilities.callbacks,
    //     backgroundColor: '#E6FFFA',
    //     color: '#004F4F',
    //   },
    //   {
    //     name: 'followups',
    //     displayName: 'Follow Ups',
    //     count: this.followupsCount,
    //     routerLink: 'followups',
    //     condition: this.capabilities.followups,
    //     backgroundColor: '#E6EAF0',
    //     color: '#2C3E50',
    //   },
    //   {
    //     name: 'files',
    //     displayName: 'Files',
    //     count: this.totalFilesCount,
    //     routerLink: 'files',
    //     condition: this.capabilities.files,
    //     backgroundColor: '#FBF2EF',
    //     color: '#5A3A2E',
    //   },
    //   // {
    //   //   name: 'partial',
    //   //   displayName: 'Partial Files',
    //   //   count: this.totalPartialCount,
    //   //   routerLink: 'partial',
    //   //   condition: this.capabilities.partial,
    //   //   backgroundColor: '#EBF3FE',
    //   //   color: '#254D70',
    //   // },
    //   {
    //     name: 'credit',
    //     displayName: 'Credit Evaluation',
    //     count: this.totalCreditCount,
    //     routerLink: 'credit',
    //     condition: this.capabilities.credit,
    //     backgroundColor: '#E5F0F4',
    //     color: '#2B4A52',
    //   },
    //   {
    //     name: 'logins',
    //     displayName: 'Logins',
    //     count: this.loginsCount,
    //     routerLink: 'logins',
    //     condition: this.capabilities.logins,
    //     backgroundColor: '#E9ECF1',
    //     color: '#2E3C4A',
    //   },
    //   {
    //     name: 'filesinprocess',
    //     displayName: 'Files In Process',
    //     count: this.fiProcessCount,
    //     routerLink: 'filesinprocess',
    //     condition: this.capabilities.filesinprocess,
    //     backgroundColor: '#FFEFED',
    //     color: '#6F4F4F',
    //   },
    //   {
    //     name: 'approvals',
    //     displayName: 'Sanctions',
    //     count: this.totalSanAmount,
    //     routerLink: 'approvals',
    //     condition: this.capabilities.approvals,
    //     backgroundColor: '#F2F7F2',
    //     color: '#4A5D4F',
    //   },
    //   {
    //     name: 'disbursal',
    //     displayName: 'Disbursals',
    //     count: this.totalDisbAmount,
    //     routerLink: 'disbursals',
    //     condition: this.capabilities.disbursals,
    //     backgroundColor: '#FDF5E6',
    //     color: '#6A4F4B',
    //   },
    //   {
    //     name: 'rejects',
    //     displayName: 'Rejects',
    //     count:
    //       this.totalRejectsCount +
    //       this.totalbankrejectLeadsCount +
    //       this.totalcniLeadsCount,
    //     routerLink: 'rejects',
    //     condition: this.capabilities.rejects,
    //     backgroundColor: '#FAE5E6',
    //     color: '#6D4C4C',
    //   },
    //   {
    //     name: 'lenders',
    //     displayName: 'Lenders',
    //     count: this.bankersCount,
    //     routerLink: 'bankers',
    //     condition: this.capabilities.bankers,
    //     backgroundColor: '#E5EAF5',
    //     color: '3A4D73',
    //   },
    //   {
    //     name: 'team',
    //     displayName: 'Team',
    //     count: this.teamCount,
    //     routerLink: 'team',
    //     condition: this.capabilities.team,
    //     backgroundColor: '#F3EAF8',
    //     color: '#5E3F6D',
    //   },
    //   // {
    //   //   name: 'reports',
    //   //   displayName: 'Reports',
    //   //   count: 4,
    //   //   routerLink: 'reports',
    //   //   condition: this.capabilities.reports,
    //   // },
    // ];


    this.countsAnalytics = [
      {
        name: 'leads',
        displayName: 'Leads',
        count: this.totalLeadsCount,
        routerLink: 'leads',
        condition: this.capabilities.leads,
        backgroundColor: '#EBF3FE',
        color: '#EE7846',
        icon: '../../../assets/images/icons/leads.svg'
      },
      // {
      //   name: 'callbacks',
      //   displayName: 'Callbacks',
      //   count: this.callBacksCount,
      //   routerLink: 'callbacks',
      //   condition: this.capabilities.callbacks,
      //   backgroundColor: '#E6FFFA',
      //   color: '#004F4F',
      // },
      // {
      //   name: 'followups',
      //   displayName: 'Follow Ups',
      //   count: this.followupsCount,
      //   routerLink: 'followups',
      //   condition: this.capabilities.followups,
      //   backgroundColor: '#E6EAF0',
      //   color: '#2C3E50',
      // },
      {
        name: 'files',
        displayName: 'Files',
        count: this.totalFilesCount,
        routerLink: 'files',
        condition: this.capabilities.files,
        backgroundColor: '#FBF2EF',
        color: '#FFC001',
        icon: '../../../assets/images/icons/files.svg'
      },
      // {
      //   name: 'partial',
      //   displayName: 'Partial Files',
      //   count: this.totalPartialCount,
      //   routerLink: 'partial',
      //   condition: this.capabilities.partial,
      //   backgroundColor: '#EBF3FE',
      //   color: '#254D70',
      // },
      // {
      //   name: 'credit',
      //   displayName: 'Credit Evaluation',
      //   count: this.totalCreditCount,
      //   routerLink: 'credit',
      //   condition: this.capabilities.credit,
      //   backgroundColor: '#E5F0F4',
      //   color: '#2B4A52',
      // },
      // {
      //   name: 'logins',
      //   displayName: 'Logins',
      //   count: this.loginsCount,
      //   routerLink: 'logins',
      //   condition: this.capabilities.logins,
      //   backgroundColor: '#E9ECF1',
      //   color: '#2E3C4A',
      // },
      // {
      //   name: 'filesinprocess',
      //   displayName: 'Files In Process',
      //   count: this.fiProcessCount,
      //   routerLink: 'filesinprocess',
      //   condition: this.capabilities.filesinprocess,
      //   backgroundColor: '#FFEFED',
      //   color: '#6F4F4F',
      // },
      {
        name: 'approvals',
        displayName: 'Sanctions',
        count: this.totalSanAmount,
        routerLink: 'approvals',
        condition: this.capabilities.approvals,
        backgroundColor: '#F2F7F2',
        color: '#3A5D82',
        icon: '../../../assets/images/icons/sanctions.svg'
      },
      {
        name: 'disbursal',
        displayName: 'Disbursals',
        count: this.totalDisbAmount,
        routerLink: 'disbursals',
        condition: this.capabilities.disbursals,
        backgroundColor: '#FDF5E6',
        color: '#DCA600',
        icon: '../../../assets/images/icons/disbursal.svg'
      },
      {
        name: 'rejects',
        displayName: 'Rejects',
        count: (this.totalRejectsCount || 0) + (this.totalbankrejectLeadsCount || 0) + (this.totalcniLeadsCount || 0)
        ,
        routerLink: 'rejects',
        condition: this.capabilities.rejects,
        backgroundColor: '#FAE5E6',
        color: '#BB5D5E',
        icon: '../../../assets/images/icons/rejects.svg'
      },
      {
        name: 'team',
        displayName: 'Users',
        count: this.teamCount,
        routerLink: 'team',
        condition: this.capabilities.team,
        backgroundColor: '#FF7948',
        color: '#4878AC',
        icon: '../../../assets/images/icons/team.svg'
      },

      // {
      //   name: 'reports',
      //   displayName: 'Reports',
      //   count: 4,
      //   routerLink: 'reports',
      //   condition: this.capabilities.reports,
      // },
    ];
  }

  updateDropdownOptions() {
    this.dropdownOptions = [
      {
        label: 'Total',
        value: [this.totalLeadsCount, this.callBacksCount],
        labels: ['leads', 'callbacks'],
      },
      {
        label: 'Last Week',
        value: [this.totalLastWeekLeadsCount, this.totalLastWeekCallbackCount],
        labels: ['leads', 'callbacks'],
      },
      {
        label: 'Last Month',
        value: [
          this.totalLastMonthLeadsCount,
          this.totalLastMonthCallbackCount,
        ],
        labels: ['leads', 'callbacks'],
      },
      {
        label: 'Last 6 Months',
        value: [
          this.totalLast6MonthLeadsCount,
          this.totalLast6MonthCallbackCount,
        ],
        labels: ['leads', 'callbacks'],
      },
      {
        label: 'Last Year',
        value: [this.totalLastYearLeadsCount, this.totalLastYearCallbackCount],
        labels: ['leads', 'callbacks'],
      },
    ];
    this.selectedDropdownOption = this.dropdownOptions[0];
    // Trigger chart update
    this.onChangeDropdown(this.selectedDropdownOption);
  }
  setChartData(option: any) {
    if (option && option.value && option.labels) {
      this.pieChartOptions.series = option.value;
      this.pieChartOptions.labels = option.labels;
    } else {
      console.error('Invalid option or missing value property.');
    }
  }
  // onChangeDropdown(event: any) {
  //   const selectedOption = event.target.value;
  //   const option = this.dropdownOptions.find(
  //     (opt) => opt.label === selectedOption
  //   );

  //   if (option) {
  //     this.setChartData(option);
  //     const totalValues = option.value.reduce(
  //       (total, currentValue) => total + currentValue,
  //       0
  //     );
  //     if (totalValues === 0) {
  //       this.chartDisplayMessage = this.image;
  //     } else {
  //       this.chartDisplayMessage = '';
  //     }
  //   } else {
  //     this.chartDisplayMessage = '';
  //   }
  // }

  onChangeDropdown(selectedOption: any) {
    if (selectedOption && selectedOption.value) {
      this.setChartData(selectedOption);

      const totalValues = selectedOption.value.reduce(
        (total, currentValue) => total + currentValue,
        0
      );

      this.chartDisplayMessage = totalValues === 0 ? this.image : '';
    } else {
      this.chartDisplayMessage = '';
    }
  }

  getLeadUsers(filter = {}) {
    this.leadsService?.getActiveUsers(filter).subscribe(
      (leadUsers: any) => {
        this.leadUsers = [{ name: 'All' }, ...leadUsers];
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getAllLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers: any) => {
        this.allleadUsers = [{ name: 'All' }, ...leadUsers];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  statusChange(event) {
    const selectedUser = event.value;
    this.userId = selectedUser ? selectedUser.id : null;
    this.userName = selectedUser ? selectedUser.name : null;
    this.getLeadCountforFilter();
    this.getFollowUpCountforFilter();
    this.getApprovalsCountforFilter();
    this.getFilesCountforFilter();
    // this.getPartialFilesCountforFilter();
    this.getFIPProcessDistinctLeadsCountforFilter();
    this.getDisbursalLeadCountforFilter();
  }

  setBarChartOptionsForFilter() {
    // this.barChartData = {
    //   labels: ['Leads', 'Follow Ups', 'Files', 'Files In Process', 'Sanctions', 'Disbursals'],
    //   datasets: [
    //     {
    //       label: 'Counts',
    //       data: [
    //         this.leadsCountforFilter,
    //         this.followupsCountforFilter,
    //         this.filesCountforFilter,
    //         this.fiProcessCountforFilter,
    //         this.approvalCountforFilter,
    //         this.disbursalCountforFilter
    //       ],
    //       backgroundColor: ['#EE7846', '#DCA600', '#BB5D5E', '#FABE06', '#3A5D82', '#4878AC'],
    //       borderRadius: 4,
    //       maxBarThickness: 45
    //     }
    //   ]
    // };
    // this.barChartData = {
    //   labels: ['Category '], // single label (dummy, since we’ll use one bar per dataset)
    //   datasets: [
    //     {
    //       label: 'Leads',
    //       data: [this.leadsCountforFilter],
    //       backgroundColor: '#EE7846',
    //       maxBarThickness: 50
    //     },
    //     {
    //       label: 'Follow Ups',
    //       data: [this.followupsCountforFilter],
    //       backgroundColor: '#DCA600',
    //       maxBarThickness: 50
    //     },
    //     {
    //       label: 'Files',
    //       data: [this.filesCountforFilter],
    //       backgroundColor: '#BB5D5E',
    //       maxBarThickness: 50
    //     },
    //     {
    //       label: 'Files In Process',
    //       data: [this.fiProcessCountforFilter],
    //       backgroundColor: '#FABE06',
    //       maxBarThickness: 50
    //     },
    //     {
    //       label: 'Sanctions',
    //       data: [this.approvalCountforFilter],
    //       backgroundColor: '#3A5D82',
    //       maxBarThickness: 50
    //     },
    //     {
    //       label: 'Disbursals',
    //       data: [this.disbursalCountforFilter],
    //       backgroundColor: '#4878AC',
    //       maxBarThickness: 50
    //     }
    //   ]
    // };

    // this.barChartOptions = {
    //   responsive: true,
    //   // maintainAspectRatio: false,
    //   plugins: {
    //     legend: {
    //       display: true,
    //       position: 'bottom', // ⬅️ move legend below chart
    //       labels: {
    //         usePointStyle: true, // ⬅️ use circle indicators
    //         pointStyle: 'circle',
    //         color: '#000',
    //         font: {
    //           size: 12
    //         }
    //       }
    //     },

    //     title: {
    //       display: true,
    //       text: 'Agent-Based Metrics',
    //       color: '#29415B',
    //       align: 'start',
    //       font: { size: 18 }
    //     }
    //   },
    //   animation: {
    //     onComplete: (animationCtx) => {
    //       const chart = animationCtx.chart;
    //       const ctx = chart.ctx;
    //       ctx.save();
    //       ctx.font = '12px ';
    //       ctx.textAlign = 'center';
    //       ctx.textBaseline = 'bottom';

    //       chart.data.datasets.forEach((dataset, datasetIndex) => {
    //         const meta = chart.getDatasetMeta(datasetIndex);
    //         meta.data.forEach((bar, index) => {
    //           const value = dataset.data[index];
    //           if (value != null) {
    //             ctx.fillStyle = '#000'; // color of the label
    //             ctx.fillText(value.toString(), bar.x, bar.y - 5);
    //           }
    //         });
    //       });

    //       ctx.restore();
    //     }
    //   },
    //   scales: {
    //     x: {
    //       title: { display: false },
    //       ticks: { color: '#000' },
    //       grid: { display: false },
    //       barPercentage: 0.6,        // Shrinks individual bars
    //       categoryPercentage: 0.6    // Shrinks total width allotted for bars in one group
    //     },
    //     y: {
    //       title: { display: true, text: 'Count' },
    //       beginAtZero: true,
    //       grid: { color: '#e5e5e5' }
    //     }
    //   }
    // };




    // this.AgentWiseBarChartOptions = {
    //   series: [
    //     {
    //       name: 'Leads',
    //       data: [this.leadsCountforFilter],
    //     },
    //     {
    //       name: 'Follow Ups',
    //       data: [this.followupsCountforFilter],
    //     },
    //     {
    //       name: 'Files',
    //       // data: [this.filesCountforFilter + this.partialsCountforFilter],
    //       data: [this.filesCountforFilter],
    //     },
    //     {
    //       name: 'Files In Process',
    //       data: [this.fiProcessCountforFilter],
    //     },
    //     {
    //       name: 'Sanctions',
    //       data: [this.approvalCountforFilter],
    //     },
    //     {
    //       name: 'Disbursals',
    //       data: [this.disbursalCountforFilter],
    //     },
    //   ],
    //   chart: {
    //     height: 300,
    //     type: 'bar',
    //     toolbar: { show: false },
    //     events: {
    //       dataPointSelection: (event, chartContext, config) => {
    //         if (
    //           this.userDetails &&
    //           this.userDetails.userType &&
    //           this.userDetails.userType == '1'
    //         ) {
    //           const seriesIndex = config.seriesIndex;
    //           const clickedCategory = config.dataPointIndex;
    //           switch (seriesIndex) {
    //             case 0:
    //               this.router.navigate([`user/leads`], {
    //                 queryParams: {
    //                   id: this.userId,
    //                   name: this.userName,
    //                 },
    //               });
    //               break;
    //             case 1:
    //               this.router.navigate([`user/followups`], {
    //                 queryParams: {
    //                   id: this.userId,
    //                   name: this.userName,
    //                 },
    //               });
    //               break;
    //             case 2:
    //               this.router.navigate([`user/files`], {
    //                 queryParams: {
    //                   id: this.userId,
    //                   name: this.userName,
    //                 },
    //               });
    //               break;
    //             case 3:
    //               this.router.navigate([`user/filesinprocess`], {
    //                 queryParams: {
    //                   id: this.userId,
    //                   name: this.userName,
    //                 },
    //               });
    //               break;
    //             case 4:
    //               this.router.navigate([`user/approvals`], {
    //                 queryParams: {
    //                   id: this.userId,
    //                   name: this.userName,
    //                 },
    //               });
    //               break;
    //             case 5:
    //               this.router.navigate([`user/disbursals`], {
    //                 queryParams: {
    //                   id: this.userId,
    //                   name: this.userName,
    //                 },
    //               });
    //               break;
    //             default:
    //               console.log('No valid route for this selection');
    //               break;
    //           }
    //         }
    //       },
    //     },
    //   },
    //   plotOptions: {
    //     bar: {
    //       distributed: false,
    //     },
    //   },
    //   // colors: [
    //   //   '#FF5733',
    //   //   '#33FF57',
    //   //   '#3357FF',
    //   //   '#FFC300',
    //   //   '#C70039',
    //   //   // '#703960',
    //   //   '#581845',

    //   // ],
    //   //  colors: [
    //   //   '#EE7846',
    //   //   '#33FF57',
    //   //   '#FFC001',
    //   //   '#BB5D5E',
    //   //   '#3A5D82',
    //   //   // '#703960',
    //   //   '#DCA600',

    //   // ],
    //   colors: [
    //     '#EE7846',
    //     '#DCA600',
    //     '#BB5D5E',
    //     '#FABE06',
    //     '#3A5D82',
    //     // '#703960',
    //     '#4878AC',

    //   ],

    //   dataLabels: {
    //     enabled: true,
    //   },
    //   stroke: {
    //     width: 1,
    //     // colors: ['#fff'],
    //   },
    //   title: {
    //     text: 'Agent-Based Metrics',
    //     align: 'left',
    //     style: { fontSize: '18px', color: '#29415B' },
    //   },
    //   grid: {
    //     // borderColor: '#e7e7e7',
    //     // row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
    //   },
    //   markers: { size: 1 },
    //   xaxis: {
    //     categories: ['Total Count'],
    //     title: {
    //       text: 'Metrics',
    //       // style: {
    //       //   color: '#ffffff',

    //       // },
    //     },
    //     labels: {
    //       // style: {
    //       //   colors: '#ffffff',
    //       // },
    //     },
    //   },
    //   yaxis: {
    //     title: {
    //       text: 'Count',
    //       // style: {
    //       //   color: '#ffffff',

    //       // }
    //     },
    //     labels: {
    //       // style: {
    //       //   colors: '#ffffff',
    //       // },
    //     },
    //   },
    //   //     legend: {
    //   //       position: 'top',
    //   //       horizontalAlign: 'right',
    //   //       floating: true,
    //   //       markers: {
    //   //   width: 12,
    //   //   height: 12,
    //   //   radius: 12 // This makes the legend color indicators rounded
    //   // },
    //   //       offsetY: -20,
    //   //       offsetX: -5,
    //   //       labels: {
    //   //         // colors: '#ffffff',
    //   //       },
    //   //     },
    //   legend: {
    //     position: 'bottom',
    //     horizontalAlign: 'center',
    //     floating: false,
    //     offsetY: 0,
    //     offsetX: 0,
    //     markers: {
    //       width: 12,
    //       height: 12,
    //       radius: 12,
    //     },
    //     // itemMargin: {
    //     //   horizontal: 10,
    //     //   vertical: 5,
    //     // },
    //   }

    // };

    this.AgentWiseBarChartOptions = {
      series: [
        {
          name: 'Count',
          data: [
            this.leadsCountforFilter,
            this.followupsCountforFilter,
            this.filesCountforFilter,
            this.fiProcessCountforFilter,
            this.approvalCountforFilter,
            this.disbursalCountforFilter,
          ]
        }
      ],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: { show: false },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const index = config.dataPointIndex;
            switch (index) {
              case 0:
                this.router.navigate([`user/leads`], { queryParams: { id: this.userId, name: this.userName } });
                break;
              case 1:
                this.router.navigate([`user/followups`], { queryParams: { id: this.userId, name: this.userName } });
                break;
              case 2:
                this.router.navigate([`user/files`], { queryParams: { id: this.userId, name: this.userName } });
                break;
              case 3:
                this.router.navigate([`user/filesinprocess`], { queryParams: { id: this.userId, name: this.userName } });
                break;
              case 4:
                this.router.navigate([`user/approvals`], { queryParams: { id: this.userId, name: this.userName } });
                break;
              case 5:
                this.router.navigate([`user/disbursals`], { queryParams: { id: this.userId, name: this.userName } });
                break;
            }
          }
        }
      },
      title: {
        text: 'Agent-Based Metrics',
        align: 'left',
        style: { fontSize: '18px', color: '#29415B' },
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '50%',
          borderRadius: 2
        }
      },
      colors: ['#EE7846', '#DCA600', '#BB5D5E', '#FABE06', '#3A5D82', '#4878AC'],
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: ['Leads', 'Follow Ups', 'Files', 'Files In Process', 'Sanctions', 'Disbursals'],
        title: {
          text: 'Metrics',
        },
        labels: {
          style: {
            fontSize: '10px',
            fontWeight: 400
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count',
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        offsetY: 0,
        offsetX: 0,
        markers: {
          width: 12,
          height: 12,
          radius: 12,
        },
      }
    };
  }
  onBarClick(event: any) {
    const { chart, originalEvent } = event;

    if (!chart || !originalEvent) return;

    const elements = chart.getElementsAtEventForMode(
      originalEvent,
      'nearest',
      { intersect: true },
      true
    );

    if (elements.length && this.userDetails?.userType === '1') {
      const index = elements[0].index;
      const routes = [
        'user/leads',
        'user/followups',
        'user/files',
        'user/filesinprocess',
        'user/approvals',
        'user/disbursals'
      ];

      const targetRoute = routes[index];
      if (targetRoute) {
        this.router.navigate([targetRoute], {
          queryParams: {
            id: this.userId,
            name: this.userName
          }
        });
      }
    }
  }


  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

    api_filter = Object.assign(
      {},
      api_filter,

    );
    if (api_filter) {
      this.getFIPProcessDistinctLeadsCount(api_filter);
      this.getFIPProcessDistinctLeads(api_filter);
    }
  }

  getFIPProcessDistinctLeadsCount(filter = {}) {
    this.leadsService.getFIPProcessDistinctLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.filesInProcessCount = leadsCount;
        // console.log('Total leads count ', this.totalLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getFIPProcessDistinctLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getFIPProcessDistinctLeads(filter).subscribe(
      (response) => {
        this.filesInProcessleads = response;
        // console.log('fip distinct leads', this.filesInProcessleads);
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getSourceName(userId) {
    if (this.allleadUsers && this.allleadUsers.length > 0) {
      let leadUserName = this.allleadUsers.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }
  get allCountsZero(): boolean {
    const allSanctionedZero = this.sanctionedAmounts?.every(val => val === 0);
    const allDisbursedZero = this.disbursedAmounts?.every(val => val === 0);
    return (
      allSanctionedZero &&
      allDisbursedZero
    );
  }
  setChartOptions() {
    this.leadsCallbacksChartOptions = {
      series: [
        {
          name: 'Leads',
          data: this.monthwiseLeadCount,
        },
        {
          name: 'Callbacks',
          data: this.monthwiseCallbackCount,
        },
      ],
      chart: {
        height: 400,
        type: 'area',
        toolbar: { show: false },
        // background: '#33009C',
      },
      colors: ['#33009C', '#ff0043'],
      // colors: ['', '#ff0043'],
      //colors: ['#0FA4AF', '#964734'],
      //colors: ['#A1BE95', '#F98866'],

      dataLabels: { enabled: true },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Monthly Leads and Callbacks',
        align: 'left',
        style: { fontSize: '18px', color: '#29415B' },
        // style: { fontSize: '18px', color: '#33009C' },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },

      },
      markers: { size: 1 },
      xaxis: {
        categories: this.monthLabels,
        title: {
          text: 'Month Wise',
          // style: {
          //   color: '#ffffff',
          // },

        },
        labels: {
          // style: {
          //   colors: '#ffffff',
          // },
        },
      },
      yaxis: {
        title: {
          text: 'Count',
          //  style: {
          //   color: '#ffffff',
          // },
        }, labels: {
          // style: {
          //   colors: '#ffffff',
          // },
        },
      },

      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -10,
        offsetX: -5,
        labels: {
          // colors: '#ffffff',
        },
      },
    };
    // this.pieChartOptions = {
    //   series: [this.totalLeadsCount, this.callBacksCount],
    //   chart: {
    //     height: 345,
    //     type: 'radialBar',
    //     toolbar: { show: false },
    //   },
    //   labels: ['Leads', 'Callbacks'], // Custom labels for chart and legend
    //   plotOptions: {
    //     radialBar: {
    //       dataLabels: {
    //         name: {
    //           show: true,
    //           fontSize: '16px',
    //         },
    //         value: {
    //           show: true,
    //           fontSize: '14px',
    //         },
    //         total: {
    //           show: true,
    //           label: 'Total',
    //           formatter: () => {
    //             return (this.totalLeadsCount + this.callBacksCount).toString();
    //           },
    //         },
    //       },
    //     },
    //   },
    //   colors: ['#FF7948', '#4878AC'],
    //   title: {
    //     text: 'Leads Callback Trends',
    //     align: 'left',
    //     style: { fontSize: '18px', color: '#29415B' },
    //   },
    //   legend: {
    //     show: true,
    //     position: 'bottom',
    //     horizontalAlign: 'center',
    //     formatter: (seriesName, opts) => {
    //       // This uses the label provided in `labels`
    //       const value = opts.w.globals.series[opts.seriesIndex];
    //       return `${seriesName}: ${value}`;
    //     },
    //     markers: {
    //       width: 12,
    //       height: 12,
    //       radius: 12,
    //     },
    //     itemMargin: {
    //       horizontal: 10,
    //       vertical: 5,
    //     },
    //   },
    // };

    this.pieChartOptions = {
      series: [this.totalLeadsCount, this.callBacksCount],
      labels: ['Leads', 'Callbacks'],
      chart: {
        // height: 350,
        height: 310,
        type: 'donut',
        toolbar: { show: false },
      },
      colors: ['#FF7948', '#4878AC'],
      title: {
        text: 'Leads Callback Trends',
        align: 'left',
        style: { fontSize: '18px', color: '#29415B' },
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'right',
        floating: false,
        offsetY: 15,
        offsetX: -5,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          var customLabels = ['Leads', 'Callbacks'];
          var seriesValues = opts.w.config.series[opts.seriesIndex];
          var customLabel = customLabels[opts.seriesIndex];
          return customLabel + ': ' + seriesValues;
        },
      },
      responsive: [
        {

          options: {

            legend: {

              position: 'bottom',
            },
          },
        },
      ],
    };

    this.setBarChartOptionsForFilter();
    this.ApprovedDisbursedAmountChartOptions = {
      series: [
        {
          name: 'Sanctioned',
          data: this.sanctionedAmounts,
        },
        {
          name: 'Disbursed',
          data: this.disbursedAmounts,
        },
      ],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: { show: false },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (
              this.userDetails &&
              this.userDetails.userType &&
              this.userDetails.userType == '1'
            ) {
              const seriesIndex = config.seriesIndex;
              const dataPointIndex = config.dataPointIndex;
              const clickedMonth = this.monthLabels[dataPointIndex];
              const selectedDate = this.moment(clickedMonth, 'MMM YYYY');
              const startDate = selectedDate
                .startOf('month')
                .format('YYYY-MM-DD');
              const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');
              if (seriesIndex === 0) {
                this.router.navigate(['/user/approvals'], {
                  queryParams: { startDate, endDate },
                });
              } else if (seriesIndex === 1) {
                this.router.navigate(['/user/disbursals'], {
                  queryParams: { startDate, endDate },
                });
              }
            }
          },
        },
      },
      // colors: ['#2A004E', '#F76C6C'],
      colors: ['#EE7846', '#29415B'],
      dataLabels: {
        enabled: true,
        formatter: (value: number) => {
          return this.convertToLakhsOrCrores(value);
        },
        style: {
          fontSize: '12px',
        },
      },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Monthly Sanctions and Disbursals',
        align: 'left',
        style: { fontSize: '18px', color: '#29415B' },
      },
      grid: {
        // borderColor: '#e7e7e7',
        // row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      markers: { size: 1 },
      xaxis: {
        categories: this.monthLabels,
        title: {
          text: 'Month',
          // style: {
          //   color: '#ffffff',
          // }
        },
        labels: {
          // style: {
          //   colors: '#ffffff',
          // },
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
          // style: {
          //   color: '#ffffff',
          // }
        },
        labels: {
          // style: {
          //   colors: '#ffffff'
          // },
          formatter: (value: number) => this.convertToLakhsOrCrores(value),
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -20,
        offsetX: -5,
        labels: {
          // colors: '#ffffff',
        },
      },
    };
  }
  goToRoute(route) {
    this.routingService.setFeatureRoute('user');
    this.routingService.handleRoute(route, null);
  }
}
