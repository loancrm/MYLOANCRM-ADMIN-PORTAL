import { Component, OnInit, ViewChild } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from './leads.service';
import { ToastService } from '../../services/toast.service';
import { Table } from 'primeng/table';
import { Location } from '@angular/common';
import { RoutingService } from '../../services/routing-service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  leads: any = {
    BusinessEntity: '',
  };
  loanLeads: any = [];
  filterConfig: any[] = [];
  personalfilterConfig: any[] = [];
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  loading: any;
  items: any;
  employmentStatus: any;
  totalLeadsCount: any = 0;
  totalloanLeadsCount: any = 0;
  personalloanLeadsCount: any = 0;
  homeloanselfLeadsCount: any = 0;
  lapselfLeadsCount: any = 0;
  lapLeadsCount: any = 0;
  homeloanLeadsCount: any = 0;
  leadIdToSearch: any;
  businessNameToSearch: any;
  businessNameToSearchForPersonal: any;
  personNameToSearchForHome: any;
  businessNameToSearchForHome: any;
  sourcedByToSearch: any;
  selectedSourcedByStatus: any;
  SourcedByForPersonal: any;
  SourcedByForHome: any;
  SourcedByForLap: any;
  leadStatus: any = projectConstantsLocal.LEAD_STATUS;
  currentTableEvent: any;
  selectedLeadStatus = this.leadStatus[1];
  selectedHomeLeadStatus = this.leadStatus[1];
  selectedLapLeadStatus = this.leadStatus[1];
  // selectedHomeLeadStatus = this.leadStatus[1];
  selectedPersonalLeadStatus = this.leadStatus[1];
  loanTypes: any = projectConstantsLocal.LOAN_TYPES;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  searchFilter: any = {};
  searchFilterPersonal: any = {};
  searchFilterForHomeSelf: any = {};
  searchFilterForLapSelf: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  searchInputValue: string = '';
  breadCrumbItems: any = [];
  leadSources: any = [];
  leadUsers: any = [];
  userDetails: any;
  activeItem: any;
  activeEmploymentStatus: any;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  leadRemarksData: any = projectConstantsLocal.LEAD_REMARKS;
  appliedFilter: {};
  appliedFilterPersonal: {};
  appliedFilterLap: {};
  appliedFilterLapself: {};
  appliedFilterHomeself: {};
  appliedFilterHome: {};
  searchFilterForHome: any = {};
  searchFilterForLap: any = {};
  dropdownVisible = false;
  capabilities: any;
  selectedLoanType: string;
  apiLoading: any;
  // loadleadsloading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  totalLeadsCountArray: any;
  totalActiveLeadsCount: any;
  totalStatusLeadsCountArray: any;
  loadleadsloading: boolean = false;
  api_filter: any;
  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
    private confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Leads' },
    ];
    this.getLeadUsers();
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedSourcedByStatus = {
        id: params['id'],
        name: params['name'],
      };
    });
    this.initializeUserDetails();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    // this.loadEmploymentActiveItem();
    this.setFilterConfig();
    this.capabilities = this.leadsService.getUserRbac();
    console.log(this.capabilities);
    const loanTypes = ['', 'Personal', 'Home', 'Homeself', 'Lap', 'Lapself'];
    loanTypes.forEach((type) => {
      const localStorageKey = `leadsAppliedFilter${type}`;
      const storedFilter =
        this.localStorageService.getItemFromLocalStorage(localStorageKey);
      if (storedFilter) {
        this[`appliedFilter${type}`] = storedFilter;
      } else {
        this[`appliedFilter${type}`] = {};
      }
    });
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage(
      'selectedLeadStatus1'
    );
    if (storedStatus1) {
      this.selectedLeadStatus = storedStatus1;
    }
    const storedStatus2 = this.localStorageService.getItemFromLocalStorage(
      'selectedSourcedByStatus'
    );
    if (storedStatus2) {
      this.selectedSourcedByStatus = storedStatus2;
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
      this.localStorageService.getItemFromLocalStorage('leadsActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  loadEmploymentActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage(
        'employmentStatusActiveItem'
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

  private async loadAllLeadData(): Promise<void> {
    try {
      await Promise.all([
        this.getTotalLeadsCountArray(event),
        this.getbusinessloanleadsCount(event),
        this.getStatusLeadsCountArray(event)
      ]);
    } catch (error) { }
  }
  // // Add your sendToFile method here:
  // sendToFile(): void {
  //   // Check if the businessEntity is filled
  //   if (!this.leads.businessEntity || this.leads.businessEntity.trim() === '') {
  //     // If not filled, show an error message
  //     this.toastService.showToast('error', 'Business Entity Required', 'Please fill in the business entity.');
  //     return;  // Exit the function early
  //   }

  //   // If the business entity is filled, proceed to send to file
  //   this.sendLeadToFile();  // Call your actual logic to send the lead to file
  // }

  // // Your logic for sending the lead to file
  // sendLeadToFile(): void {
  //   // Logic to send the lead to file
  //   this.toastService.showToast('success', 'Lead Sent to File', 'The lead has been sent to the file successfully.');
  // }
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
    console.log(this.activeItem)
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
    console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'leadsActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }
  onActiveEmploymentStatusChange(event: any) {
    this.activeEmploymentStatus = event;
    const { name } = this.activeEmploymentStatus;
    const { name: itemName } = this.activeItem;
    console.log(name);
    console.log(itemName);
    const loadLeadsFn =
      name === 'employed'
        ? itemName === 'homeLoan'
          ? this.loadLeadsforHome
          : this.loadLeadsforlap
        : itemName === 'homeLoan'
          ? this.loadLeadsforHomeself
          : this.loadLeadsforlapself;

    loadLeadsFn.call(this, event);
    this.localStorageService.setItemOnLocalStorage(
      'employmentStatusActiveItem',
      event.name
    );
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onLoanTypeSelect(event: any): void {
    console.log('Selected Loan Type:', event.value);
    this.selectedLoanType = event.value;
    if (this.selectedLoanType == 'businessLoan') {
      this.createLead();
    } else {
      this.createLoanLead();
    }
  }

  actionItems(lead: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    const userTypeIsNot3 =
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType !== '3';
    if (lead.leadInternalStatus === 1) {
      // menuItems[0].items.push({
      //   label: 'Update',
      //   icon: 'pi pi-sign-in',
      //   command: () => this.updateLead(lead.id),
      // });
      menuItems[0].items.push({
        label: 'Archive',
        icon: 'pi pi-sign-in',
        command: () => this.sendLeadToArchive(lead),
      });
      menuItems[0].items.push({
        label: 'Send to Follow Ups',
        icon: 'pi pi-sign-in',
        command: () => this.sendLeadToFollowUps(lead),

      });
      if (userTypeIsNot3) {
        menuItems[0].items.push({
          label: 'Send to Files',
          icon: 'pi pi-sign-in',
          command: () => {
            // Check if businessEntity is filled before sending to files
            if (!lead.businessEntity || lead.businessEntity.trim() === '') {
              // Show error message if businessEntity is empty
              this.toastService.showToast('error', 'Business Entity Required', 'Please fill in the Business Entity field.');
              return;  // Exit the function to prevent sending the lead to files
            }

            // Proceed to send to files if businessEntity is filled
            this.sendLeadToFiles(lead);
          },
        });
      }
      // You can also uncomment and implement the "Send to Partial" functionality
      // menuItems[0].items.push({
      //   label: 'Send to Partial',
      //   icon: 'pi pi-sign-in',
      //   command: () => this.sendLeadToPartialFiles(lead),
      // });


      // if (userTypeIsNot3) {
      //   menuItems[0].items.push({
      //     label: 'Send to Files',
      //     icon: 'pi pi-sign-in',
      //     command: () => this.sendLeadToFiles(lead),
      //   });
      //    }
      // menuItems[0].items.push({
      //   label: 'Send to Partial',
      //   icon: 'pi pi-sign-in',
      //   command: () => this.sendLeadToPartialFiles(lead),
      // });

    } else if (lead.leadInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Send to New Leads',
        icon: 'pi pi-sign-in',
        command: () => this.revertLeadToNew(lead),
      });
    }
    if (this.capabilities?.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(lead),
      });
    }
    return menuItems;
  }

  confirmLoanDelete(lead) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Lead ? <br>
              ${lead.employmentStatus === 'employed' ? `Contact person: ${lead.contactPerson}` : `Business Name: ${lead.businessName}`}<br>
              Lead ID: ${lead.leadId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteLoanLead(lead.leadId);
      },
    });
  }
  deleteLoanLead(leadId) {
    this.loading = true;
    this.leadsService.deleteLoanLead(leadId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  confirmDelete(lead) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Lead ? <br>
              Business Name: ${lead.businessName}<br>
              Lead ID: ${lead.id}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteLead(lead.id);
      },
    });
  }
  deleteLead(leadId) {
    this.loading = true;
    this.leadsService.deleteLead(leadId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadLeads(this.currentTableEvent);
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

    const createDateRangeFilter = () => [
      { field: 'createdOn', title: 'From', type: 'date', filterType: 'gte' },
      { field: 'createdOn', title: 'To', type: 'date', filterType: 'lte' },
    ];
    const updatedDateRangeFilter = () => [
      { field: 'lastUpdatedOn', title: 'From', type: 'date', filterType: 'gte' },
      { field: 'lastUpdatedOn', title: 'To', type: 'date', filterType: 'lte' },
    ];
    const getFieldName = (isCommonFilter: boolean, field: string) =>
      isCommonFilter ? 'id' : 'leadId';
    const hadOwnHouseOptions = this.hadOwnHouse;
    const entityOptions = this.entityDetails;
    const turnoverOptions = this.turnoverDetails;
    const natureOfBusinessOptions = this.natureofBusinessDetails;
    const leadRemarks = this.leadRemarksData;
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
        header: 'Secondary Number',
        data: [createTextFilter('secondaryPhone', 'Secondary Number')],
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
      {
        header: 'Lead Remarks',
        data: [
          createDropdownFilterforId(
            'leadRemarks',
            'Lead Remarks',
            leadRemarks
          ),
        ],
      },
      { header: 'Created On', data: [createDateFilter('createdOn', 'Date')] },
      {
        header: 'Created By',
        data: [createTextFilter('createdBy', 'Created By')],
      },
      { header: 'Updated Date Range', data: updatedDateRangeFilter() },
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
      {
        header: 'Created By',
        data: [createTextFilter('createdBy', 'Created By')],
      },
      { header: 'Updated Date Range', data: updatedDateRangeFilter() },
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
      {
        header: 'Created By',
        data: [createTextFilter('createdBy', 'Created By')],
      },
      { header: 'Updated Date Range', data: updatedDateRangeFilter() },
    ];
  }

  // applyConfigFilters(event, filterType: string) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this[`appliedFilter${filterType}`] = {};
  //   } else {
  //     this[`appliedFilter${filterType}`] = api_filter;
  //   }
  //   localStorage.setItem(
  //     'employeesAppliedFilter',
  //     JSON.stringify(this.appliedFilter)
  //   );
  //   switch (filterType) {
  //     case 'Personal':
  //       this.loadLoanLeads('personal');
  //       break;
  //     case 'Home':
  //       this.loadLoanLeads('home');
  //       break;
  //     case 'Homeself':
  //       this.loadLoanLeads('homeself');
  //       break;
  //     case 'Lap':
  //       this.loadLoanLeads('lap');
  //       break;
  //     case 'Lapself':
  //       this.loadLoanLeads('lapself');
  //       break;
  //     default:
  //       this.loadLeads(null);
  //       break;
  //   }
  // }
  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `leadsAppliedFilter${filterType}`;
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
  getLapActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'lap' : 'lapself';
    return this.actionItemsForLead(lead, leadType);
  }
  getHomeActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'home' : 'homeself';
    return this.actionItemsForLead(lead, leadType);
  }

  actionItemsForLead(lead: any, leadType: string): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    const archiveAction = {
      label: 'Archive',
      icon: 'pi pi-sign-in',
      command: () => this.sendLoanLeadToArchive(lead, leadType),
    };
    const filesAction = {
      label: 'Send To Files',
      icon: 'pi pi-sign-in',
      command: () => this.sendLoanLeadToFiles(lead, leadType),
    };
    const sendToNewLeadAction = {
      label: 'Send to New Lead',
      icon: 'pi pi-sign-in',
      command: () => this.revertLoanLeadToNew(lead, leadType),
    };
    const userTypeIsNot3 =
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType !== '3';
    if (lead.leadInternalStatus === 1) {
      menuItems[0].items.push(archiveAction);
      if (userTypeIsNot3) {
        menuItems[0].items.push(filesAction);
      }
    } else if (lead.leadInternalStatus === 2) {
      menuItems[0].items.push(sendToNewLeadAction);
    }
    if (this.capabilities.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmLoanDelete(lead),
      });
    }
    return menuItems;
  }

  sendLoanLeadToFiles(lead: any, leadType: string) {
    this.changeLoadLeadStatus(lead.leadId, 3, leadType);
  }
  sendLoanLeadToArchive(lead: any, leadType: string) {
    this.changeLoadLeadStatus(lead.leadId, 2, leadType);
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

  revertLeadToNew(lead) {
    this.changeLeadStatus(lead.id, 1);
  }
  sendLeadToArchive(lead) {
    this.changeLeadStatus(lead.id, 2);
  }
  sendLeadToFiles(lead) {
    this.changeLeadStatus(lead.id, 3);
    this.createleadDocumentsTable(lead);
    this.routingService.handleRoute(`files/upload/${lead.id}`, null);
  }

  sendLeadToFollowUps(lead) {
    this.changeLeadStatus(lead.id, 16);
    const targetUrl = 'user/followups';
    const queryParams = { v: this.version };
    this.router.navigate([targetUrl], { queryParams });
  }
  createleadDocumentsTable(lead) {
    this.loading = true;
    this.leadsService.createleadDocumentsTable(lead).subscribe(
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
  // sendLeadToPartialFiles(lead) {
  //   this.changeLeadStatus(lead.id, 4);
  //   this.createleadDocumentsTable(lead);
  // }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'New':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Archived':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedLeadStatus) {
      if (this.selectedLeadStatus && this.selectedLeadStatus.name) {
        if (this.selectedLeadStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedLeadStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '1,2';
        }
      }
    }
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
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      this.getTotalLeadsCount(api_filter);
      this.getTotalLeads(api_filter);
    }
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

  getTotalLeadsCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
        console.log(this.totalLeadsCount);
        // this.items = this.getFilteredItems();
        // // this.activeItem = this.items[0];
        // this.loadActiveItem();
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
    filter['leadInternalStatus-eq'] = 1;
    this.leadsService.getTotalLeadsCountArray(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCountArray = leadsCount;
        console.log(this.totalLeadsCountArray);
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
    filter['leadInternalStatus-eq'] = 1;
    this.leadsService.getStatusLeadsCountArray(filter).subscribe(
      (leadsCount) => {
        this.totalStatusLeadsCountArray = leadsCount;
        console.log(this.totalStatusLeadsCountArray);
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
    filter['leadInternalStatus-eq'] = 1;
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalActiveLeadsCount = leadsCount;
        console.log(this.totalActiveLeadsCount);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
        console.log(this.leads);
      },
      (error: any) => {
        this.apiLoading = false;
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

  handleInputChange(value: string): void {
    this.searchInputValue = value;
    if (this.activeEmploymentStatus.name === 'employed') {
      this.personNameToSearchForHome = value;
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

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
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

  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.searchFilterPersonal = {};
      this.personalleadsTable.reset();
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
  filterWithBusinessName() {
    let searchFilter = {};

    const trimmedInput = this.businessNameToSearch?.trim() || '';

    if (this.isPhoneNumber(trimmedInput)) {
      console.log("Detected phone number:", trimmedInput);
      searchFilter = { 'primaryPhone-like': trimmedInput };
    } else {
      console.log("Detected business name:", trimmedInput);
      searchFilter = { 'businessName-like': trimmedInput };
    }

    console.log("Search Filter Object:", searchFilter);
    this.applyFilters(searchFilter);
  }

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[6-9]\d{9}$/;
    return phoneNumberPattern.test(value.trim());
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent); // This should re-trigger the table data with the filter
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
    console.log(searchFilterForLap);
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
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedLeadStatus1',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }

  statusChangeforSourcedBy(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedSourcedByStatus',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
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
  createLead() {
    this.routingService.handleRoute('leads/create', null);
  }
  createLoanLead() {
    this.routingService.handleRoute(['/leads/createLoanLead'], {
      queryParams: { loanType: this.selectedLoanType },
    });
  }
  // viewLead(leadId) {
  //   this.routingService.handleRoute('leads/profile/' + leadId, null);
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
  updateLead(leadId) {
    this.routingService.handleRoute('leads/update/' + leadId, null);
  }

  updateLoanLead(leadId) {
    this.routingService.handleRoute('leads/updateLoanLead/' + leadId, null);
  }
  goBack() {
    this.location.back();
  }

  loadLeadsforPersonal(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    if (this.selectedPersonalLeadStatus) {
      if (
        this.selectedPersonalLeadStatus &&
        this.selectedPersonalLeadStatus.name
      ) {
        if (this.selectedPersonalLeadStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] =
            this.selectedPersonalLeadStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '1,2';
        }
      }
    }
    if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
      if (this.SourcedByForPersonal.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
      }
    }
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterPersonal,
      this.appliedFilterPersonal
    );
    console.log(api_filter);
    if (api_filter) {
      this.getpersonalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }

  loadLeadsforHome(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    if (this.selectedHomeLeadStatus) {
      if (this.selectedHomeLeadStatus && this.selectedHomeLeadStatus.name) {
        if (this.selectedHomeLeadStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedHomeLeadStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '1,2';
        }
      }
    }
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    }
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHome,
      this.appliedFilterHome
    );
    console.log(api_filter);
    if (api_filter) {
      this.getHomeloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforHomeself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    if (this.selectedHomeLeadStatus) {
      if (this.selectedHomeLeadStatus && this.selectedHomeLeadStatus.name) {
        if (this.selectedHomeLeadStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedHomeLeadStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '1,2';
        }
      }
    } else {
      api_filter['leadInternalStatus-or'] = '1,2';
    }
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-or'] = '1,2';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
    //   }
    // }
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    }
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHomeSelf,
      this.appliedFilterHomeself
    );
    if (api_filter) {
      console.log(api_filter);
      this.getHomeloanselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforlap(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    if (this.selectedLapLeadStatus) {
      if (this.selectedLapLeadStatus && this.selectedLapLeadStatus.name) {
        if (this.selectedLapLeadStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedLapLeadStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '1,2';
        }
      }
    }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLap,
      this.appliedFilterLap
    );

    if (api_filter) {
      this.getLapLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforlapself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    if (this.selectedLapLeadStatus) {
      if (this.selectedLapLeadStatus && this.selectedLapLeadStatus.name) {
        if (this.selectedLapLeadStatus.name != 'all') {
          api_filter['leadInternalStatus-eq'] = this.selectedLapLeadStatus.id;
        } else {
          api_filter['leadInternalStatus-or'] = '1,2';
        }
      }
    } else {
      api_filter['leadInternalStatus-or'] = '1,2';
    }
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-or'] = '1,2';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLapSelf,
      this.appliedFilterLapself
    );
    if (api_filter) {
      this.getLapselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getpersonalloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.personalloanLeadsCount = response;
        console.log(this.personalloanLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
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
  getloanLeads(filter = {}) {
    this.loadleadsloading = true;
    this.leadsService.getloanLeads(filter).subscribe(
      (response) => {
        this.loanLeads = response;
        this.loadleadsloading = false;
      },
      (error: any) => {
        this.loadleadsloading = false;
        this.toastService.showError(error);
      }
    );
  }
}
