import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-disbursals',
  templateUrl: './disbursals.component.html',
  styleUrl: './disbursals.component.scss',
})
export class DisbursalsComponent implements OnInit {
  leads: any = [];
  breadCrumbItems: any = [];
  appliedFilter: {};
  loading: any;
  apiLoading: any;
  SanctionedAmountSum: { [key: number]: number } = {};
  DisbursedAmountSum: { [key: number]: number } = {};
  employmentStatus: any;
  totalLeadsCount: any = 0;
  leadIdToSearch: any;
  businessNameToSearch: any;
  mobileNumberToSearch: any;
  filterConfig: any[] = [];
  currentTableEvent: any;
  searchFilter: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  leadSources: any = [];
  leadUsers: any = [];
  userDetails: any;
  selectedSourcedByStatus: any;
  moment: any;
  startDate: string = '';
  endDate: string = '';
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;

  items: any;
  activeItem: any = null;
  totalActiveLeadsCount: any;
  activeEmploymentStatus: any;
  totalLeadsCountArray: any;
  loanleadsLoading: any;
  businessNameToSearchForPersonal: any;
  totalStatusLeadsCountArray: any;
  SourcedByForLap: any;
  loanLeads: any = [];
  SourcedByForPersonal: any;
  appliedFilterPersonal: {};
  searchFilterForLapSelf: any = {};
  personalfilterConfig: any[] = [];
  appliedFilterLapself: {};
  lapselfLeadsCount: any = 0;
  personalloanLeadsCount: any = 0;
  appliedFilterLap: {};
  lapLeadsCount: any = 0;
  SourcedByForHome: any;
  appliedFilterHomeself: {};
  homeloanselfLeadsCount: any = 0;
  searchFilterForHomeSelf: any = {};
  searchFilterForLap: any = {};
  searchFilterForHome: any = {};
  homeloanLeadsCount: any = 0;
  appliedFilterHome: {};
  searchFilterPersonal: any = {};
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  searchInputValue: string = '';
  HomefilterConfig: any[] = [];
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES
  HomeSelffilterConfig: any[] = [];
  personNameToSearchForHome: any;
  businessNameToSearchForHome: any;

  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();

    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Disbursals' },
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
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    this.route.queryParams.subscribe((params) => {
      const startDateParam = params['startDate'] || '';
      const endDateParam = params['endDate'] || '';
      if (startDateParam || endDateParam) {
        this.startDate = startDateParam
          ? this.moment(startDateParam).format('YYYY-MM-DD')
          : '';
        this.endDate = endDateParam
          ? this.moment(endDateParam).format('YYYY-MM-DD')
          : '';
        if (this.startDate && this.endDate) {
          this.searchFilter['disbursalDate-gte'] = this.startDate;
          this.searchFilter['disbursalDate-lte'] = this.endDate;
        }
        this.loadLeads(this.currentTableEvent || null);
      }
    });
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage(
        'disbursalAppliedFilter'
      );
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedStatus =
      this.localStorageService.getItemFromLocalStorage('selectedDisbursals');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
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
      'disbursalEmploymentStatusActiveItem',
      event.name
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
  onActiveItemChange(event) {
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'disbursalActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }

  loadEmploymentActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage(
        'disbursalEmploymentStatusActiveItem'
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
  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('disbursalActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name == storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
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
    this.leadsService.getDisbursalLeadCount(filter).subscribe(
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
    // filter['leadInternalStatus-eq'] = 11;
    this.leadsService.getplDisbursalLeadCount(filter).subscribe(
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
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
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
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
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
      this.getDisbursalLeadCount(api_filter);
      this.getDisbursalLeads(api_filter);
    }
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
  getDisbursalLeadCount(filter = {}) {
    this.leadsService.getDisbursalLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getDisbursalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getDisbursalLeads(filter).subscribe(
      (response) => {
        this.leads = response;
        // console.log(this.leads);
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
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
  actionItems(lead: any): MenuItem[] {
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
            label: 'Disbursed Details',
            icon: 'pi pi-info-circle',
            command: () => this.disbursalDetails(lead.id),
          },
          ...(this.userDetails && this.userDetails.userType === '1'
            ? [
              {
                label: 'Revenue',
                icon: 'pi pi-money-bill',
                command: () => this.revenueDetails(lead.id),
              },
            ]
            : []),
        ],
      },
    ];
    return menuItems;
  }

  revertToFilesInProcess(lead) {
    this.changeLeadStatus(lead.id, 5);
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

  // disbursalDetails(leadId) {
  //   this.routingService.handleRoute(
  //     'disbursals/disbursalDetails/' + leadId,
  //     null
  //   );
  // }
  disbursalDetails(lead) {

    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`disbursals/disbursalDetails/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`disbursals/disbursalDetails/${lead.id}`, null);
    }
  }

  // revenueDetails(leadId) {
  //   this.routingService.handleRoute('disbursals/revenue/' + leadId, null);
  // }

  revenueDetails(lead) {

    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`disbursals/revenue/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`disbursals/revenue/${lead.id}`, null);
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
  //     'disbursalAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadLeads(this.currentTableEvent);
  // }

  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `disbursalAppliedFilter${filterType}`;
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
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedDisbursals',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }
  goBack() {
    this.location.back();
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
  loadLeadsforlapself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
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
  getLapselfLeadsCount(filter = {}) {
    this.leadsService.getplDisbursalLeadCount(filter).subscribe(
      (response) => {
        this.lapselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getloanLeads(filter = {}) {
    this.loanleadsLoading = true;
    this.leadsService.getplDisbursalLeads(filter).subscribe(
      (response) => {
        this.loanLeads = response;
        // console.log(this.loanLeads)
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
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
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
    this.leadsService.getplDisbursalLeadCount(filter).subscribe(
      (response) => {
        this.lapLeadsCount = response;
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
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    } api_filter = Object.assign(
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
    this.leadsService.getplDisbursalLeadCount(filter).subscribe(
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
    // console.log(api_filter);
    if (api_filter) {
      this.getHomeloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getHomeloanLeadsCount(filter = {}) {
    this.leadsService.getplDisbursalLeadCount(filter).subscribe(
      (response) => {
        this.homeloanLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforPersonal(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
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
    if (api_filter) {
      this.getpersonalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  viewLoanLead(event) {
    const lead = event.data
    this.routingService.handleRoute('files/loanleadview/' + lead.leadId, null);
  }
  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.searchFilterPersonal = {};
      this.personalleadsTable.reset();
    }
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
  statusChangeForPersonal(event) {
    this.loadLoanLeads('personal');
  }
  getpersonalloanLeadsCount(filter = {}) {
    this.leadsService.getplDisbursalLeadCount(filter).subscribe(
      (response) => {
        this.personalloanLeadsCount = response;
        // console.log(this.personalloanLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
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
  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomeleadsTable.reset();
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
    this.applyFiltersLap(searchFilterForLap);
  }
  filterWithPersonNameForHome() {
    let searchFilterForHome = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    this.applyFiltersHome(searchFilterForHome);
  }
  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadLoanLeads('home');
  }
  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadLoanLeads('lap');
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
}
