import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from '../leads/leads.service';
import { MenuItem } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-rejects',
  templateUrl: './rejects.component.html',
  styleUrl: './rejects.component.scss',
})
export class RejectsComponent implements OnInit {
  leads: any = [];
  loading: any;
  totalLeadsCount: any = 0;
  leadIdToSearch: any;
  breadCrumbItems: any = [];
  businessNameToSearch: any;
  mobileNumberToSearchforbank: any;
  businessNameToSearchforbank: any;
  businessNameToSearchforplbank: any;
  mobileNumberToSearchcni: any;
  businessNameToSearchcni: any;
  businessNameToSearchplcni: any;
  currentTableEvent: any;
  selectedSourcedByStatus: any;
  selectedplSourcedByStatus: any;
  selectedSourcedByStatusforbank: any;
  selectedplSourcedByStatusforbank: any;
  selectedSourcedByStatusforcni: any;
  selectedSourcedByStatusforplcni: any;
  leadStatus: any = projectConstantsLocal.REJECTED_STATUS;
  appliedFilter: {};
  plappliedFilter: {};
  appliedFilterforbank: {};
  plappliedFilterforbank: {};
  appliedFilterforcni: {};
  plappliedFilterforcni: {};
  filterConfig: any[] = [];
  searchFilter: any = {};
  plsearchFilter: any = {};
  mobileNumberToSearch: any;
  businessNameToSearchForPersonal: any;
  searchFilterbank: any = {};
  plsearchFilterbank: any = {};
  searchFiltercni: any = {};
  plsearchFiltercni: any = {};
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  appliedFilterHome: {};
  appliedFilterHomeself: {};
  lapselfLeadsCount: any = 0;
  businessNameToSearchForHome: any;
  personNameToSearchForHome: any;
  totalActiveLeadsCount: any;
  totalLeadsCountArray: any;
  @ViewChild('leadsTable') leadsTable!: Table;
  @ViewChild('leadsTablebank') leadsTablebank!: Table;
  @ViewChild('plleadsTablebank') plleadsTablebank!: Table;
  @ViewChild('leadsTablecni') leadsTablecni!: Table;
  @ViewChild('plleadsTablecni') plleadsTablecni!: Table;
  leadSources: any = [];
  activeItem: any;
  items: any;
  leadUsers: any = [];
  apiLoading: any;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  userDetails: any;
  employmentStatus: any;
  loanLeads: any = [];
  appliedFilterLap: {};
  totalStatusLeadsCountArray: any;
  homeloanLeadsCount: any = 0;
  homeloanselfLeadsCount: any = 0;
  searchFilterForHomeSelf: any = {};
  searchFilterForHome: any = {};
  loanleadsLoading: any;
  searchInputValue: string = '';
  SourcedByForHome: any;
  activeEmploymentStatus: any;
  searchFilterForLap: any = {};
  searchFilterForLapSelf: any = {};
  appliedFilterLapself: {};
  SourcedByForLap: any;

