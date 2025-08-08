import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss',
})
export class ApprovalsComponent implements OnInit {
  leads: any = [];
  breadCrumbItems: any = [];
  appliedFilter: {};
  loading: any;
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
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  startDate: string = '';
  endDate: string = '';
  moment: any;
  apiLoading: any;
  items: any;
  activeItem: any = null;
  employmentStatus: any;
  totalStatusLeadsCountArray: any;
  activeEmploymentStatus: any;
  totalActiveLeadsCount: any;
  totalLeadsCountArray: any;
  loanleadsLoading: any;
  loanLeads: any = [];
  SourcedByForPersonal: any;
  appliedFilterPersonal: {};
  appliedFilterLap: {};
  searchFilterPersonal: any = {};
  personalloanLeadsCount: any = 0;
  appliedFilterHome: {};
  searchFilterForHome: any = {};
  lapselfLeadsCount: any = 0;
  SourcedByForHome: any;
  searchFilterForLapSelf: any = {};
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  businessNameToSearchForPersonal: any;
  homeloanLeadsCount: any = 0;
  appliedFilterHomeself: {};
  homeloanselfLeadsCount: any = 0;
  SourcedByForLap: any;
  lapLeadsCount: any = 0;
  searchFilterForLap: any = {};
  appliedFilterLapself: {};
  personalfilterConfig: any[] = [];
  searchFilterForHomeSelf: any = {};
  searchInputValue: string = '';
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  businessNameToSearchForHome: any;
  personNameToSearchForHome: any;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES
  version = projectConstantsLocal.VERSION_DESKTOP;
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
      { label: 'Sanctions' },
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
      const startDateParam = params['startDate'];
      const endDateParam = params['endDate'];

      if (startDateParam || endDateParam) {
        this.startDate = startDateParam
          ? this.moment(startDateParam).format('YYYY-MM-DD')
          : '';
        this.endDate = endDateParam
          ? this.moment(endDateParam).format('YYYY-MM-DD')
          : '';
        if (this.startDate && this.endDate) {
          this.searchFilter['approvalDate-gte'] = this.startDate;
          this.searchFilter['approvalDate-lte'] = this.endDate;
        }
        this.loadLeads(this.currentTableEvent);
      }
    });
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage(
        'sanctionsAppliedFilter'
      );
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedStatus =
      this.localStorageService.getItemFromLocalStorage('selectedApprovals');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
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
        'filesEmploymentStatusActiveItem'
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
      this.localStorageService.getItemFromLocalStorage('approvalsActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name == storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
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
    this.leadsService.getApprovedLeadCount(filter).subscribe(
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
    this.leadsService.getplApprovedLeadCount(filter).subscribe(
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
  // viewLead(event) {
  //   const lead = event.data
  //   this.routingService.handleRoute('leads/profile/' + lead.id, null);
  // }
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
      this.getApprovedLeadCount(api_filter);
      this.getTotalLeads(api_filter);
    }
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
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
  getApprovedLeadCount(filter = {}) {
    this.leadsService.getApprovedLeadCount(filter).subscribe(
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
    this.leadsService.getApprovalsLeads(filter).subscribe(
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
  // actionItems(lead: any): MenuItem[] {
  //   const menuItems: any = [
  //     {
  //       label: 'Actions',
  //       items: [
  //         // {
  //         //   label: 'View',
  //         //   icon: 'pi pi-eye',
  //         //   command: () => this.viewLead(lead.id),
  //         // },
  //         {
  //           label: 'Sanction Details',
  //           icon: 'pi pi-info-circle',
  //           command: () => this.approvalDetails(lead.id),
  //         },
  //       ],
  //     },
  //   ];
  //   return menuItems;
  // }
  revertToFilesInProcess(lead) {
    this.changeLeadStatus(lead.id, 12);
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

  // approvalDetails(leadId) {
  //   this.routingService.handleRoute(
  //     'approvals/approvalDetails/' + leadId,
  //     null
  //   );
  // }
  approvalDetails(lead) {

    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`approvals/approvalDetails/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`approvals/approvalDetails/${lead.id}`, null);
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
      'creditEmploymentStatusActiveItem',
      event.name
    );
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
  //     'sanctionsAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadLeads(null);
  // }
  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `sanctionsAppliedFilter${filterType}`;
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
      'selectedApprovals',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }


  onActiveItemChange(event) {
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'approvalsActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }


  loadLeadsforPersonal(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    // if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
    //   if (this.SourcedByForPersonal.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '12';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
    //   }
    // }
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

    // console.log(api_filter);
    if (api_filter) {
      this.getpersonalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getloanLeads(filter = {}) {
    this.loanleadsLoading = true;
    this.leadsService.getplApprovalsLeads(filter).subscribe(
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
  getpersonalloanLeadsCount(filter = {}) {
    this.leadsService.getplApprovedLeadCount(filter).subscribe(
      (response) => {
        this.personalloanLeadsCount = response;
        // console.log(this.personalloanLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  // viewLoanLead(event) {
  //   const lead = event.data
  //   this.routingService.handleRoute('files/loanleadview/' + lead.leadId, null);
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
    this.leadsService.getplApprovedLeadCount(filter).subscribe(
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
  getHomeloanselfLeadsCount(filter = {}) {
    this.leadsService.getplApprovedLeadCount(filter).subscribe(
      (response) => {
        this.homeloanselfLeadsCount = response;
      },
      (error: any) => {
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
    this.leadsService.getplApprovedLeadCount(filter).subscribe(
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
    // api_filter['leadInternalStatus-eq'] = '3';
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
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
  getLapselfLeadsCount(filter = {}) {
    this.leadsService.getplApprovedLeadCount(filter).subscribe(
      (response) => {
        this.lapselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  statusChangeForPersonal(event) {
    this.loadLoanLeads('personal');
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
  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomeleadsTable.reset();
    }
  }
  inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapleadsTable.reset();
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
    // console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadLoanLeads('lap');
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
  goBack() {
    this.location.back();
  }
}
