import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrl: './logins.component.scss',
})
export class LoginsComponent {
  leads: any = [];
  appliedFilter: {};
  appliedFilterfip: {};
  activeItem: any = null;
  loading: any;
  items: any;
  personNameToSearchForHome: any;
  totalLeadsCount: any = 0;
  totalLeadsCountfip: any = 0;
  leadIdToSearch: any;
  breadCrumbItems: any = [];
  businessNameToSearch: any;
  businessNameToSearchforfip: any;
  mobileNumberToSearch: any;
  mobileNumberToSearchfip: any;
  filterConfig: any[] = [];
  currentTableEvent: any;
  searchFilter: any = {};
  searchFilterfip: any = {};
  searchInputValue: string = '';
  @ViewChild('leadsTable') leadsTable!: Table;
  // @ViewChild('leadsTableforfip') leadsTableforfip!: Table;
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  leadSources: any = [];
  leadUsers: any = [];
  userDetails: any;
  businessNameToSearchForHome: any;
  apiLoading: any;
  selectedSourcedByStatus: any;
  selectedSourcedByfipStatus: any;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  loginStatus: any = projectConstantsLocal.LOGIN_STATUS;
  selectedLoginStatus = this.loginStatus[1];
  selectedplLoginStatus = this.loginStatus[1];
  selectedhlLoginStatus = this.loginStatus[1];
  selectedlapLoginStatus = this.loginStatus[1];
  selectedhlselfLoginStatus = this.loginStatus[1];
  selectedlapselfLoginStatus = this.loginStatus[1];
  totalLeadsCountArray: any;
  totalActiveLeadsCount: any;
  totalStatusLeadsCountArray: any;
  employmentStatus: any;
  activeEmploymentStatus: any;
  personalloanLeadsCount: any = 0;
  SourcedByForLap: any;
  loanleadsLoading: any;
  HomeSelffilterConfig: any[] = [];
  appliedFilterLap: {};
  searchFilterForLap: any = {};
  searchFilterForLapSelf: any = {};
  appliedFilterLapself: {};
  lapLeadsCount: any = 0;
  HomefilterConfig: any[] = [];
  SourcedByForHome: any;
  lapselfLeadsCount: any = 0;
  searchFilterForHomeSelf: any = {};
  searchFilterForHome: any = {};
  appliedFilterHomeself: {};
  appliedFilterHome: {};
  SourcedByForPersonal: any;
  searchFilterPersonal: any = {};
  appliedFilterPersonal: {};
  homeloanselfLeadsCount: any = 0;
  homeloanLeadsCount: any = 0;
  loanLeads: any = [];
  personalfilterConfig: any[] = [];
  businessNameToSearchForPersonal: any;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Logins' },
    ];
    this.getLeadUsers();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedSourcedByStatus = {
        id: params['id'],
        name: params['name'],
      };
    });
    // this.items = [
    //   { label: 'Ready To Login', name: 'readyToLogin' },
    //   { label: 'All Processed Files', name: 'filesInProcess' },
    // ];
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;

    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    // this.loadActiveItem();
    this.setFilterConfig();

    const storedAppliedFilterlogins = this.localStorageService.getItemFromLocalStorage(
      'loginsAppliedFilter'
    );
    if (storedAppliedFilterlogins) {
      this.appliedFilter = storedAppliedFilterlogins;
    }
    const storedAppliedFilter = this.localStorageService.getItemFromLocalStorage(
      'allprocessedAppliedFilter'
    );
    if (storedAppliedFilter) {
      this.appliedFilterfip = storedAppliedFilter;
    }
    const storedStatus = this.localStorageService.getItemFromLocalStorage('selectedLogins');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
    }
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage('selectedallProcessedFiles');
    if (storedStatus1) {
      this.selectedSourcedByfipStatus = storedStatus1;
    }
    // const storedStatus2 = this.localStorageService.getItemFromLocalStorage(
    //   'selectedLoginStatus'
    // );
    // if (storedStatus2) {
    //   this.selectedLoginStatus = storedStatus2;
    // }
  }

  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('loginsActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name == storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  onActiveEmploymentStatusChange(event: any) {
    this.activeEmploymentStatus = event;
    const { name } = this.activeEmploymentStatus;
    const { name: itemName } = this.activeItem;
    // console.log(name);
    // console.log(itemName);
    const loadLeadsFn =
      name === 'employed'
        ? itemName === 'homeLoan'
          ? this.loadLeadsforHome
          : this.loadLeadsforlap
        : itemName === 'homeLoan'
          ? this.loadLeadsforHomeself
          : this.loadLeadsforlapself;
    // console.log('loadLeadsFn', loadLeadsFn);
    loadLeadsFn.call(this, event);
    this.localStorageService.setItemOnLocalStorage(
      'loginsEmploymentStatusActiveItem',
      event.name
    );
  }
  handleInputChange(value: string): void {
    this.searchInputValue = value;
    if (this.activeEmploymentStatus.name === 'employed') {
      this.personNameToSearchForHome = value;
      // console.log(this.activeItem);
      // console.log(this.activeEmploymentStatus);
      if (this.activeItem.name === 'homeLoan') {
        this.inputValueChangeEventForHome(
          'loanId',
          this.personNameToSearchForHome
        );
      } else if (this.activeItem.name === 'lap') {
        this.inputValueChangeEventForLAP(
          'loanId',
          this.personNameToSearchForHome
        );
      }
    } else {
      this.businessNameToSearchForHome = value;
      if (this.activeItem.name === 'homeLoan') {
        this.inputValueChangeEventForHomeSelf(
          'loanId',
          this.businessNameToSearchForHome
        );
      } else if (this.activeItem.name === 'lap') {
        this.inputValueChangeEventForLAPSelf(
          'loanId',
          this.businessNameToSearchForHome
        );
      }
    }
  }
  inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapleadsTable.reset();
    }
  }
  inputValueChangeEventForLAP(dataType, value) {
    if (value == '') {
      this.searchFilterForLap = {};
      this.LapleadsTable.reset();
    }
  }
  statusChangeForLap(event) {
    this.loadLoanLeads('lap');
  }
  statusChangeForLapSelf(event) {
    this.loadLoanLeads('lapself');
  }
  inputValueChangeEventForHome(dataType, value) {
    if (value == '') {
      this.searchFilterForHome = {};
      this.HomeleadsTable.reset();
    }
  }
  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomeleadsTable.reset();
    }
  }
  filterBasedOnEmploymentStatus(): void {
    if (this.activeEmploymentStatus.name === 'employed') {
      if (this.activeItem.name === 'homeLoan') {
        this.filterWithPersonNameForHome();
      } else if (this.activeItem.name === 'lap') {
        this.filterWithPersonNameForLAP();
      }
    } else {
      if (this.activeItem.name === 'homeLoan') {
        this.filterWithBusinessNameForHome();
      } else if (this.activeItem.name === 'lap') {
        this.filterWithBusinessNameForLAP();
      }
    }
  }
  filterWithBusinessNameForLAP() {
    let searchFilterForLapSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersLapSelf(searchFilterForLapSelf);
  }
  applyFiltersLapSelf(searchFilterForLapSelf = {}) {
    this.searchFilterForLapSelf = searchFilterForLapSelf;
    this.loadLoanLeads('lapself');
  }
  filterWithPersonNameForLAP() {
    let searchFilterForLap = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    // console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadLoanLeads('lap');
  }
  filterWithBusinessNameForHome() {
    let searchFilterForHomeSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersHomeSelf(searchFilterForHomeSelf);
  }
  filterWithPersonNameForHome() {
    let searchFilterForHome = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    this.applyFiltersHome(searchFilterForHome);
  }
  applyFiltersHomeSelf(searchFilterForHomeSelf = {}) {
    this.searchFilterForHomeSelf = searchFilterForHomeSelf;
    this.loadLoanLeads('homeself');
  }
  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadLoanLeads('home');
  }
  onActiveItemChange(event) {
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'loginsActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }
  statusChangeForHome(event) {
    this.loadLoanLeads('home');
  }
  statusChangeForHomeSelf(event) {
    this.loadLoanLeads('homeself');
  }
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
  private async loadAllLeadData(): Promise<void> {
    try {
      await Promise.all([
        this.getTotalLeadsCountArray(event),
        this.getbusinessloanleadsCount(event),
        this.getStatusLeadsCountArray(event)
      ]);
    } catch (error) { }
  }
  getFilteredItems(): { label: string; name: string }[] {
    return [
      {
        label: `Business Loan (${this.totalActiveLeadsCount || 0})`,
        name: 'businessLoan',
      },
      {
        label: `Personal Loan (${this.totalLeadsCountArray?.personalcount || 0
          })`,
        name: 'personalLoan',
      },
      {
        label: `Home Loan (${this.totalLeadsCountArray?.homeLoancount || 0})`,
        name: 'homeLoan',
      },
      {
        label: `LAP (${this.totalLeadsCountArray?.LAPLoancount || 0})`,
        name: 'lap',
      },
      {
        label: `Professional Loans (0)`,
        name: 'professionalLoans',
      },
      {
        label: `Educational Loans (0)`,
        name: 'educationlLoans',
      },
      {
        label: `Car loans (0)`,
        name: 'carLoan',
      },
      {
        label: `Commercial Vehicle Loans (0)`,
        name: 'commercialVehicleLoan',
      },
    ];
  }
  loadEmploymentActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage(
        'loginsEmploymentStatusActiveItem'
      );
    if (storedActiveItemName) {
      this.activeEmploymentStatus =
        this.employmentStatus.find(
          (item) => item.name == storedActiveItemName
        ) || this.employmentStatus[0];
    } else {
      this.activeEmploymentStatus = this.employmentStatus[0];
    }
  }
  getStatusItems(): { label: string; name: string }[] {
    if (!this.totalStatusLeadsCountArray) {
      return [];
    }
    // console.log(this.activeItem)
    // Check the active item and update the labels accordingly
    if (this.activeItem.name === 'homeLoan') {
      return [
        {
          label: `Employed (${this.totalStatusLeadsCountArray.homeLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusLeadsCountArray.homeLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    } else if (this.activeItem.name === 'lap') {
      return [
        {
          label: `Employed (${this.totalStatusLeadsCountArray.LAPLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusLeadsCountArray.LAPLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    }

    // Default case (if activeItem is neither homeLoan nor LAP)
    return [];
  }
  getbusinessloanleadsCount(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 11;
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalActiveLeadsCount = leadsCount;
        // console.log(this.totalActiveLeadsCount);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getStatusLeadsCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 11;
    this.leadsService.getStatusLeadsCountArray(filter).subscribe(
      (leadsCount) => {
        this.totalStatusLeadsCountArray = leadsCount;
        // console.log(this.totalStatusLeadsCountArray);
        this.employmentStatus = this.getStatusItems();
        // this.activeItem = this.items[0];
        this.loadEmploymentActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getTotalLeadsCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 11;
    this.leadsService.getTotalLeadsCountArray(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCountArray = leadsCount;
        // console.log(this.totalLeadsCountArray);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Lead Id',
        data: [
          {
            field: 'id',
            title: 'Lead Id',
            type: 'text',
            filterType: 'like',
          },
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
        header: 'created On  ',
        data: [
          {
            field: 'createdOn',
            title: 'Date ',
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
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }

  // filterWithMobileNumberfip() {
  //   let searchFilterfip = {
  //     'primaryPhone-like': this.mobileNumberToSearchfip,
  //   };
  //   this.applyFiltersforFip(searchFilterfip);
  // }

  // filterWithBusinessNamefip() {
  //   let searchFilterfip = {
  //     'businessName-like': this.businessNameToSearchforfip,
  //   };
  //   this.applyFiltersforFip(searchFilterfip);
  // }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  // applyFiltersforFip(searchFilterfip = {}) {
  //   this.searchFilterfip = searchFilterfip;
  //   this.loadDistinctLeads(this.currentTableEvent);
  // }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }

  // inputValueChangeEventforFip(dataType, value) {
  //   if (value == '') {
  //     this.searchFilterfip = {};
  //     this.leadsTableforfip.reset();
  //   }
  // }

  updateLead(leadId) {
    this.routingService.handleRoute('leads/update/' + leadId, null);
  }
  // loadDistinctLeads(event) {
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   if (
  //     this.selectedSourcedByfipStatus &&
  //     this.selectedSourcedByfipStatus.name
  //   ) {
  //     if (this.selectedSourcedByfipStatus.name == 'All') {
  //     } else {
  //       api_filter['sourcedBy-eq'] = this.selectedSourcedByfipStatus.id;
  //     }
  //   }
  //   api_filter = Object.assign(
  //     {},
  //     api_filter,
  //     this.searchFilterfip,
  //     this.appliedFilterfip
  //   );
  //   if (api_filter) {
  //     console.log(api_filter);
  //     this.getDistinctLeadCount(api_filter);
  //     this.getDistinctLeads(api_filter);
  //   }
  // }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedLoginStatus) {
      // console.log(this.selectedLoginStatus)
      if (this.selectedLoginStatus && this.selectedLoginStatus.name) {
        if (this.selectedLoginStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedLoginStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '11,12';
        }
      }
    }
    // api_filter['leadInternalStatus-eq'] = 11;
    // if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
    //   if (this.selectedSourcedByStatus.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '11';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.selectedSourcedByStatus.id;
    //   }
    // }
    if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
      // console.log(this.selectedSourcedByStatus)
      if (this.selectedSourcedByStatus.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatus.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (api_filter) {
      this.getTotalLeadsFilesCount(api_filter);
      this.getTotalLeads(api_filter);
    }
  }
  // applyConfigFilters(event) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this.appliedFilter = {};
  //   } else {
  //     this.appliedFilter = api_filter;
  //   }
  //   this.localStorageService.setItemOnLocalStorage(
  //     'loginsAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadLeads(null);
  // }

  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `loginsAppliedFilter${filterType}`;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this[`appliedFilter${filterType}`] = {};
    } else {
      this[`appliedFilter${filterType}`] = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      localStorageKey,
      this[`appliedFilter${filterType}`]
    );
    switch (filterType) {
      case 'Personal':
        this.loadLoanLeads('personal');
        break;
      case 'Home':
        this.loadLoanLeads('home');
        break;
      case 'Homeself':
        this.loadLoanLeads('homeself');
        break;
      case 'Lap':
        this.loadLoanLeads('lap');
        break;
      case 'Lapself':
        this.loadLoanLeads('lapself');
        break;
      default:
        this.loadLeads(null);
        break;
    }
  }
  // applyConfigFiltersForDistinct(event) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this.appliedFilterfip = {};
  //   } else {
  //     this.appliedFilterfip = api_filter;
  //   }
  //   this.localStorageService.setItemOnLocalStorage(
  //     'allprocessedAppliedFilter',
  //     this.appliedFilterfip
  //   );
  //   this.loadDistinctLeads(null);
  // }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedLogins',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }

  loginstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedLogins',
    //   event.value
    // );
    this.loadLeads(this.currentTableEvent);
  }
  plloginstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedLogins',
    //   event.value
    // );
    this.loadLoanLeads('personal');
  }
  hlloginstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedLogins',
    //   event.value
    // );
    this.loadLoanLeads('home');
  }
  laploginstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedLogins',
    //   event.value
    // );
    this.loadLoanLeads('lap');
  }
  hlselfloginstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedLogins',
    //   event.value
    // );
    this.loadLoanLeads('homeself');
  }
  lapselfloginstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedLogins',
    //   event.value
    // );
    this.loadLoanLeads('lapself');
  }


  // statusChangeDistinct(event) {
  //   this.localStorageService.setItemOnLocalStorage(
  //     'selectedallProcessedFiles',
  //     event.value
  //   );
  //   this.loadDistinctLeads(this.currentTableEvent);
  // }

  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
        // console.log(this.totalLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getDistinctLeadCount(filter = {}) {
    this.leadsService.getDistinctLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCountfip = leadsCount;
        // console.log(this.totalLeadsCountfip);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    // console.log(filter)
    this.leadsService.getLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        // console.log("leads", this.leads)
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  // getDistinctLeads(filter = {}) {
  //   this.apiLoading = true;
  //   this.leadsService.getDistinctLeads(filter).subscribe(
  //     (leads) => {
  //       this.leads = leads;
  //       this.apiLoading = false;
  //     },
  //     (error: any) => {
  //       this.apiLoading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

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
  getSourceName(userId) {
    if (this.leadUsers && this.leadUsers.length > 0) {
      let leadUserName = this.leadUsers.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }

  getStatusName(statusId) {
    if (this.leadInternalStatusList && this.leadInternalStatusList.length > 0) {
      let leadStatusName = this.leadInternalStatusList.filter(
        (leadStatus) => leadStatus.id == statusId
      );
      return (
        (leadStatusName &&
          leadStatusName[0] &&
          leadStatusName[0].displayName) ||
        ''
      );
    }
    return '';
  }

  // viewLead(event) {
  //   const lead = event.data
  //   this.routingService.handleRoute('leads/profile/' + lead.id, null);
  // }

  viewLead(event: any) {
    console.log('Row clicked:', event.data);
    const lead = event.data
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`leads/profile/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`leads/profile/${lead.id}`, null);
    }
  }
  // bankSelection(leadId) {
  //   this.routingService.handleRoute('logins/bankSelection/' + leadId, null);
  // }

  bankSelection(lead) {
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`logins/bankSelection/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`logins/bankSelection/${lead.id}`, null);
    }
  }
  // savedBanks(leadId) {
  //   this.routingService.handleRoute('logins/banksSaved/' + leadId, null);
  // }

  savedBanks(lead) {
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`logins/banksSaved/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`logins/banksSaved/${lead.id}`, null);
    }
  }
  actionItems(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'View Files',
          //   icon: 'pi pi-file',
          //   command: () => this.viewLeadFiles(lead.id),
          // },
          {
            label: 'Send to Credit Evaluation',
            icon: 'pi pi-sign-in',
            command: () => this.revertToCredit(lead),
          },
        ],
      },
    ];

    return menuItems;
  }

  actionItemsfip(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [


          ...(this.userDetails?.userType && this.userDetails.userType == '1'
            ? [
              {
                label: 'Upload Files',
                icon: 'pi pi-upload',
                command: () => this.uploadLeadFiles(lead.id),
              },
            ]
            : []),
          {
            label: 'Credit Evaluation',
            icon: 'pi pi-credit-card',
            command: () => this.evaluateCredit(lead.id),
          },
          {
            label: 'Saved Banks',
            icon: 'pi pi-sign-in',
            command: () => this.savedBanks(lead),
          },
        ],
      },
    ];
    return menuItems;
  }


  actionItemsplfip(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [


          ...(this.userDetails?.userType && this.userDetails.userType == '1'
            ? [
              {
                label: 'Upload Files',
                icon: 'pi pi-upload',
                command: () => this.uploadLoanLeadFiles(lead.leadId),
              },
            ]
            : []),
          {
            label: 'Credit Evaluation',
            icon: 'pi pi-credit-card',
            command: () => this.evaluateLoanCredit(lead.leadId),
          },
          {
            label: 'Saved Banks',
            icon: 'pi pi-sign-in',
            command: () => this.savedBanks(lead),
          },
        ],
      },
    ];
    return menuItems;
  }
  evaluateLoanCredit(leadId) {
    this.routingService.handleRoute('credit/loan-evaluate/' + leadId, null);
  }
  uploadLoanLeadFiles(leadId) {
    this.routingService.handleRoute('files/uploadloanleads/' + leadId, null);
  }
  getMenuItems(lead: any) {
    if (lead.leadInternalStatus == 11) return this.actionItems(lead);
    if (lead.leadInternalStatus == 12) return this.actionItemsfip(lead);
    return [];
  }

  getplMenuItems(lead: any) {
    if (lead.leadInternalStatus == 11) return this.actionItemsForLead(lead, 'personal');
    if (lead.leadInternalStatus == 12) return this.actionItemsplfip(lead);
    return [];
  }

  evaluateCredit(leadId) {
    this.routingService.handleRoute('credit/evaluate/' + leadId, null);
  }
  viewLeadFiles(leadId) {
    this.routingService.handleRoute('files/view/' + leadId, null);
  }
  uploadLeadFiles(leadId) {
    this.routingService.handleRoute('files/upload/' + leadId, null);
  }
  revertToCredit(lead) {
    this.changeLeadStatus(lead.id, 5);
  }
  // revertToCreditfip(lead) {
  //   this.changeLeadStatusfip(lead.id, 5);
  // }

  // changeLeadStatusfip(leadId, statusId) {
  //   this.loading = true;
  //   this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
  //     (leads) => {
  //       this.toastService.showSuccess('Lead Status Changed Successfully');
  //       this.loading = false;
  //       this.loadDistinctLeads(this.currentTableEvent);
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  changeLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }


  loadLoanLeads(leadType: string) {
    switch (leadType) {
      case 'personal':
        this.loadLeadsforPersonal(this.currentTableEvent);
        break;
      case 'home':
        this.loadLeadsforHome(this.currentTableEvent);
        break;
      case 'homeself':
        this.loadLeadsforHomeself(this.currentTableEvent);
        break;
      case 'lap':
        this.loadLeadsforlap(this.currentTableEvent);
        break;
      case 'lapself':
        this.loadLeadsforlapself(this.currentTableEvent);
        break;
      default:
        console.error('Unknown lead type');
    }
  }
  loadLeadsforlap(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    // api_filter['leadInternalStatus-or'] = '11,12';
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-or'] = '11,12';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
    if (this.selectedlapLoginStatus) {
      // console.log(this.selectedlapLoginStatus)
      if (this.selectedlapLoginStatus && this.selectedlapLoginStatus.name) {
        if (this.selectedlapLoginStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedlapLoginStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '11,12';
        }
      }
    }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    // console.log(api_filter);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLap,
      this.appliedFilterLap
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      this.getLapLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getLapLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.lapLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforlapself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    // api_filter['leadInternalStatus-or'] = '11,12';
    if (this.selectedlapLoginStatus) {
      // console.log(this.selectedlapLoginStatus)
      if (this.selectedlapLoginStatus && this.selectedlapLoginStatus.name) {
        if (this.selectedlapLoginStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedlapLoginStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '11,12';
        }
      }
    }
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-or'] = '11,12';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLapSelf,
      this.appliedFilterLapself
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      this.getLapselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforHomeself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    // api_filter['leadInternalStatus-or'] = '11,12';
    if (this.selectedhlLoginStatus) {
      // console.log(this.selectedhlLoginStatus)
      if (this.selectedhlLoginStatus && this.selectedhlLoginStatus.name) {
        if (this.selectedhlLoginStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedhlLoginStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '11,12';
        }
      }
    }
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-or'] = '11,12';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
    //   }
    // }
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHomeSelf,
      this.appliedFilterHomeself
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      // console.log(api_filter);
      this.getHomeloanselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getLapselfLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.lapselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getHomeloanselfLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.homeloanselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforHome(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    // api_filter['leadInternalStatus-or'] = '11,12';
    if (this.selectedhlLoginStatus) {
      console.log(this.selectedhlLoginStatus)
      if (this.selectedhlLoginStatus && this.selectedhlLoginStatus.name) {
        if (this.selectedhlLoginStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedhlLoginStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '11,12';
        }
      }
    }
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    }

    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHome,
      this.appliedFilterHome
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    console.log(api_filter);
    if (api_filter) {
      this.getHomeloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforPersonal(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    // if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
    //   if (this.SourcedByForPersonal.name == 'All') {
    //     api_filter['leadInternalStatus-or'] = '11,12';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
    //   }
    // }
    if (this.selectedplLoginStatus) {
      // console.log(this.selectedplLoginStatus)
      if (this.selectedplLoginStatus && this.selectedplLoginStatus.name) {
        if (this.selectedplLoginStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedplLoginStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '11,12';
        }
      }
    }
    if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
      if (this.SourcedByForPersonal.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterPersonal,
      this.appliedFilterPersonal
    );
    // if (
    //   this.userDetails &&
    //   this.userDetails.id &&
    //   this.userDetails.userType &&
    //   this.userDetails.userType == '3'
    // ) {
    //   api_filter['sourcedBy-eq'] = this.userDetails.id;
    // }

    // console.log(api_filter);
    if (api_filter) {
      this.getpersonalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getHomeloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.homeloanLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getpersonalloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.personalloanLeadsCount = response;
        // console.log(this.personalloanLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getloanLeads(filter = {}) {
    this.loanleadsLoading = true;
    this.leadsService.getloanLeads(filter).subscribe(
      (response) => {
        this.loanLeads = response;
        this.loanleadsLoading = false;
      },
      (error: any) => {
        this.loanleadsLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  viewLoanLead(event) {
    const lead = event.data
    this.routingService.handleRoute('files/loanleadview/' + lead.leadId, null);
  }
  filterWithBusinessNameForPersonal() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchForPersonal,
    };
    this.applyFiltersPersonal(searchFilterPersonal);
  }
  applyFiltersPersonal(searchFilterPersonal = {}) {
    this.searchFilterPersonal = searchFilterPersonal;
    this.loadLoanLeads('personal');
  }
  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.searchFilterPersonal = {};
      this.personalleadsTable.reset();
    }

  }
  statusChangeForPersonal(event) {
    this.loadLoanLeads('personal');
  }
  actionItemsForLead(lead: any, leadType: string): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          {
            label: 'Send to Credit Evaluation',
            icon: 'pi pi-sign-in',
            command: () => this.revertLoanLeadToCredit(lead, leadType),
          },
        ],
      },
    ];
    return menuItems;
  }
  revertLoanLeadToCredit(lead: any, leadType: string) {
    this.changeLoadLeadStatus(lead.leadId, 5, leadType);
  }
  changeLoadLeadStatus(leadId: number, statusId: number, leadType: string) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loadLoanLeads(leadType);
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