  lapLeadsCount: any = 0;
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  rejectStatus: any = projectConstantsLocal.REJECTED_STATUS;
  selectedLoginStatus = this.rejectStatus[0];
  selectedhlLoginStatus = this.rejectStatus[0];
  selectedlapLoginStatus = this.rejectStatus[0];
  selectedplLoginStatus = this.rejectStatus[0];
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Rejects' },
    ];
    this.getLeadUsers();
  }

  ngOnInit() {
    // this.items = [
    //   { label: 'In House Rejects', name: 'inHouseRejects' },
    //   { label: 'Banker Rejects', name: 'bankerRejects' },
    //   { label: 'CNI', name: 'cni' },
    // ];
    // this.loadActiveItem();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage(
        'inhouseRejectsAppliedFilter'
      );
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedAppliedFiltercni =
      this.localStorageService.getItemFromLocalStorage('cniAppliedFilter');
    if (storedAppliedFiltercni) {
      this.appliedFilterforcni = storedAppliedFiltercni;
    }
    const storedAppliedFilterbank = this.localStorageService.getItemFromLocalStorage(
      'bankrejectsAppliedFilter'
    );
    if (storedAppliedFilterbank) {
      this.appliedFilterforbank = storedAppliedFilterbank;
    }
    const storedStatus = this.localStorageService.getItemFromLocalStorage('selectedInhouseRejects');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
    }
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage('selectedBankRejects');
    if (storedStatus1) {
      this.selectedSourcedByStatusforbank = storedStatus1;
    }
    const storedStatus2 = this.localStorageService.getItemFromLocalStorage('selectedCNI');
    if (storedStatus2) {
      this.selectedSourcedByStatusforcni = storedStatus2;
    }
  }
  getFilteredItems(): { label: string; name: string }[] {
    return [
      {
        label: `Business Loan (${this.totalActiveLeadsCount || 0})`,
        name: 'businessLoan',
      },
      {
        // label: `Personal Loan (${this.totalLeadsCountArray?.personalcount || 0
        //   })`,
        label: `Personal Loan (${this.totalLeadsCountArray || 0
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



  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('rejectsActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
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
  onActiveItemChange(event) {
    console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'rejectsActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
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
  getbusinessloanleadsCount(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    // filter['leadInternalStatus-eq'] = 11;
    this.leadsService.getFIPProcessDistinctLeadsCount(filter).subscribe(
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
  getTotalLeadsCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    // filter['leadInternalStatus-eq'] = 11;
    this.leadsService.getplFIPDistinctLeadsCount(filter).subscribe(
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
  loadEmploymentActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage(
        'creditEmploymentStatusActiveItem'
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
  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'inhouseRejectsAppliedFilter',
      this.appliedFilter
    );
    this.loadLeads(null);
  }

  applyConfigFilterspl(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `filesinprocessAppliedFilter${filterType}`;
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
  applyConfigFiltersforcni(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilterforcni = {};
    } else {
      this.appliedFilterforcni = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'cniAppliedFilter',
      this.appliedFilterforcni
    );
    this.loadCNIRejectedLeads(null);
  }
  applyConfigFiltersforbank(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilterforbank = {};
    } else {
      this.appliedFilterforbank = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'bankrejectsAppliedFilter',
      this.appliedFilterforbank
    );
    this.loadBankRejectedLeads(this.currentTableEvent);
  }
  loginstatusChange(event: any) {
    this.selectedLoginStatus = event.value; // store the whole object if needed
  }
  loginhlstatusChange(event: any) {
    this.selectedhlLoginStatus = event.value; // store the whole object if needed
  }
  loginlapstatusChange(event: any) {
    this.selectedlapLoginStatus = event.value; // store the whole object if needed
  }
  loginplstatusChange(event: any) {
    this.selectedplLoginStatus = event.value; // store the whole object if needed
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = '10';
    if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
      if (this.selectedSourcedByStatus.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatus.id;
      }
    }
    // console.log(api_filter);
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


  loadplLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '10';
    if (this.selectedplSourcedByStatus && this.selectedplSourcedByStatus.name) {
      if (this.selectedplSourcedByStatus.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedplSourcedByStatus.id;
      }
    }
    // console.log(api_filter);
    api_filter = Object.assign(
      {},
      api_filter,
      this.plsearchFilter,
      this.plappliedFilter
    );
    if (api_filter) {
      this.getplTotalLeadsCount(api_filter);
      this.getplTotalLeads(api_filter);
    }
  }

  getplTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getloanLeads(filter).subscribe(
      (response) => {
        this.leads = response;
        this.apiLoading = false;
        // console.log(this.leads)
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  getplTotalLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedSourcedByStatusforbank &&
      this.selectedSourcedByStatusforbank.name
    ) {
      if (this.selectedSourcedByStatusforbank.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforbank.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterforbank
    );
    if (api_filter) {
      this.getBankRejectedLeadCount(api_filter);
      this.getBankRejectsLeads(api_filter);
    }
  }


  loadhlBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    // if (
    //   this.selectedSourcedByStatusforbank &&
    //   this.selectedSourcedByStatusforbank.name
    // ) {
    //   if (this.selectedSourcedByStatusforbank.name != 'All') {
    //     api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforbank.id;
    //   }
    // }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterforbank
    );
    if (api_filter) {
      this.getplBankRejectedLeadCount(api_filter);
      this.getplBankRejectsLeads(api_filter);
    }
  }

  loadlapBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    // if (
    //   this.selectedSourcedByStatusforbank &&
    //   this.selectedSourcedByStatusforbank.name
    // ) {
    //   if (this.selectedSourcedByStatusforbank.name != 'All') {
    //     api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforbank.id;
    //   }
    // }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterforbank
    );
    if (api_filter) {
      this.getplBankRejectedLeadCount(api_filter);
      this.getplBankRejectsLeads(api_filter);
    }
  }


  loadhlCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterforcni
    );
    if (api_filter) {
      this.getplCNIRejectedLeadCount(api_filter);
      this.getplCNIRejectsLeads(api_filter);
    }
  }

  loadlapCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterforcni
    );
    if (api_filter) {
      this.getplCNIRejectedLeadCount(api_filter);
      this.getplCNIRejectsLeads(api_filter);
    }
  }
  loadhlselfCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterforcni
    );
    if (api_filter) {
      this.getplCNIRejectedLeadCount(api_filter);
      this.getplCNIRejectsLeads(api_filter);
    }
  }

  loadlapselfCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterforcni
    );
    if (api_filter) {
      this.getplCNIRejectedLeadCount(api_filter);
      this.getplCNIRejectsLeads(api_filter);
    }
  }
  loadhlselfBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    // if (
    //   this.selectedSourcedByStatusforbank &&
    //   this.selectedSourcedByStatusforbank.name
    // ) {
    //   if (this.selectedSourcedByStatusforbank.name != 'All') {
    //     api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforbank.id;
    //   }
    // }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterforbank
    );
    if (api_filter) {
      this.getplBankRejectedLeadCount(api_filter);
      this.getplBankRejectsLeads(api_filter);
    }
  }

  loadlapselfBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    // if (
    //   this.selectedSourcedByStatusforbank &&
    //   this.selectedSourcedByStatusforbank.name
    // ) {
    //   if (this.selectedSourcedByStatusforbank.name != 'All') {
    //     api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforbank.id;
    //   }
    // }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterforbank
    );
    if (api_filter) {
      this.getplBankRejectedLeadCount(api_filter);
      this.getplBankRejectsLeads(api_filter);
    }
  }
  loadplBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    if (
      this.selectedplSourcedByStatusforbank &&
      this.selectedplSourcedByStatusforbank.name
    ) {
      if (this.selectedplSourcedByStatusforbank.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedplSourcedByStatusforbank.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.plsearchFilterbank,
      this.plappliedFilterforbank
    );
    if (api_filter) {
      this.getplBankRejectedLeadCount(api_filter);
      this.getplBankRejectsLeads(api_filter);
    }
  }
  getplBankRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getplBankRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getplBankRejectedLeadCount(filter = {}) {
    this.leadsService.getplBankRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  loadCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedSourcedByStatusforcni &&
      this.selectedSourcedByStatusforcni.name
    ) {
      if (this.selectedSourcedByStatusforcni.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforcni.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterforcni
    );
    if (api_filter) {
      this.getCNIRejectedLeadCount(api_filter);
      this.getCNIRejectsLeads(api_filter);
    }
  }

  loadplCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    if (
      this.selectedSourcedByStatusforplcni &&
      this.selectedSourcedByStatusforplcni.name
    ) {
      if (this.selectedSourcedByStatusforplcni.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforplcni.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.plsearchFiltercni,
      this.plappliedFilterforcni
    );
    if (api_filter) {
      this.getplCNIRejectedLeadCount(api_filter);
      this.getplCNIRejectsLeads(api_filter);
    }
  }
  getplCNIRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getplCNIRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  getplCNIRejectedLeadCount(filter = {}) {
    this.leadsService.getplCNIRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedInhouseRejects',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }


  plstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedInhouseRejects',
    //   event.value
    // );
    this.loadplLeads(this.currentTableEvent);
  }
  filterWithBusinessNameForPersonal() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchForPersonal,
    };
    this.applyFiltersPersonal(searchFilterPersonal);
  }

  filterWithBusinessNameforplBank() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchforplbank,
    };
    this.applyFiltersplbank(searchFilterPersonal);
  }
  applyFiltersPersonal(searchFilterPersonal = {}) {
    this.plsearchFilter = searchFilterPersonal;
    this.loadplLeads(this.currentTableEvent);
  }
  statusChangeforcni(event) {
    this.localStorageService.setItemOnLocalStorage('selectedCNI', event.value);
    this.loadCNIRejectedLeads(this.currentTableEvent);
  }

  statusChangeforplcni(event) {
    this.localStorageService.setItemOnLocalStorage('selectedCNI', event.value);
    this.loadplCNIRejectedLeads(this.currentTableEvent);
  }
  statusChangeforbank(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedBankRejects',
      event.value
    );
    this.loadBankRejectedLeads(this.currentTableEvent);
  }

  plstatusChangeforbank(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedBankRejects',
      event.value
    );
    this.loadplBankRejectedLeads(this.currentTableEvent);
  }
  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getBankRejectedLeadCount(filter = {}) {
    this.leadsService.getBankRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getCNIRejectedLeadCount(filter = {}) {
    this.leadsService.getCNIRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getInhouseRejectedLeads(filter).subscribe(
      (response) => {
        this.leads = response;
        this.apiLoading = false;
        // console.log(this.leads)
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getBankRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getBankRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getCNIRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getCNIRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithMobileNumberforbank() {
    let searchFilterbank = {
      'primaryPhone-like': this.mobileNumberToSearchforbank,
    };
    this.applyFiltersbank(searchFilterbank);
  }
  filterWithMobileNumbercni() {
    let searchFiltercni = { 'primaryPhone-like': this.mobileNumberToSearchcni };
    this.applyFiltersforCni(searchFiltercni);
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }

  inputValueChangeEventcni(dataType, value) {
    if (value == '') {
      this.searchFiltercni = {};
      this.leadsTablecni.reset();
    }
  }
  inputValueChangeEventplcni(dataType, value) {
    if (value == '') {
      this.plsearchFiltercni = {};
      this.plleadsTablecni.reset();
    }
  }
  inputValueChangeEventforbank(dataType, value) {
    if (value == '') {
      this.searchFilterbank = {};
      this.leadsTablebank.reset();
    }
  }

  inputValueChangeEventforplbank(dataType, value) {
    if (value == '') {
      this.plsearchFilterbank = {};
      this.plleadsTablebank.reset();
    }
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithBusinessNameforCNI() {
    let searchFiltercni = { 'businessName-like': this.businessNameToSearchcni };
    this.applyFiltersforCni(searchFiltercni);
  }
  filterWithBusinessNameforplCNI() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchplcni,
    };
    this.applyFiltersforplCni(searchFilterPersonal);
  }

  applyFiltersforplCni(searchFiltercni = {}) {
    this.plsearchFiltercni = searchFiltercni;
    this.loadplCNIRejectedLeads(this.currentTableEvent);
  }
  filterWithBusinessNameforBank() {
    let searchFilterbank = {
      'businessName-like': this.businessNameToSearchforbank,
    };
    this.applyFiltersbank(searchFilterbank);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  applyFiltersforCni(searchFiltercni = {}) {
    this.searchFiltercni = searchFiltercni;
    this.loadCNIRejectedLeads(this.currentTableEvent);
  }

  applyFiltersbank(searchFilterbank = {}) {
    this.searchFilterbank = searchFilterbank;
    this.loadBankRejectedLeads(this.currentTableEvent);
  }

  applyFiltersplbank(searchFilterbank = {}) {
    this.plsearchFilterbank = searchFilterbank;
    this.loadplBankRejectedLeads(this.currentTableEvent);
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
    // console.log('Row clicked:', event.data);
    const lead = event.data
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`leads/profile/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`leads/profile/${lead.id}`, null);
    }
  }

  rejectsDetails(leadId) {
    this.routingService.handleRoute('rejects/rejectsDetails/' + leadId, null);
  }

  plrejectsDetails(lead) {
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`rejects/rejectsDetails/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`rejects/rejectsDetails/${lead.id}`, null);
    }
  }



  inhouserejectsDetails(leadId) {
    this.routingService.handleRoute('rejects/inHouseRejects/' + leadId, null);
  }

  cniDetails(leadId) {
    this.routingService.handleRoute('rejects/cniDetails/' + leadId, null);
  }
  plcniDetails(lead) {
    // console.log('plcniDetails', lead);
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`rejects/cniDetails/${loanType}/${lead.leadId}`, null);
    } else {
      this.routingService.handleRoute(`rejects/cniDetails/${lead.id}`, null);
    }
  }

  actionItems(lead: any): MenuItem[] {
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
            command: () => this.inhouserejectsDetails(lead.id),
          },
          {
            label: 'Send to files',
            icon: 'pi pi-sign-in',
            command: () => this.revertToFiles(lead),
          },
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

  plactionItems(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          {
            label: 'Send to Credit Evaluation',
            icon: 'pi pi-sign-in',
            command: () => this.revertToplCredit(lead),
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
  actionItemsforCni(lead: any): MenuItem[] {
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
            command: () => this.cniDetails(lead.id),
          },
        ],
      },
    ];

    return menuItems;
  }
  evaluateCredit(leadId) {
    this.routingService.handleRoute('credit/evaluate/' + leadId, null);
  }

  revertToFiles(lead) {
    this.changeLeadStatus(lead.id, 3);
  }

  revertToCredit(lead) {
    this.changeLeadStatus(lead.id, 5);
  }
  revertToplCredit(lead: any) {
    this.changeLoadLeadStatus(lead.leadId, 5);
  }
  changeLoadLeadStatus(leadId: number, statusId: number) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loadplLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

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
      'creditEmploymentStatusActiveItem',
      event.name
    );
  }
  goBack() {
    this.location.back();
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

  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.plsearchFilter = {};
      this.personalleadsTable.reset();
    }
  }
  loadLeadsforHome(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '10';
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
    //   }
    // }
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
    // console.log(api_filter);
    if (api_filter) {
      this.getHomeloanLeadsCount(api_filter);
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
  loadLeadsforHomeself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    api_filter['leadInternalStatus-eq'] = '10';
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
    //   }
    // }
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
  getloanLeads(filter = {}) {
    this.loanleadsLoading = true;
    this.leadsService.getloanLeads(filter).subscribe(
      (response) => {
        this.loanLeads = response;
        console.log("this.loanLeads", this.loanLeads)
        this.loanleadsLoading = false;
      },
      (error: any) => {
        this.loanleadsLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforlap(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '10';
    // api_filter['leadInternalStatus-eq'] = '3';
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
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
    api_filter['leadInternalStatus-eq'] = '10';
    // api_filter['leadInternalStatus-eq'] = '3';
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
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
  filterWithBusinessNameForHome() {
    let searchFilterForHomeSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersHomeSelf(searchFilterForHomeSelf);
  }
  applyFiltersHomeSelf(searchFilterForHomeSelf = {}) {
    this.searchFilterForHomeSelf = searchFilterForHomeSelf;
    this.loadLoanLeads('homeself');
  }
  filterWithPersonNameForLAP() {
    let searchFilterForLap = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    // console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  filterWithPersonNameForHome() {
    let searchFilterForHome = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    this.applyFiltersHome(searchFilterForHome);
  }
  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadLoanLeads('lap');
  }
  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadLoanLeads('home');
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
  inputValueChangeEventForLAP(dataType, value) {
    if (value == '') {
      this.searchFilterForLap = {};
      this.LapleadsTable.reset();
    }
  }
  inputValueChangeEventForHome(dataType, value) {
    if (value == '') {
      this.searchFilterForHome = {};
      this.HomeleadsTable.reset();
    }
  }
  inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapleadsTable.reset();
    }
  }
  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomeleadsTable.reset();
    }
  }
  loadLoanLeads(leadType: string) {
    switch (leadType) {
      case 'personal':
        // this.loadLeadsforPersonal(this.currentTableEvent);
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
  statusChangeForHome(event) {
    this.loadLoanLeads('home');
  }
  statusChangeForHomeSelf(event) {
    this.loadLoanLeads('homeself');
  }
  statusChangeForLap(event) {
    this.loadLoanLeads('lap');
  }
  statusChangeForLapSelf(event) {
    this.loadLoanLeads('lapself');
  }
}
