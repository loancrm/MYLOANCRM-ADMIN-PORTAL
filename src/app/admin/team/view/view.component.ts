import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { MenuItem } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { forkJoin } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  breadCrumbItems: any = [];
  leadUsers: any = [];
  userRoles: any = [];
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  @ViewChild('fipleadsTable') fipleadsTable!: Table;
  @ViewChild('sanctionsTable') sanctionsTable!: Table;
  @ViewChild('inHouseRejectsleadsTable') inHouseRejectsleadsTable!: Table;
  @ViewChild('leadsTablebank') leadsTablebank!: Table;
  currentTableEvent: any;
  totalSanctionedAmount: number = 0;
  totalDisbursedAmount: number = 0;
  totalDisbursedAmountInLakhsOrCrores: any = 0;
  totalSanctionedAmountInLakhsOrCrores: any = 0;
  businessNameToSearch: any;
  businessNameToSearchfollowups: any;
  businessNameToSearchfip: any;
  mobileNumberToSearchfip: any;
  businessNameToSearchSanctions: any;
  businessNameToSearchforbank: any;
  businessNameToSearchcni: any;
  mobileNumberToSearchSanctions: any;
  mobileNumberToSearchcni: any;
  businessNameToSearchInHouseReject: any;
  mobileNumberToSearchInHouseRejects: any;
  mobileNumberToSearchforbank: any;
  items: any;
  totalDisbursalLeadsCount: any = 0;
  lastMonthLeadCount: any = 0;
  bankRejectsCount: any = 0;
  lastMonthCallbackCount: any = 0;
  allProcessedFilesCount: any = 0;
  searchFilter: any = {};
  searchFilterfip: any = {};
  searchFilterSanctions: any = {};
  searchFilterInHouseRejects: any = {};
  appliedFilterSanctions: any = {};
  appliedFilterfollowups: any = {};
  appliedFilterbankRejects: any = {};
  searchFilterbank: any = {};
  searchFiltercni: any = {};
  searchFilterfollowups: any = {};
  appliedFilter: {};
  appliedFilterfip: {};
  appliedFilterCni: {};
  appliedFilterInHouseRejects: {};
  amountBarChartOptions: any;
  pieChartOptionsforFilter: any;
  @ViewChild('disbursalleadsTable') disbursalleadsTable!: Table;
  @ViewChild('leadsTablecni') leadsTablecni!: Table;
  @ViewChild('followupsTable') followupsTable!: Table;

  mobileNumberToSearch: any;
  mobileNumberToSearchfollow: any;
  inHouseRejectedleads: any = [];
  fipleads: any = [];
  CniLeads: any = [];
  followupLeads: any = [];
  bankRejectLeads: any = [];
  sanctionLeads: any = [];
  totalLeadsCount: any = 0;
  totalFollowupLeadsCount: any = 0;
  callBacksCount: any = 0;
  totalLoginsCount: any = 0;
  totalCNICount: any = 0;
  thisMonthLeadCount: any = 0;
  lastBeforeMonthLeadCount: any = 0;
  totalFipLeadsCount: any = 0;
  thisMonthCallbackCount: any = 0;
  lastBeforeMonthCallbackCount: any = 0;
  totalfilesCount: any = 0;
  // partialsCount: any = 0;
  totalCreditsCount: any = 0;
  totalSanctionsCount: any = 0;
  inHouseRejectsCount: any = 0;
  disbursalleads: any = [];
  activeItem: any;
  events: any[];
  callbackevents: any[];
  filterConfig: any[] = [];
  filterConfigSanctions: any[] = [];
  filterConfigDisbursals: any[] = [];
  chartDisplayMessage1 = '../../../../assets/images/menu/no-data.gif';
  loading: any;
  userId: string | null = null;
  userDetails: any = null;
  user: any;
  moment: any;
  currentMonth: string;
  previousMonth: string;
  twoMonthsAgo: string;
  twoMonthsAgo1: string;
  sanctionedAmounts: number[] = [];
  disbursedAmounts: number[] = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  isPasswordVisible: boolean = false;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    this.user = userDetails.user;
    // console.log('UserType:', this.user?.userType); // DEBUG LOG
    this.breadCrumbItems = [
      {
        label: 'Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      }
    ];
    if (+this.user?.userType !== 3) {
      this.breadCrumbItems.push({
        label: 'Team',
        routerLink: '/user/team',
        queryParams: { v: this.version },
      });
    }
    this.breadCrumbItems.push({ label: 'User Profile' });
    // console.log(this.breadCrumbItems);
    this.getLeadUsers();
  }
  ngOnInit(): void {
    this.currentMonth = this.getMonthName(0);
    this.previousMonth = this.getMonthName(1);
    this.twoMonthsAgo = this.getMonthName(2);
    this.twoMonthsAgo1 = this.getMonthName(3);
    const allItems = [
      { label: 'Overview', name: 'overview' },
      { label: 'Leads', name: 'leads' },
      { label: 'Callbacks', name: 'callbacks' },
      { label: 'Files', name: 'files' },
      { label: 'Follow Ups', name: 'followups' },
      { label: 'Files In Process', name: 'files in process' },
      { label: 'Sanctions', name: 'sanctions' },
      { label: 'Disbursals', name: 'disbursals' },
      { label: 'In House Rejects', name: 'in House Rejects' },
      { label: 'Banker Rejects', name: 'banker rejects' },
      { label: 'CNI', name: 'cni' },
    ];
    if (this.user?.userType == 3) {
      // Exclude specific tabs for userType 3
      this.items = allItems.filter(
        (item) =>
          !['leads', 'callbacks', 'files', 'followups'].includes(item.name)
      );
    } else {
      this.items = allItems;
    }
    // console.log(this.items)
    this.loadActiveItem();
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // console.log(this.userId);
      this.getUsersDetailsById(this.userId);
      this.getDisbursalLeadsforcount();
    }
    this.setFilterConfig();
    this.getUserRoles();
    this.loadLeads(event);
    this.loadAmount(event);
    this.loadCallBacks(event);
    this.loadFiles(event);
    // this.loadPartialFiles(event);
    this.loadCredits(event);
    this.loadLogins(event);
    this.loadInhouseRejectLeads(event);
    this.loadAllProcessedFiles(event);
  }

  redirectTo(route: string) {
    this.router.navigate([`user/${route}`], {
      queryParams: {
        id: this.userId,
        name: this.userDetails ? this.userDetails.name : null,
      },
    });
  }
  getMaskedPhone(phone: any) {
    return this.leadsService.maskPhoneNumber(phone);
  }
  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('teamActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  loadAllProcessedFiles(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign({}, api_filter);
    // console.log(api_filter);
    if (api_filter) {
      this.getAllProcessedFilesCount(api_filter);
    }
  }
  loadCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterCni
    );
    if (api_filter) {
      this.getCNIRejectedLeadCount(api_filter);
      this.getCNIRejectsLeads(api_filter);
    }
  }
  getCNIRejectsLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getCNIRejectsLeads(filter).subscribe(
      (response) => {
        this.CniLeads = response;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getCNIRejectedLeadCount(filter = {}) {
    this.leadsService.getCNIRejectedLeadCount(filter).subscribe(
      (response) => {
        this.totalCNICount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getAllProcessedFilesCount(filter = {}) {
    this.leadsService.getDistinctLeadCount(filter).subscribe(
      (response) => {
        this.allProcessedFilesCount = response;
        // console.log(this.allProcessedFilesCount);
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterbankRejects
    );
    if (api_filter) {
      this.getBankRejectedLeadCount(api_filter);
      this.getBankRejectsLeads(api_filter);
    }
  }
  getBankRejectsLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getBankRejectsLeads(filter).subscribe(
      (response) => {
        this.bankRejectLeads = response;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getBankRejectedLeadCount(filter = {}) {
    this.leadsService.getBankRejectedLeadCount(filter).subscribe(
      (response) => {
        this.bankRejectsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadInhouseRejectLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter['leadInternalStatus-eq'] = 10;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterInHouseRejects,
      this.appliedFilterInHouseRejects
    );
    if (api_filter) {
      this.getTotalInhouseRejectsCount(api_filter);
      this.getInHouseRejectedTotalLeads(api_filter);
    }
  }

  areAllValuesZero(): boolean {
    return (
      this.sanctionedAmounts.every((val) => val === 0) &&
      this.disbursedAmounts.every((val) => val === 0)
    );
  }
  loadAmount(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    if (api_filter) {
      this.sanctionedAmounts = [];
      this.disbursedAmounts = [];
      const apiCalls = [
        this.leadsService.getuserLastMonthSanctionedAmount(api_filter),
        this.leadsService.getuserLastMonthDisbursedAmount(api_filter),
        this.leadsService.getuserCurrentMonthSanctionedAmount(api_filter),
        this.leadsService.getuserCurrentMonthDisbursedAmount(api_filter),
        this.leadsService.getuserLastLastMonthSanctionedAmount(api_filter),
        this.leadsService.getuserLastLastMonthDisbursedAmount(api_filter),
        this.leadsService.getuserTwoMonthsAgoSanctionedAmount(api_filter),
        this.leadsService.getuserTwoMonthsAgoDisbursedAmount(api_filter),
      ];
      forkJoin(apiCalls).subscribe(
        (responses: any) => {
          this.sanctionedAmounts = [
            responses[6], // Two Months Ago Sanctioned
            responses[4], // Last Last Month Sanctioned
            responses[0], // Last Month Sanctioned
            responses[2], // Current Month Sanctioned
          ];
          this.disbursedAmounts = [
            responses[7], // Two Months Ago Disbursed
            responses[5], // Last Last Month Disbursed
            responses[1], // Last Month Disbursed
            responses[3], // Current Month Disbursed
          ];
          // console.log('Sanctioned Amounts:', this.sanctionedAmounts);
          // console.log('Disbursed Amounts:', this.disbursedAmounts);
          this.setBarChartOptionsForFilter();
        },
        (error) => {
          this.toastService.showError(error);
        }
      );
    }
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

  setBarChartOptionsForFilter() {
    this.amountBarChartOptions = {
      series: [
        {
          name: 'Sanctioned Amount',
          data: this.sanctionedAmounts,
        },
        {
          name: 'Disbursed Amount',
          data: this.disbursedAmounts,
        },
      ],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: { show: true },
      },
      plotOptions: {
        bar: {
          distributed: false,
        },
      },
      // colors: ['#01B8AA', '#6962AD'],
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
        text: 'Monthly Financial Metrics',
        align: 'left',
        style: { fontSize: '18px', color: '#29415b' },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      markers: { size: 1 },
      xaxis: {
        categories: [
          this.twoMonthsAgo1,
          this.twoMonthsAgo,
          this.previousMonth,
          this.currentMonth,
        ],
        title: {
          text: 'Months',
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
          text: 'Amount',
          // style: {
          //   color: '#ffffff',
          // },
        },
        labels: {
          // style: {
          //   colors: '#ffffff',
          // },

          formatter: (value: number) => {
            const formattedValue = this.convertToLakhsOrCrores(value);
            return formattedValue;
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -20,
        offsetX: -5,
        labels: {
          // colors: '#fff',
        },
      },
    };
    this.pieChartOptionsforFilter = {
      series: [
        this.totalLeadsCount,
        this.totalfilesCount +
        // this.partialsCount +
        this.totalCreditsCount +
        this.totalLoginsCount +
        this.allProcessedFilesCount +
        this.inHouseRejectsCount,
      ],
      labels: ['Leads', 'Files'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              show: true,
              fontSize: '16px',
            },
            value: {
              show: true,
              fontSize: '14px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
                return (this.totalLeadsCount + this.callBacksCount).toString();
              },
            },
          },
        },
      },
      chart: {
        height: 345,
        type: 'donut',
        toolbar: { show: true },
      },
      colors: ['#FF7948', '#4878AC', '#FE746E'],
      title: {
        text: 'Total Leads and Files Insights',
        align: 'left',
        style: { fontSize: '18px', color: '#29415b' },
      },
      // legend: {
      //   show: false,
      //   position: 'top',
      //   horizontalAlign: 'right',
      //   floating: false,
      //   offsetY: 15,
      //   offsetX: -5,
      // },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        formatter: (seriesName, opts) => {
          // This uses the label provided in `labels`
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}`;
        },
        markers: {
          width: 12,
          height: 12,
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          var customLabels = ['Leads', 'Files'];
          var seriesValues = opts.w.config.series[opts.seriesIndex];
          var customLabel = customLabels[opts.seriesIndex];
          return customLabel + ': ' + seriesValues;
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  loadApprovalLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterSanctions,
      this.appliedFilterSanctions
    );
    if (api_filter) {
      this.getApprovedLeadCount(api_filter);
      this.getSanctionLeads(api_filter);
    }
  }
  maskPassword(input: any): string {
    return String(input).replace(/./g, '•');
  }
  updateUsers(userId) {
    this.routingService.handleRoute('team/update/' + userId, null);
  }
  getSanctionLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getApprovalsLeads(filter).subscribe(
      (response) => {
        this.sanctionLeads = response;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getApprovedLeadCount(filter = {}) {
    this.leadsService.getApprovedLeadCount(filter).subscribe(
      (response) => {
        this.totalSanctionsCount = response;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadCredits(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 5;
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      this.getCreditsCount(api_filter);
    }
  }

  loadLogins(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 11;
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      this.getLoginsCount(api_filter);
    }
  }

  getCreditsCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalCreditsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLoginsCount(filter = {}) {
    this.leadsService.getLoginsCountStatus(filter).subscribe(
      (response) => {
        this.totalLoginsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  // loadPartialFiles(event) {
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   api_filter['leadInternalStatus-eq'] = 4;
  //   api_filter['sourcedBy-eq'] = this.userId;
  //   api_filter = Object.assign({}, api_filter);
  //   if (api_filter) {
  //     this.getPartialFilesCount(api_filter);
  //   }
  // }

  // getPartialFilesCount(filter = {}) {
  //   this.leadsService.getLeadsCount(filter).subscribe(
  //     (leadsCount) => {
  //       this.partialsCount = leadsCount;
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  getEntityName(entity) {
    if (this.businessEntities && this.businessEntities.length > 0) {
      let entityName = this.businessEntities.filter(
        (leadStatus) => leadStatus.name == entity
      );
      return (
        (entityName &&
          entityName[0] &&
          entityName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  loadFiles(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 3;
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      this.getTotalLeadsFilesCount(api_filter);
    }
  }
  getInHouseRejectedTotalLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getInhouseRejectedLeads(filter).subscribe(
      (response) => {
        this.inHouseRejectedleads = response;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalfilesCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTotalInhouseRejectsCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.inHouseRejectsCount = leadsCount;
        this.setBarChartOptionsForFilter();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['callbackInternalStatus-or'] = '1';
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      // console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getLastMonthCallbacksCount(api_filter);
      this.getThisMonthCallBacksCount(api_filter);
      this.getTwoMonthsAgoCallBacksCount(api_filter);
    }
  }
  getCallBacksCount(filter = {}) {
    this.leadsService.getCallBacksCount(filter).subscribe(
      (leadsCount) => {
        this.callBacksCount = leadsCount;
        this.updateCallbackEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLastMonthCallbacksCount(filter = {}) {
    this.leadsService.getLastMonthCallBacksCountStatus(filter).subscribe(
      (leadsCount) => {
        this.lastMonthCallbackCount = leadsCount;
        // console.log(this.lastMonthCallbackCount);
        this.updateCallbackEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getThisMonthCallBacksCount(filter = {}) {
    this.leadsService.getThisMonthCallBacksCount(filter).subscribe(
      (leadsCount) => {
        this.thisMonthCallbackCount = leadsCount;
        // console.log(this.thisMonthCallbackCount);
        this.updateCallbackEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTwoMonthsAgoCallBacksCount(filter = {}) {
    this.leadsService.getTwoMonthsAgoCallBacksCount(filter).subscribe(
      (leadsCount) => {
        this.lastBeforeMonthCallbackCount = leadsCount;
        // console.log(this.lastBeforeMonthCallbackCount);
        this.updateCallbackEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLastMonthLeadsCount(filter = {}) {
    this.leadsService.getLastMonthLeadCountStatus(filter).subscribe(
      (leadsCount) => {
        this.lastMonthLeadCount = leadsCount;
        // console.log(this.lastMonthLeadCount);
        this.updateEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getThisMonthLeadCountStatus(filter = {}) {
    this.leadsService.getThisMonthLeadCountStatus(filter).subscribe(
      (leadsCount) => {
        this.thisMonthLeadCount = leadsCount;
        // console.log(this.thisMonthLeadCount);
        this.updateEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLastBeforeMonthLeadCountStatus(filter = {}) {
    this.leadsService.getLastBeforeMonthLeadCountStatus(filter).subscribe(
      (leadsCount) => {
        this.lastBeforeMonthLeadCount = leadsCount;
        // console.log(this.lastBeforeMonthLeadCount);
        this.updateEvents();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  loadFollowupLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 16;
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterfollowups,
      this.appliedFilterfollowups
    );

    if (api_filter) {
      this.getTotalFollowupLeadsCount(api_filter);
      this.getfollowupLeads(api_filter);
    }
  }
  getfollowupLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getLeads(filter).subscribe(
      (response) => {
        this.followupLeads = response;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = '1';
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      this.getTotalLeadsCount(api_filter);
      this.getLastMonthLeadsCount(api_filter);
      this.getThisMonthLeadCountStatus(api_filter);
      this.getLastBeforeMonthLeadCountStatus(api_filter);
    }
  }

  getTotalLeadsCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTotalFollowupLeadsCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalFollowupLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadFIpLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterfip,
      this.appliedFilterfip
    );
    if (api_filter) {
      this.getFIPProcessDistinctLeadsCount(api_filter);
      this.getFIPProcessDistinctLeads(api_filter);
    }
  }
  getFIPProcessDistinctLeadsCount(filter = {}) {
    this.leadsService.getFIPProcessDistinctLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalFipLeadsCount = leadsCount;
        this.setBarChartOptionsForFilter();
        // console.log('Total leads count ', this.totalFipLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getFIPProcessDistinctLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getFIPProcessDistinctLeads(filter).subscribe(
      (response) => {
        this.fipleads = response;
        // console.log('fip distinct leads', this.fipleads);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getMonthName(offset: number): string {
    return this.moment().subtract(offset, 'months').format('MMMYYYY');
  }
  updateEvents(): void {
    this.events = [
      {
        status: this.lastBeforeMonthLeadCount,
        description: this.twoMonthsAgo,
      },
      {
        status: this.lastMonthLeadCount,
        description: this.previousMonth,
      },
      {
        status: this.thisMonthLeadCount,
        description: this.currentMonth,
      },
    ];
  }

  updateCallbackEvents(): void {
    this.callbackevents = [
      {
        status: this.lastBeforeMonthCallbackCount,
        description: this.twoMonthsAgo,
      },
      {
        status: this.lastMonthCallbackCount,
        description: this.previousMonth,
      },
      {
        status: this.thisMonthCallbackCount,
        description: this.currentMonth,
      },
    ];
  }
  onActiveItemChange(event) {
    // console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'teamActiveItem',
      event.name
    );
  }

  setFilterConfig() {
    const commonFilters = [
      {
        header: 'Lead Id',
        data: [
          { field: 'id', title: 'Lead Id', type: 'text', filterType: 'like' },
        ],
      },
      {
        header: 'Business Name',
        data: [
          {
            field: 'businessName',
            title: 'Business Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Date Range',
        data: [
          {
            field: 'createdOn',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'createdOn', title: 'To', type: 'date', filterType: 'lte' },
        ],
      },
      {
        header: 'Phone Number',
        data: [
          {
            field: 'primaryPhone',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Business Entity',
        data: [
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'like',
            options: this.entityDetails.map((entity) => ({
              label: entity.displayName,
              value: entity.name,
            })),
          },
        ],
      },
      {
        header: 'Contact Person',
        data: [
          {
            field: 'contactPerson',
            title: 'Contact Person Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'City',
        data: [
          {
            field: 'city',
            title: 'City Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Business Turnover',
        data: [
          {
            field: 'businessTurnover',
            placeholder: 'Select Turnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'like',
            options: this.turnoverDetails.map((turnover) => ({
              label: turnover.displayName,
              value: turnover.name,
            })),
          },
        ],
      },
      {
        header: 'Nature Of Business',
        data: [
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'like',
            options: this.natureofBusinessDetails.map((natureofB) => ({
              label: natureofB.displayName,
              value: natureofB.name,
            })),
          },
        ],
      },
      {
        header: 'created On',
        data: [
          {
            field: 'createdOn',
            title: 'Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Had Own House',
        data: [
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'like',
            options: this.hadOwnHouse.map((ownHouse) => ({
              label: ownHouse.displayName,
              value: ownHouse.name,
            })),
          },
        ],
      },
    ];

    const specificFiltersSanctions = [
      {
        header: 'Sanction Date Range',
        data: [
          {
            field: 'approvalDate',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'approvalDate',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
    ];

    const specificFiltersDisbursals = [
      {
        header: 'Disbursed Date Range',
        data: [
          {
            field: 'disbursalDate',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'disbursalDate',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
    ];
    this.filterConfig = [...commonFilters];
    this.filterConfigSanctions = [
      ...commonFilters,
      ...specificFiltersSanctions,
    ];
    this.filterConfigDisbursals = [
      ...commonFilters,
      ...specificFiltersDisbursals,
    ];
  }

  getUsersDetailsById(id: string) {
    this.loading = true;
    this.leadsService.getUsersDetailsById(id).subscribe(
      (response) => {
        this.userDetails = response;
        // console.log('userDetails', this.userDetails);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }
  getUserRoleName(userId) {
    if (this.userRoles && this.userRoles.length > 0) {
      let leadUserName = this.userRoles.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }
  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers: any) => {
        this.leadUsers = [{ name: 'All' }, ...leadUsers];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getUserRoles(filter = {}) {
    this.leadsService.getUserRoles(filter).subscribe(
      (roles) => {
        this.userRoles = roles;
        // console.log(this.userRoles);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  actionItems(lead: any): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => this.viewLead(lead.id),
          },
        ],
      },
    ];
    return menuItems;
  }
  actionItemsCNI(lead: any): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'View',
          //   icon: 'pi pi-eye',
          //   command: () => this.viewLead(lead.id),
          // },
          {
            label: 'Rejects Details',
            icon: 'pi pi-info-circle',
            command: () => this.cniDetails(lead.id),
          },
        ],
      },
    ];
    return menuItems;
  }
  actionItemsforBank(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'View',
          //   icon: 'pi pi-eye',
          //   command: () => this.viewLead(lead.id),
          // },
          {
            label: 'Rejects Details',
            icon: 'pi pi-info-circle',
            command: () => this.rejectsDetails(lead.id),
          },
        ],
      },
    ];
    return menuItems;
  }

  rejectsDetails(leadId) {
    this.routingService.handleRoute('rejects/rejectsDetails/' + leadId, null);
  }
  cniDetails(leadId) {
    this.routingService.handleRoute('rejects/cniDetails/' + leadId, null);
  }
  disbursalDetails(leadId) {
    this.routingService.handleRoute(
      'disbursals/disbursalDetails/' + leadId,
      null
    );
  }
  viewLead(event: any) {
    // console.log('Row clicked:', event.data);
    const lead = event.data;
    this.routingService.handleRoute('leads/profile/' + lead.id, null);
  }
  loadDisbursalLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['sourcedBy-eq'] = this.userId;
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (api_filter) {
      this.getDisbursalLeadCount(api_filter);
      this.getDisbursalLeads(api_filter);
    }
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.disbursalleadsTable.reset();
    }
  }

  inputValueChangeEventfollow(dataType, value) {
    if (value == '') {
      this.searchFilterfollowups = {};
      this.followupsTable.reset();
    }
  }

  inputValueChangeEventcni(dataType, value) {
    if (value == '') {
      this.searchFiltercni = {};
      this.leadsTablecni.reset();
    }
  }
  inputValueChangeEventforbank(dataType, value) {
    if (value == '') {
      this.searchFilterbank = {};
      this.leadsTablebank.reset();
    }
  }
  inputValueChangeEventInHouseReject(dataType, value) {
    if (value == '') {
      this.searchFilterInHouseRejects = {};
      this.inHouseRejectsleadsTable.reset();
    }
  }

  inputValueChangeEventsanctions(dataType, value) {
    if (value == '') {
      this.searchFilterSanctions = {};
      this.sanctionsTable.reset();
    }
  }

  inputValueChangeEventfip(dataType, value) {
    if (value == '') {
      this.searchFilterfip = {};
      this.fipleadsTable.reset();
    }
  }
  filterData(filterType: string, fieldName: string, searchValue: string) {
    let searchFilter = { [`${fieldName}-like`]: searchValue };
    switch (filterType) {
      case 'disbursal':
        this.applyFilters(searchFilter);
        break;
      case 'sanctions':
        this.applyFilterssanctions(searchFilter);
        break;
      case 'inHouseReject':
        this.applyFiltersInHouseRejects(searchFilter);
        break;
      case 'bankRejects':
        this.applyFiltersBankRejects(searchFilter);
        break;
      case 'followups':
        this.applyFiltersFollowUps(searchFilter);
        break;
      case 'cni':
        this.applyFiltersCni(searchFilter);
        break;
      case 'fip':
        this.applyFiltersfip(searchFilter);
        break;
    }
  }
  filterWithBusinessName() {
    this.filterData('disbursal', 'businessName', this.businessNameToSearch);
  }
  filterWithBusinessNamefollow() {
    this.filterData(
      'followups',
      'businessName',
      this.businessNameToSearchfollowups
    );
  }

  filterWithBusinessNameforCNI() {
    this.filterData('cni', 'businessName', this.businessNameToSearchcni);
  }
  filterWithMobileNumbercni() {
    this.filterData('cni', 'primaryPhone', this.mobileNumberToSearchcni);
  }
  filterWithMobileNumberFollow() {
    this.filterData(
      'followups',
      'primaryPhone',
      this.mobileNumberToSearchfollow
    );
  }

  filterWithBusinessNameforBank() {
    this.filterData(
      'bankRejects',
      'businessName',
      this.businessNameToSearchforbank
    );
  }

  filterWithMobileNumberforbank() {
    this.filterData(
      'bankRejects',
      'primaryPhone',
      this.mobileNumberToSearchforbank
    );
  }

  filterWithBusinessNameSanctions() {
    this.filterData(
      'sanctions',
      'businessName',
      this.businessNameToSearchSanctions
    );
  }

  filterWithBusinessNameInHouseReject() {
    this.filterData(
      'inHouseReject',
      'businessName',
      this.businessNameToSearchInHouseReject
    );
  }

  filterWithBusinessNamefip() {
    this.filterData('fip', 'businessName', this.businessNameToSearchfip);
  }

  filterWithMobileNumber() {
    this.filterData('disbursal', 'primaryPhone', this.mobileNumberToSearch);
  }

  filterWithMobileNumberfip() {
    this.filterData('fip', 'primaryPhone', this.mobileNumberToSearchfip);
  }

  filterWithMobileNumbersanctions() {
    this.filterData(
      'sanctions',
      'primaryPhone',
      this.mobileNumberToSearchSanctions
    );
  }

  filterWithMobileNumberInHouseReject() {
    this.filterData(
      'inHouseReject',
      'primaryPhone',
      this.mobileNumberToSearchInHouseRejects
    );
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadDisbursalLeads(this.currentTableEvent);
  }

  applyFilterssanctions(searchFilterSanctions = {}) {
    this.searchFilterSanctions = searchFilterSanctions;
    this.loadApprovalLeads(this.currentTableEvent);
  }

  applyFiltersInHouseRejects(searchFilterInHouseRejects = {}) {
    this.searchFilterInHouseRejects = searchFilterInHouseRejects;
    this.loadInhouseRejectLeads(this.currentTableEvent);
  }

  applyFiltersBankRejects(searchFilterbank = {}) {
    this.searchFilterbank = searchFilterbank;
    this.loadBankRejectedLeads(this.currentTableEvent);
  }

  applyFiltersFollowUps(searchFilterfollowups = {}) {
    this.searchFilterfollowups = searchFilterfollowups;
    this.loadFollowupLeads(this.currentTableEvent);
  }
  applyFiltersCni(searchFiltercni = {}) {
    this.searchFiltercni = searchFiltercni;
    this.loadCNIRejectedLeads(this.currentTableEvent);
  }

  applyFiltersfip(searchFilterfip = {}) {
    this.searchFilterfip = searchFilterfip;
    this.loadFIpLeads(this.currentTableEvent);
  }
  applyConfigFilter(filterType: string, event: any) {
    let api_filter = event;

    if (api_filter['reset']) {
      delete api_filter['reset'];
      this[`appliedFilter${filterType}`] = {};
    } else {
      this[`appliedFilter${filterType}`] = api_filter;
    }
    switch (filterType) {
      case '':
        this.loadDisbursalLeads(null);
        break;
      case 'Sanctions':
        this.loadApprovalLeads(null);
        break;
      case 'fip':
        this.loadFIpLeads(null);
        break;
      case 'followups':
        this.loadFollowupLeads(null);
        break;
      case 'bankRejects':
        this.loadBankRejectedLeads(null);
        break;
      case 'Cni':
        this.loadCNIRejectedLeads(null);
        break;
      case 'InHouseRejects':
        this.loadInhouseRejectLeads(null);
        break;
    }
  }

  applyConfigFilters(event: any) {
    this.applyConfigFilter('', event);
  }
  applyConfigFiltersFollow(event: any) {
    this.applyConfigFilter('followups', event);
  }

  applyConfigFiltersSanctions(event: any) {
    this.applyConfigFilter('Sanctions', event);
  }

  applyConfigFiltersfip(event: any) {
    this.applyConfigFilter('fip', event);
  }

  applyConfigFiltersInHouseRejects(event: any) {
    this.applyConfigFilter('InHouseRejects', event);
  }

  applyConfigFiltersforbank(event: any) {
    this.applyConfigFilter('bankRejects', event);
  }

  applyConfigFiltersforcni(event: any) {
    this.applyConfigFilter('Cni', event);
  }

  getDisbursalLeadCount(filter = {}) {
    this.leadsService.getDisbursalLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalDisbursalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getDisbursalLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getDisbursalLeads(filter).subscribe(
      (response) => {
        this.disbursalleads = response;
        // console.log(this.disbursalleads);
        // this.totalSanctionedAmount = this.disbursalleads.reduce((sum, lead) => {
        //   return sum + (lead.sanctionedAmount || 0);
        // }, 0);
        // this.totalDisbursedAmount = this.disbursalleads.reduce((sum, lead) => {
        //   return sum + (lead.disbursedAmount || 0);
        // }, 0);
        // console.log('Total Sanctioned Amount:', this.totalSanctionedAmount);
        // console.log('Total Disbursed Amount:', this.totalDisbursedAmount);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getDisbursalLeadsforcount(filter = {}) {
    this.loading = true;
    filter['sourcedBy-eq'] = this.userId;
    this.leadsService.getDisbursalLeads(filter).subscribe(
      (response) => {
        this.disbursalleads = response;
        // console.log(this.disbursalleads);
        this.totalSanctionedAmount = this.disbursalleads.reduce((sum, lead) => {
          return sum + (lead.sanctionedAmount || 0);
        }, 0);
        this.totalDisbursedAmount = this.disbursalleads.reduce((sum, lead) => {
          return sum + (lead.disbursedAmount || 0);
        }, 0);
        this.totalSanctionedAmountInLakhsOrCrores = this.convertToLakhsOrCrores(
          this.totalSanctionedAmount
        );
        this.totalDisbursedAmountInLakhsOrCrores = this.convertToLakhsOrCrores(
          this.totalDisbursedAmount
        );
        // console.log('Total Sanctioned Amount:', this.totalSanctionedAmount);
        // console.log('Total Disbursed Amount:', this.totalDisbursedAmount);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
