import { Component, OnInit, ViewChild } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';
import { Table } from 'primeng/table';
import { Location } from '@angular/common';
import { RoutingService } from '../../services/routing-service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
})
export class FilesComponent implements OnInit {
  leads: any = [];
  loanLeads: any = [];
  loading: any;
  employmentStatus: any;
  activeEmploymentStatus: any;
  personalfilterConfig: any[] = [];
  personNameToSearchForHome: any;
  searchFilterForHomeSelf: any = {};
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  searchFilterForLapSelf: any = {};
  appliedFilterPersonal: {};
  searchFilterForHome: any = {};
  totalLeadsCount: any = 0;
  homeloanselfLeadsCount: any = 0;
  appliedFilterHome: {};
  appliedFilterHomeself: {};
  personalloanLeadsCount: any = 0;
  items: any;
  searchInputValue: string = '';
  lapselfLeadsCount: any = 0;
  leadIdToSearch: any;
  lapLeadsCount: any = 0;
  activeItem: any;
  businessNameToSearch: any;
  businessNameToSearchForPersonal: any;
  businessNameToSearchForHome: any;
  searchFilterForLap: any = {};
  searchFilterPersonal: any = {};
  homeloanLeadsCount: any = 0;
  mobileNumberToSearch: any;
  leadStatus: any = projectConstantsLocal.LEAD_STATUS;
  currentTableEvent: any;
  appliedFilterLap: {};
  appliedFilterLapself: {};
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  fileRemarksDetails: any = projectConstantsLocal.FILE_REMARKS;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  fileRemarks = projectConstantsLocal.FILE_REMARKS;
  searchFilter: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  breadCrumbItems: any = [];
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  leadSources: any = [];
  filterConfig: any[] = [];
  leadUsers: any = [];
  appliedFilter: {};
  userDetails: any;
  selectedSoucedByStatus: any;
  SourcedByForLap: any;
  SourcedByForHome: any;
  SourcedByForPersonal: any;
  apiLoading: any;
  loanleadsLoading: any;
  totalLeadsCountArray: any;
  totalActiveLeadsCount: any;
  totalStatusLeadsCountArray: any;
  selectedMonth: Date;
  moment: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  fileStatus: any = projectConstantsLocal.FILE_STATUS;
  selectedFileStatus = this.fileStatus[1];
  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private location: Location,
    private dateTimeProcessor: DateTimeProcessorService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Files' },
    ];
    this.getLeadUsers();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedSoucedByStatus = {
        id: params['id'],
        name: params['name'],
      };
    });
    this.selectedMonth = new Date();
    this.initializeUserDetails();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    // this.loadAllLeadData().then(() => {
    //   this.items = this.getFilteredItems();
    //   this.loadActiveItem();
    //   this.setFilterConfig();
    // });
    // this.loadEmploymentActiveItem();
    this.setFilterConfig();
    const loanTypes = ['', 'Personal', 'Home', 'Homeself', 'Lap', 'Lapself'];
    loanTypes.forEach((type) => {
      const localStorageKey = `filesAppliedFilter${type}`;
      const storedFilter =
        this.localStorageService.getItemFromLocalStorage(localStorageKey);
      if (storedFilter) {
        this[`appliedFilter${type}`] = storedFilter;
      } else {
        this[`appliedFilter${type}`] = {};
      }
    });
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage(
      'selectedFileSourcedbyStatus'
    );
    if (storedStatus1) {
      this.selectedSoucedByStatus = storedStatus1;
    }
    const storedStatus2 = this.localStorageService.getItemFromLocalStorage(
      'selectedFileStatus'
    );
    if (storedStatus2) {
      this.selectedFileStatus = storedStatus2;
    }
  }
  private async initializeUserDetails(): Promise<void> {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    // this.employmentStatus = [
    //   { label: 'Employed', name: 'employed' },
    //   { label: 'Self Employed', name: 'self-employed' },
    // ];
    // this.activeEmploymentStatus = this.employmentStatus[0];
  }
  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('filesActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  // private async loadAllLeadData(): Promise<void> {
  //   try {
  //     await Promise.all([
  //       this.loadLeadsforPersonal(event),
  //       this.loadLeadsforHome(event),
  //       this.loadLeadsforHomeself(event),
  //       this.loadLeadsforlap(event),
  //       this.loadLeadsforlapself(event),
  //     ]);
  //   } catch (error) {}
  // }

  private async loadAllLeadData(): Promise<void> {
    try {
      await Promise.all([
        this.getTotalLeadsCountArray(event),
        this.getbusinessloanleadsCount(event),
        this.getStatusLeadsCountArray(event)
      ]);
    } catch (error) { }
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
  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'Files':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'CNI':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
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
    filter['leadInternalStatus-eq'] = 3;
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
  getStatusLeadsCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 3;
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
    filter['leadInternalStatus-eq'] = 3;
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
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    // if (this.selectedMonth) {
    //   const startOfMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth(), 1);
    //   const endOfMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
    //   api_filter['docs.createdOn-gte'] = startOfMonth.toISOString().split('T')[0]; // e.g. '2024-07-01'
    //   api_filter['docs.createdOn-lte'] = endOfMonth.toISOString().split('T')[0];   // e.g. '2024-07-31'
    // }
    if (this.selectedMonth) {
      const startOfMonth = this.moment(this.selectedMonth).startOf('month');
      const endOfMonth = this.moment(this.selectedMonth).endOf('month').add(1, 'day');
      api_filter['docs.createdOn-gte'] = startOfMonth.format('YYYY-MM-DD'); // e.g. '2025-07-01'
      api_filter['docs.createdOn-lte'] = endOfMonth.format('YYYY-MM-DD');   // e.g. '2025-07-31'
    }
    // api_filter['leadInternalStatus-eq'] = 3;
    if (this.selectedFileStatus) {
      // console.log(this.selectedFileStatus)
      if (this.selectedFileStatus && this.selectedFileStatus.name) {
        if (this.selectedFileStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedFileStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '3,4';
        }
      }
    }
    // if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
    //   if (this.selectedSoucedByStatus.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
    //   }
    // }
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
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
      this.getTotalLeadsFilesCount(api_filter);
      this.getTotalLeads(api_filter);
    }
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
    // console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'filesActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }
  actionItems(lead: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    // const menuItems: MenuItem[] = [
    //   {
    //     label: 'Actions',
    //     items: [
    //       {
    //         label: 'View Lead',
    //         icon: 'pi pi-eye',
    //         command: () => this.viewLeadProfile(lead.id),
    //       },
    //       {
    //         label: 'Send to Leads',
    //         icon: 'pi pi-sign-in',
    //         command: () => this.revertLeadToNew(lead),
    //       },
    //       {
    //         label: 'Send to CNI',
    //         icon: 'pi pi-sign-in',
    //         command: () => this.sendFileToCNI(lead),
    //       },
    //       ...(this.userDetails?.userType && this.userDetails.userType !== '5'
    //         ? [
    //           {
    //             label: 'Send to Credit Evaluation',
    //             icon: 'pi pi-dollar',
    //             command: () => this.sendFileToCreditEvaluation(lead),
    //           },
    //         ]
    //         : []),
    //     ],
    //   },
    // ];
    const userTypeIsNot3 =
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType !== '5';
    // menuItems[0].items.push({
    //   label: 'View Lead',
    //   icon: 'pi pi-eye',
    //   command: () => this.viewLeadProfile(lead.id),
    // },);
    if (lead.leadInternalStatus === 3) {
      menuItems[0].items.push({
        label: 'Send to Leads',
        icon: 'pi pi-sign-in',
        command: () => this.revertLeadToNew(lead),
      },);
      menuItems[0].items.push({
        label: 'Send to CNI',
        icon: 'pi pi-sign-in',
        command: () => this.sendFileToCNI(lead),
      },);
      if (userTypeIsNot3) {
        menuItems[0].items.push({
          label: 'Send to Credit Evaluation',
          icon: 'pi pi-dollar',
          command: () => this.sendFileToCreditEvaluation(lead),
        },);

      }
    } else if (lead.leadInternalStatus === 4) {
      menuItems[0].items.push({
        label: 'Send to Files',
        icon: 'pi pi-sign-in',
        command: () => this.revertLeadToFiles(lead),
      });
    }
    return menuItems;
  }
  getMaskedPhone(phone: any) {
    return this.leadsService.maskPhoneNumber(phone);
  }

  actionItemsForLead(lead: any, leadType: string): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          {
            label: 'Send to Leads',
            icon: 'pi pi-sign-in',
            command: () => this.revertLoanLeadToNew(lead, leadType),
          },
          {
            label: 'Send to Credit Evaluation',
            icon: 'pi pi-sign-in',
            command: () => this.sendplFileToCreditEvaluation(lead, leadType),
          },
          // ...(leadType === 'personal'
          //   ? [
          //     {
          //       label: 'Send to Credit Evaluation',
          //       icon: 'pi pi-sign-in',
          //       command: () => this.sendplFileToCreditEvaluation(lead, leadType),
          //     },
          //   ]
          //   : []),
        ],
      },
    ];
    return menuItems;
  }

  revertLoanLeadToNew(lead: any, leadType: string) {
    this.changeLoadLeadStatus(lead.leadId, 1, leadType);
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
  setFilterConfig() {
    const createTextFilter = (field: string, title: string) => ({
      field,
      title,
      type: 'text',
      filterType: 'like',
    });
    const createDateFilter = (field: string, title: string) => ({
      field,
      title,
      type: 'date',
      filterType: 'like',
    });
    const createDropdownFilter = (
      field: string,
      title: string,
      options: any[]
    ) => ({
      field,
      title,
      type: 'dropdown',
      filterType: 'like',
      options: options.map((option) => ({
        label: option.displayName,
        value: option.name,
      })),
    });

    const createDropdownFilterforId = (
      field: string,
      title: string,
      options: any[]
    ) => ({
      field,
      title,
      type: 'dropdown',
      filterType: 'eq', // for exact ID match
      options: options.map((option) => ({
        label: option.displayName, // what the user sees
        value: option.id           // the actual ID value used in filtering
      })),
    });
    const createDocDateRangeFilter = () => [
      { field: 'docs.createdOn', title: 'Uploaded From', type: 'date', filterType: 'gte' },
      { field: 'docs.createdOn', title: 'Uploaded To', type: 'date', filterType: 'lte' },
    ];
    const createDateRangeFilter = () => [
      { field: 'createdOn', title: 'From', type: 'date', filterType: 'gte' },
      { field: 'createdOn', title: 'To', type: 'date', filterType: 'lte' },
    ];
    const getFieldName = (isCommonFilter: boolean, field: string) =>
      isCommonFilter ? 'id' : 'leadId';
    const hadOwnHouseOptions = this.hadOwnHouse;
    const entityOptions = this.entityDetails;
    const fileRemarksOptions = this.fileRemarksDetails;
    const turnoverOptions = this.turnoverDetails;
    const natureOfBusinessOptions = this.natureofBusinessDetails;
    const commonFilters = [
      {
        header: 'Lead Id',
        data: [createTextFilter(getFieldName(true, 'id'), 'Lead Id')],
      },
      {
        header: 'Phone Number',
        data: [createTextFilter('primaryPhone', 'Phone Number')],
      },
      { header: 'City', data: [createTextFilter('city', 'City Name')] },
      {
        header: 'Had Own House',
        data: [
          createDropdownFilter(
            'hadOwnHouse',
            'Had Own House',
            hadOwnHouseOptions
          ),
        ],
      },
    ];
    this.filterConfig = [
      ...commonFilters,
      {
        header: 'Business Name',
        data: [createTextFilter('businessName', 'Business Name')],
      },
      {
        header: 'Uploaded Date Range',
        data: createDocDateRangeFilter()
      },
      {
        header: 'File Remarks',
        data: [
          createDropdownFilterforId(
            'fileRemarks',
            'File Remarks',
            fileRemarksOptions
          ),
        ],
      },
      { header: 'Date Range', data: createDateRangeFilter() },
      {
        header: 'Business Entity',
        data: [
          createDropdownFilter(
            'businessEntity',
            'Business Entity',
            entityOptions
          ),
        ],
      },
      {
        header: 'Contact Person',
        data: [createTextFilter('contactPerson', 'Contact Person Name')],
      },
      {
        header: 'Business Turnover',
        data: [
          createDropdownFilter(
            'businessTurnover',
            'Business Turnover',
            turnoverOptions
          ),
        ],
      },
      {
        header: 'Nature Of Business',
        data: [
          createDropdownFilter(
            'natureOfBusiness',
            'Nature of Business',
            natureOfBusinessOptions
          ),
        ],
      },
      { header: 'Created On', data: [createDateFilter('createdOn', 'Date')] },
    ];
    this.personalfilterConfig = [
      {
        header: 'Lead Id',
        data: [createTextFilter('leadId', 'Lead Id')],
      },
      {
        header: 'Phone Number',
        data: [createTextFilter('primaryPhone', 'Phone Number')],
      },
      {
        header: 'City',
        data: [createTextFilter('city', 'City Name')],
      },
      {
        header: 'Had Own House',
        data: [
          createDropdownFilter(
            'hadOwnHouse',
            'Had Own House',
            hadOwnHouseOptions
          ),
        ],
      },
      {
        header: 'Person Name',
        data: [createTextFilter('contactPerson', 'Person Name')],
      },
      { header: 'Date Range', data: createDateRangeFilter() },
      { header: 'Salary', data: [createTextFilter('salary', 'Salary')] },
      {
        header: 'Job Experience',
        data: [createTextFilter('jobExperience', 'Job Experience')],
      },
      {
        header: 'Designation',
        data: [createTextFilter('designation', 'Designation')],
      },
      { header: 'Created On', data: [createDateFilter('createdOn', 'Date')] },
    ];
    this.HomefilterConfig = this.personalfilterConfig;
    this.HomeSelffilterConfig = [
      {
        header: 'Lead Id',
        data: [createTextFilter('leadId', 'Lead Id')],
      },
      {
        header: 'Phone Number',
        data: [createTextFilter('primaryPhone', 'Phone Number')],
      },
      {
        header: 'City',
        data: [createTextFilter('city', 'City Name')],
      },
      {
        header: 'Had Own House',
        data: [
          createDropdownFilter(
            'hadOwnHouse',
            'Had Own House',
            hadOwnHouseOptions
          ),
        ],
      },
      {
        header: 'Business Name',
        data: [createTextFilter('businessName', 'Business Name')],
      },
      { header: 'Date Range', data: createDateRangeFilter() },
      {
        header: 'Business Entity',
        data: [
          createDropdownFilter(
            'businessEntity',
            'Business Entity',
            entityOptions
          ),
        ],
      },
      {
        header: 'Contact Person',
        data: [createTextFilter('contactPerson', 'Contact Person Name')],
      },
      {
        header: 'Business Turnover',
        data: [
          createDropdownFilter(
            'businessTurnover',
            'Business Turnover',
            turnoverOptions
          ),
        ],
      },
      {
        header: 'Nature Of Business',
        data: [
          createDropdownFilter(
            'natureOfBusiness',
            'Nature of Business',
            natureOfBusinessOptions
          ),
        ],
      },
      { header: 'Created On', data: [createDateFilter('createdOn', 'Date')] },
    ];
  }

  sendFileToCreditEvaluation(lead) {
    this.changeLeadStatus(lead.id, 5);
    this.createDscrTable(lead.id);
    this.routingService.handleRoute(`credit/evaluate/${lead.id}`, null);
  }

  sendplFileToCreditEvaluation(lead: any, leadType: string) {
    this.changeLoadLeadStatus(lead.leadId, 5, leadType);
    this.createDscrTable(lead.leadId);
  }

  sendFileToCNI(lead) {
    this.changeLeadStatus(lead.id, 4);
  }
  createDscrTable(lead) {
    this.loading = true;
    this.leadsService.createDscrTable({ id: lead }).subscribe(
      (leads) => {
        //this.toastService.showSuccess("Id Inserted  into the Dscr Table Changed Successfully")
        this.loading = false;
        //this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        // this.toastService.showError(error);
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

  revertLeadToNew(lead) {
    this.changeLeadStatus(lead.id, 1);
  }
  revertLeadToFiles(lead) {
    this.changeLeadStatus(lead.id, 3);
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

  getSourceName(userId) {
    if (this.leadUsers && this.leadUsers.length > 0) {
      let leadUserName = this.leadUsers.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }

  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getFilesCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
        // console.log(this.totalLeadsCount);
        this.items =
          this.getFilteredItems();
        this.activeItem = this.items[0];
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getFiles(filter).subscribe(
      (response) => {
        this.leads = response;
        // console.log("this.leads", this.leads)
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
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
  getLeadSources(filter = {}) {
    this.loading = true;
    this.leadsService.getLeadSources(filter).subscribe(
      (leadSources) => {
        this.leadSources = leadSources;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
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
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  statusChangeSourcedBy(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedFileSourcedbyStatus',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedFileStatus',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }

  createLead() {
    this.routingService.handleRoute('leads/create', null);
  }

  // viewLead(leadId) {
  //   this.routingService.handleRoute('files/view/' + leadId, null);
  // }
  // viewLeadProfile(event) {
  //   const lead = event.data
  //   this.routingService.handleRoute('leads/profile/' + lead.id, null);
  // }


  viewLeadProfile(event: any) {
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
  viewLoanLead(leadId) {
    this.routingService.handleRoute('files/loanleadview/' + leadId, null);
  }

  uploadLeadFiles(leadId) {
    this.routingService.handleRoute('files/upload/' + leadId, null);
  }

  uploadLoanLeadFiles(leadId) {
    this.routingService.handleRoute('files/uploadloanleads/' + leadId, null);
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }

  goBack() {
    this.location.back();
  }

  loadLeadsforPersonal(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['leadInternalStatus-eq'] = '3';
    // if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
    //   if (this.SourcedByForPersonal.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
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
      this.getpersonalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
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

  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `filesAppliedFilter${filterType}`;
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
      'filesEmploymentStatusActiveItem',
      event.name
    );
  }

  statusChangeForPersonal(event) {
    this.loadLoanLeads('personal');
  }

  statusChangeForHome(event) {
    this.loadLoanLeads('home');
  }

  statusChangeForLap(event) {
    this.loadLoanLeads('lap');
  }

  statusChangeForHomeSelf(event) {
    this.loadLoanLeads('homeself');
  }
  statusChangeForLapSelf(event) {
    this.loadLoanLeads('lapself');
  }
  loadLeadsforHome(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '3';
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
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
    api_filter['leadInternalStatus-eq'] = '3';
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
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
  getHomeActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'home' : 'homeself';
    return this.actionItemsForLead(lead, leadType);
  }

  loadLeadsforlap(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '3';
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
    api_filter['leadInternalStatus-eq'] = '3';
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
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.lapselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getLapActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'lap' : 'lapself';
    return this.actionItemsForLead(lead, leadType);
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
  inputValueChangeEventForLAP(dataType, value) {
    if (value == '') {
      this.searchFilterForLap = {};
      this.LapleadsTable.reset();
    }
  }

  inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapleadsTable.reset();
    }
  }

  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadLoanLeads('home');
  }

  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadLoanLeads('lap');
  }
  applyFiltersHomeSelf(searchFilterForHomeSelf = {}) {
    this.searchFilterForHomeSelf = searchFilterForHomeSelf;
    this.loadLoanLeads('homeself');
  }

  applyFiltersLapSelf(searchFilterForLapSelf = {}) {
    this.searchFilterForLapSelf = searchFilterForLapSelf;
    this.loadLoanLeads('lapself');
  }
  filterWithPersonNameForHome() {
    let searchFilterForHome = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    this.applyFiltersHome(searchFilterForHome);
  }
  filterWithPersonNameForLAP() {
    let searchFilterForLap = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    // console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  filterWithBusinessNameForHome() {
    let searchFilterForHomeSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersHomeSelf(searchFilterForHomeSelf);
  }
  filterWithBusinessNameForLAP() {
    let searchFilterForLapSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersLapSelf(searchFilterForLapSelf);
  }
  stopDropdownClick(event: Event): void {
    event.stopPropagation();
  }
  updateLeadFileRemark(lead: any) {
    const payload = {

      fileRemarks: lead.fileRemarks
    };
    this.loading = true;
    this.leadsService.updateLeadFileRemarks(lead.id, payload).subscribe(

      (data) => {
        if (data) {
          this.loading = false;
          this.toastService.showSuccess('Remarks Updated Successfully');
          // this.routingService.handleRoute('leads', null);
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
}
