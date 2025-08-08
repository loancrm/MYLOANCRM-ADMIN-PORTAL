import { Component, OnInit, ViewChild } from '@angular/core';
import { RoutingService } from '../../services/routing-service';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callbacks',
  templateUrl: './callbacks.component.html',
  styleUrl: './callbacks.component.scss',
})
export class CallbacksComponent implements OnInit {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  // searchFilterConverted: any = {};
  filterConfig: any[] = [];
  currentTableEvent: any;
  callBacks: any = [];
  callBacksCount: any = 0;
  items: any;
  activeItem: any;
  loading: any;
  userDetails: any;

  selectedSoucedByStatus: any;
  // selectedSoucedByConverted: any;
  callbackStatus: any = projectConstantsLocal.CALLBACK_STATUS;
  callBackIdToSearch: any;
  selectedCallbackStatus = this.callbackStatus[1];
  businessNameToSearch: any;
  // businessNameConvertedCallback: any;
  callbackInternalStatusList: any = projectConstantsLocal.CALLBACK_INTERNAL_STATUS;
  leadUsers: any = [];
  capabilities: any;
  appliedFilter: {};
  apiLoading: any;
  // appliedFilterConverted: {};
  @ViewChild('callBacksTable') callBacksTable!: Table;
  @ViewChild('personalcallBacksTable') personalcallBacksTable!: Table;
  @ViewChild('HomecallBacksTable') HomecallBacksTable!: Table;
  @ViewChild('LapcallBacksTable') LapcallBacksTable!: Table;
  // @ViewChild('convertedcallBacksTable') convertedcallBacksTable!: Table;
  version = projectConstantsLocal.VERSION_DESKTOP;


  loanTypes: any = projectConstantsLocal.LOAN_TYPES;
  selectedLoanType: string;
  employmentStatus: any;
  activeEmploymentStatus: any;
  totalCallbacksCountArray: any;
  totalStatusCallbacksCountArray: any;
  searchInputValue: string = '';
  personNameToSearchForHome: any;
  personNameToSearch: any;
  businessNameToSearchForHome: any;
  searchFilterPersonal: any = {};
  searchFilterForHomeSelf: any = {};
  searchFilterForLapSelf: any = {};
  searchFilterForHome: any = {};
  searchFilterForLap: any = {};
  SourcedByForPersonal: any;
  SourcedByForHome: any;
  SourcedByForLap: any;
  appliedFilterPersonal: {};
  appliedFilterLap: {};
  appliedFilterLapself: {};
  appliedFilterHomeself: {};
  appliedFilterHome: {};
  selectedHomeCallbackStatus = this.callbackStatus[1];
  selectedLapCallbackStatus = this.callbackStatus[1];
  selectedPersonalCallbackStatus = this.callbackStatus[1];
  personalfilterConfig: any[] = [];
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  constructor(
    private routingService: RoutingService,
    private location: Location,
    private leadsService: LeadsService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Callbacks' },
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

    // this.items = [
    //   { label: 'Callbacks', name: 'callbacks' },
    //   { label: 'Converted Leads', name: 'convertedCallbacks' },
    // ];

    // this.items = [
    //   { label: 'Business Loan', name: 'businessLoan' },
    //   { label: 'Personal Loan', name: 'personalLoan' },
    //   { label: 'Home Loan', name: 'homeLoan' },
    //   { label: 'LAP', name: 'lap' },
    // ];
    this.initializeUserDetails();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    // this.activeItem = this.items[0];
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
    this.setFilterConfig();
    // const storedAppliedFilter =
    //   this.localStorageService.getItemFromLocalStorage(
    //     'callbacksAppliedFilter'
    //   );
    // if (storedAppliedFilter) {
    //   this.appliedFilter = storedAppliedFilter;
    // }
    // const storedAppliedFiltercallbacktolead =
    //   this.localStorageService.getItemFromLocalStorage(
    //     'callbackstoLeadAppliedFilter'
    //   );
    // if (storedAppliedFiltercallbacktolead) {
    //   this.appliedFilterConverted = storedAppliedFiltercallbacktolead;
    // }
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage(
      'selectedCallbackStatus'
    );
    if (storedStatus1) {
      this.selectedCallbackStatus = storedStatus1;
    }
    const storedStatus2 = this.localStorageService.getItemFromLocalStorage(
      'selectedCallbackSourcedByStatus'
    );
    if (storedStatus2) {
      this.selectedSoucedByStatus = storedStatus2;
    }
    const storedStatus3 = this.localStorageService.getItemFromLocalStorage(
      'selectedCallbackSourcedByForPersonal'
    );
    if (storedStatus3) {
      this.SourcedByForPersonal = storedStatus3;
    }

    const storedStatus4 = this.localStorageService.getItemFromLocalStorage(
      'selectedPersonalCallbackStatus'
    );
    if (storedStatus4) {
      this.selectedPersonalCallbackStatus = storedStatus4;
    }
    const storedStatus5 = this.localStorageService.getItemFromLocalStorage(
      'selectedSourcedByHome'
    );
    if (storedStatus5) {
      this.SourcedByForHome = storedStatus5;
    }
    const storedStatus6 = this.localStorageService.getItemFromLocalStorage(
      'selectedHomeCallbackStatus'
    );
    if (storedStatus6) {
      this.selectedHomeCallbackStatus = storedStatus6;
    }

    const storedStatus7 = this.localStorageService.getItemFromLocalStorage(
      'SourcedByForLap'
    );
    if (storedStatus7) {
      this.SourcedByForLap = storedStatus7;
    }
    const storedStatus8 = this.localStorageService.getItemFromLocalStorage(
      'selectedLapCallbackStatus'
    );
    if (storedStatus8) {
      this.selectedLapCallbackStatus = storedStatus8;
    }
    // console.log(this.selectedSoucedByStatus)
    const loanTypes = ['', 'Personal', 'Home', 'Homeself', 'Lap', 'Lapself'];
    loanTypes.forEach((type) => {
      const localStorageKey = `callbacksAppliedFilter${type}`;
      const storedFilter =
        this.localStorageService.getItemFromLocalStorage(localStorageKey);
      if (storedFilter) {
        this[`appliedFilter${type}`] = storedFilter;
      } else {
        this[`appliedFilter${type}`] = {};
      }
    });

  }

  private async initializeUserDetails(): Promise<void> {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;

  }
  private async loadAllLeadData(): Promise<void> {
    try {
      await Promise.all([
        this.getTotalCallbacksCountArray(event),
        this.getStatusCallbacksCountArray(event)
      ]);
    } catch (error) { }
  }

  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('callbacksActiveItem');
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
  getFilteredItems(): { label: string; name: string }[] {
    return [
      {
        label: `Business Loan (${this.totalCallbacksCountArray?.businesscount})`,
        name: 'businessLoan',
      },
      {
        label: `Personal Loan (${this.totalCallbacksCountArray?.personalcount || 0
          })`,
        name: 'personalLoan',
      },
      {
        label: `Home Loan (${this.totalCallbacksCountArray?.homeLoancount || 0})`,
        name: 'homeLoan',
      },
      {
        label: `LAP (${this.totalCallbacksCountArray?.LAPLoancount || 0})`,
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
  getTotalCallbacksCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['callbackInternalStatus-eq'] = 1;
    this.leadsService.getTotalCallbacksCountArray(filter).subscribe(
      (callbacksCount) => {
        this.totalCallbacksCountArray = callbacksCount;
        // console.log(this.totalCallbacksCountArray);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getStatusCallbacksCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['callbackInternalStatus-eq'] = 1;
    this.leadsService.getStatusCallbacksCountArray(filter).subscribe(
      (callbacksCount) => {
        this.totalStatusCallbacksCountArray = callbacksCount;
        // console.log(this.totalStatusCallbacksCountArray);
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
    if (!this.totalStatusCallbacksCountArray) {
      return [];
    }
    // console.log(this.activeItem)
    // Check the active item and update the labels accordingly
    if (this.activeItem.name === 'homeLoan') {
      return [
        {
          label: `Employed (${this.totalStatusCallbacksCountArray.homeLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusCallbacksCountArray.homeLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    } else if (this.activeItem.name === 'lap') {
      return [
        {
          label: `Employed (${this.totalStatusCallbacksCountArray.LAPLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusCallbacksCountArray.LAPLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    }

    // Default case (if activeItem is neither homeLoan nor LAP)
    return [];
  }

  actionItems(callback: any, callbackType: string): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    if (callback.callbackInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'Archive',
        icon: 'pi pi-sign-in',
        command: () => this.sendCallbackToArchive(callback, callbackType),
      });
      menuItems[0].items.push({
        label: 'Send to Lead',
        icon: 'pi pi-sign-in',
        command: () => this.confirmConversion(callback, callbackType),
      });
    } else if (callback.callbackInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Send to New callback',
        icon: 'pi pi-sign-in',
        command: () => this.revertCallbackToNew(callback, callbackType),
      });
    }
    if (this.capabilities?.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(callback),
      });
    }
    return menuItems;
  }

  confirmDelete(callback) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Callback ? <br>
              Business Name: ${callback.businessName}<br>
              Callback ID: ${callback.callBackId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCallBack(callback.callBackId);
      },
    });
  }

  deleteCallBack(callBackId) {
    this.loading = true;
    this.leadsService.deleteCallBack(callBackId).subscribe(
      (response: any) => {
        // console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadCallBacks(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  onActiveItemChange(event) {
    // console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'callbacksActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }

  onActiveEmploymentStatusChange(event: any) {
    this.activeEmploymentStatus = event;
    const { name } = this.activeEmploymentStatus;
    const { name: itemName } = this.activeItem;
    // console.log(name);
    // console.log(itemName);
    const loadCallbacksFn =
      name === 'employed'
        ? itemName === 'homeLoan'
          ? this.loadHomeLoanCallBacks
          : this.loadLAPCallBacks
        : itemName === 'homeLoan'
          ? this.loadHomeLoanSelfCallBacks
          : this.loadLAPSelfCallBacks;

    loadCallbacksFn.call(this, event);
    this.localStorageService.setItemOnLocalStorage(
      'employmentStatusActiveItem',
      event.name
    );
  }
  setFilterConfig() {
    // console.log("filter config")
    this.filterConfig = [
      {
        header: 'Callback Id',
        data: [
          {
            field: 'callBackId',
            title: 'Callback Id',
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
            field: 'phone',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Callback Date',
        data: [
          {
            field: 'date',
            title: 'Callback Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Callback Date Range',
        data: [
          {
            field: 'date',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'date', title: 'To', type: 'date', filterType: 'lte' },
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
        header: 'Created By',
        data: [
          {
            field: 'createdBy',
            title: 'Created By',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Last Updated Date Range',
        data: [
          {
            field: 'lastUpdatedOn	',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'date', title: 'To', type: 'date', filterType: 'lte' },
        ],
      },
    ];
    this.HomeSelffilterConfig = this.filterConfig
    this.personalfilterConfig = [
      {
        header: 'Callback Id',
        data: [
          {
            field: 'callBackId',
            title: 'Callback Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Person Name',
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
            field: 'phone',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Callback Date',
        data: [
          {
            field: 'date',
            title: 'Callback Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Callback Date Range',
        data: [
          {
            field: 'date',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'date', title: 'To', type: 'date', filterType: 'lte' },
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
    ];
    this.HomefilterConfig = this.filterConfig
  }
  sendCallbackToArchive(callback, callbackType) {
    this.changeCallBackStatus(callback.id, 2, callbackType);
  }

  confirmConversion(callback, callbackType) {
    this.confirmationService.confirm({
      message: `Are you sure you want to convert this callback to lead?<br>
      ${callback.employmentStatus === 'employed' ? `Person Name: ${callback.businessName}` : `Business Name: ${callback.businessName}`}<br>
      Callback ID: ${callback.callBackId}`,
      header: 'Confirm Conversion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.sendCallbackToLead(callback, callbackType);
      },
    });
  }
  // sendCallbackToLead(callback,callbackType) {
  //   this.loading = true;
  //   const formData: any = {
  //     businessName: callback.businessName,
  //     primaryPhone: callback.phone,
  //     referenceNo: callback.callBackId,
  //     loanType: callback.loanType,
  //     employmentStatus: callback.employmentStatus,
  //     ...(this.userDetails?.userType === '3' && this.userDetails?.id
  //       ? {
  //           sourcedBy: this.userDetails.id,
  //           leadSource: 1,
  //         }
  //       : {}),
  //   };
  //   console.log('Form Data:', formData);
  //   this.leadsService.createLeadFromCallback(formData).subscribe(
  //     (leadData: any) => {
  //       if (leadData?.id) {
  //         console.log('Created Lead ID:', leadData.id);
  //         this.toastService.showSuccess('Lead Created Successfully');
  //         this.routingService.handleRoute(`leads/update/${leadData.id}`, null);
  //         const callbackFormData = {
  //           businessName: callback.businessName,
  //           referenceNo: leadData.id,
  //         };
  //         console.log('callbackFormData', callbackFormData);
  //         this.leadsService
  //           .updateCallBack(callback.id, callbackFormData)
  //           .subscribe(
  //             (updateResponse: any) => {
  //               this.loading = false;
  //               if (updateResponse) {
  //                 this.changeCallBackStatus(callback.id, 3,callbackType);
  //               }
  //             },
  //             (error: any) => {
  //               this.loading = false;
  //               console.error('Callback Update Error:', error);
  //               this.toastService.showError(error);
  //             }
  //           );
  //       }
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       console.error('Lead Creation Error:', error);
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  sendCallbackToLead(callback, callbackType) {
    this.loading = true;

    const loanType = callback.loanType;
    const employmentStatus = callback.employmentStatus;

    const isBusinessLoan = loanType === 'businessLoan';
    const isSelfEmployedHomeLoan = loanType === 'homeLoan' && employmentStatus === 'self-employed';
    const isSelfEmployedLAP = loanType === 'lap' && employmentStatus === 'self-employed';

    const useBusinessName =
      isBusinessLoan || isSelfEmployedHomeLoan || isSelfEmployedLAP;

    const baseFormData: any = {
      ...(useBusinessName
        ? { businessName: callback.businessName }
        : { contactPerson: callback.businessName }),

      primaryPhone: callback.phone,
      referenceNo: callback.callBackId,

      ...(this.userDetails?.userType === '3' && this.userDetails?.id
        ? {
          sourcedBy: this.userDetails.id,
          leadSource: 1,
        }
        : {}),
    };

    const formData = !isBusinessLoan
      ? {
        ...baseFormData,
        loanType: callback.loanType,
        employmentStatus: callback.employmentStatus,
      }
      : baseFormData;

    // console.log('Form Data:', formData);



    if (isBusinessLoan) {
      this.leadsService.createLeadFromCallback(formData).subscribe(
        (leadData: any) => {
          if (leadData?.id) {
            // console.log('Created Lead ID:', leadData.id);
            this.toastService.showSuccess('Lead Created Successfully');
            this.routingService.handleRoute(`leads/update/${leadData.id}`, null);

            const callbackFormData = {
              businessName: callback.businessName,
              referenceNo: leadData.id,
            };

            // console.log('callbackFormData', callbackFormData);

            this.leadsService.updateCallBack(callback.id, callbackFormData).subscribe(
              (updateResponse: any) => {
                this.loading = false;
                if (updateResponse) {
                  this.changeCallBackStatus(callback.id, 3, callbackType);
                }
              },
              (error: any) => {
                this.loading = false;
                console.error('Callback Update Error:', error);
                this.toastService.showError(error);
              }
            );
          }
        },
        (error: any) => {
          this.loading = false;
          console.error('Lead Creation Error:', error);
          this.toastService.showError(error);
        }
      );
    } else {
      this.leadsService.createLoanLeadFromCallback(formData).subscribe(
        (leadData: any) => {
          if (leadData?.leadId) {
            // console.log('Created Lead ID:', leadData.leadId);
            this.toastService.showSuccess('Lead Created Successfully');
            this.routingService.handleRoute(`leads/updateLoanLead/${leadData.leadId}`, null);

            const callbackFormData = {
              businessName: callback.businessName,
              referenceNo: leadData.leadId,
            };

            // console.log('callbackFormData', callbackFormData);

            this.leadsService.updateCallBack(callback.id, callbackFormData).subscribe(
              (updateResponse: any) => {
                this.loading = false;
                if (updateResponse) {
                  this.changeCallBackStatus(callback.id, 3, callbackType);
                }
              },
              (error: any) => {
                this.loading = false;
                console.error('Callback Update Error:', error);
                this.toastService.showError(error);
              }
            );
          }
        },
        (error: any) => {
          this.loading = false;
          console.error('Lead Creation Error:', error);
          this.toastService.showError(error);
        }
      );
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
  //     'callbacksAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadCallBacks(null);
  // }

  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `callbacksAppliedFilter${filterType}`;
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
        this.loadCallbackTypes('personal');
        break;
      case 'Home':
        this.loadCallbackTypes('home');
        break;
      case 'Homeself':
        this.loadCallbackTypes('homeself');
        break;
      case 'Lap':
        this.loadCallbackTypes('lap');
        break;
      case 'Lapself':
        this.loadCallbackTypes('lapself');
        break;
      default:
        this.loadCallBacks(null);
        break;
    }
  }
  revertCallbackToNew(callback, callbackType) {
    this.changeCallBackStatus(callback.id, 1, callbackType);
  }

  changeCallBackStatus(callbackId, statusId, callbackType) {
    this.loading = true;
    this.leadsService.changeCallBackStatus(callbackId, statusId).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loadCallbackTypes(callbackType);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'New':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Archived':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      case 'Converted':
        return { textColor: '#7B1FA2', backgroundColor: '#EAD1F7' }; // Purple theme
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  getStatusName(statusId) {
    if (this.callbackInternalStatusList && this.callbackInternalStatusList.length > 0) {
      let leadStatusName = this.callbackInternalStatusList.filter(
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
  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers: any) => {
        this.leadUsers = [{ name: 'All' }, ...leadUsers];
        this.loading = false;
        // console.log(leadUsers)
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
  createCallBack() {
    this.routingService.handleRoute('callbacks/create', null);
  }
  createSecuredCallBack() {
    this.routingService.handleRoute(['/callbacks/create'], {
      queryParams: { loanType: this.selectedLoanType },
    });
  }

  updateCallBack(callBackId) {
    this.routingService.handleRoute('callbacks/update/' + callBackId, null);
  }
  // viewLead(leadId) {
  //   this.routingService.handleRoute('leads/profile/' + leadId, null);
  // }
  viewLead(lead) {
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`leads/profile/${loanType}/${lead.referenceNo}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`leads/profile/${lead.referenceNo}`, null);
    }
  }
  goBack() {
    this.location.back();
  }


  loadCallbackTypes(callbackType: string) {
    // console.log(callbackType)
    if (!callbackType) {
      this.loadCallBacks(this.currentTableEvent);
      return;
    }
    switch (callbackType) {
      case 'personal':
        this.loadPersonalLoanCallBacks(this.currentTableEvent);
        break;
      case 'home':
        this.loadHomeLoanCallBacks(this.currentTableEvent);
        break;
      case 'homeself':
        this.loadHomeLoanSelfCallBacks(this.currentTableEvent);
        break;
      case 'lap':
        this.loadLAPCallBacks(this.currentTableEvent);
        break;
      case 'lapself':
        this.loadLAPSelfCallBacks(this.currentTableEvent);
        break;
      default:
        // this.loadCallBacks(this.currentTableEvent)
        console.error('Unknown lead type');
    }
  }

  loadCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedCallbackStatus) {
      if (this.selectedCallbackStatus && this.selectedCallbackStatus.name) {
        if (this.selectedCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] =
            this.selectedCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    } else {
      api_filter['callbackInternalStatus-or'] = '1,2,3';
    }
    // console.log(this.selectedSoucedByStatus)
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['callbackInternalStatus-or'] = '1,2,3';
      } else {
        api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    api_filter['loanType-eq'] = "businessLoan";
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
      // console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadPersonalLoanCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    if (this.selectedPersonalCallbackStatus) {
      if (this.selectedPersonalCallbackStatus && this.selectedPersonalCallbackStatus.name) {
        if (this.selectedPersonalCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedPersonalCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
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
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }


  loadHomeLoanCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';

    if (this.selectedHomeCallbackStatus) {
      if (this.selectedHomeCallbackStatus && this.selectedHomeCallbackStatus.name) {
        if (this.selectedHomeCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedHomeCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
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
    if (api_filter) {
      // console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadHomeLoanSelfCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    if (this.selectedHomeCallbackStatus) {
      if (this.selectedHomeCallbackStatus && this.selectedHomeCallbackStatus.name) {
        if (this.selectedHomeCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedHomeCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
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
      this.searchFilterForHomeSelf,
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
      // console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadLAPCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    if (this.selectedLapCallbackStatus) {
      if (this.selectedLapCallbackStatus && this.selectedLapCallbackStatus.name) {
        if (this.selectedLapCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedLapCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLap,
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
      // console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadLAPSelfCallBacks(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    if (this.selectedLapCallbackStatus) {
      if (this.selectedLapCallbackStatus && this.selectedLapCallbackStatus.name) {
        if (this.selectedLapCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedLapCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLapSelf,
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
      // console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
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

  filterWithPersonNameForHome() {
    let searchFilterForHome = { 'businessName-like': this.personNameToSearchForHome, };

    // const trimmedInput = this.personNameToSearchForHome?.trim() || '';
    // if (this.isPhoneNumber(trimmedInput)){
    //   console.log("Detected phone Number:", trimmedInput);
    //   this.searchFilter ={'phone-like':trimmedInput}
    // } else {
    //   console.log("Detecyed Person name:",trimmedInput);
    //   this.searchFilter ={"businessName-like": trimmedInput};
    // }
    // console.log("search Filter Object:", this.searchFilter);
    this.applyFiltersHome(searchFilterForHome);
  }

  filterWithPersonNameForLAP() {
    let searchFilterForLap = {
      'businessName-like': this.personNameToSearchForHome,
    };
    // console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  inputValueChangeEventForHome(dataType, value) {
    if (value == '') {
      this.searchFilterForHome = {};
      this.HomecallBacksTable.reset();
    }
  }

  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomecallBacksTable.reset();
    }
  }
  inputValueChangeEventForLAP(dataType, value) {
    if (value == '') {
      this.searchFilterForLap = {};
      this.LapcallBacksTable.reset();
    }
  }

  inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapcallBacksTable.reset();
    }
  }

  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.searchFilterPersonal = {};
      this.personalcallBacksTable.reset();
    }
  }
  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadCallbackTypes('home');
  }

  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadCallbackTypes('lap');
  }
  applyFiltersHomeSelf(searchFilterForHomeSelf = {}) {
    this.searchFilterForHomeSelf = searchFilterForHomeSelf;
    this.loadCallbackTypes('homeself');
  }

  applyFiltersLapSelf(searchFilterForLapSelf = {}) {
    this.searchFilterForLapSelf = searchFilterForLapSelf;
    this.loadCallbackTypes('lapself');
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
  statusChangeForPersonal(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCallbackSourcedByForPersonal',
      event.value
    );
    this.loadCallbackTypes('personal');
  }
  statusChangeForPersonal1(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedPersonalCallbackStatus',
      event.value
    );
    this.loadCallbackTypes('personal');
  }


  sourcedByChangeForHome(event) {
    this.localStorageService.setItemOnLocalStorage(
      'SourcedByForHome',
      event.value
    );
    this.loadCallbackTypes('home');
  }

  statusChangeForHome(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedHomeCallbackStatus',
      event.value
    );
    this.loadCallbackTypes('home');
  }
  sourcedByChangeForLap(event) {
    this.localStorageService.setItemOnLocalStorage(
      'SourcedByForLap',
      event.value
    );
    this.loadCallbackTypes('lap');
  }

  statusChangeForLap(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedLapCallbackStatus',
      event.value
    );
    this.loadCallbackTypes('lap');
  }
  statusChangeForHomeSelf(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedHomeCallbackStatus',
      event.value
    );
    this.loadCallbackTypes('homeself');
  }

  sourcedByChangeForHomeSelf(event) {
    this.localStorageService.setItemOnLocalStorage(
      'SourcedByForHome',
      event.value
    );
    this.loadCallbackTypes('homeself');
  }
  sourcedByChangeForLapSelf(event) {
    this.localStorageService.setItemOnLocalStorage(
      'SourcedByForLap',
      event.value
    );
    this.loadCallbackTypes('lapself');
  }

  statusChangeForLapSelf(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedLapCallbackStatus',
      event.value
    );
    this.loadCallbackTypes('lapself');
  }
  getLapActionItems(lead: any): MenuItem[] {
    const callbackType =
      this.activeEmploymentStatus.name === 'employed' ? 'lap' : 'lapself';
    return this.actionItems(lead, callbackType);
  }
  getHomeActionItems(lead: any): MenuItem[] {
    const callbackType =
      this.activeEmploymentStatus.name === 'employed' ? 'home' : 'homeself';
    return this.actionItems(lead, callbackType);
  }
  // loadConvertedCallBacks(event) {
  //   console.log(event);
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   api_filter['callbackInternalStatus-eq'] = '3';
  //   if (this.selectedSoucedByConverted && this.selectedSoucedByConverted.name) {
  //     if (this.selectedSoucedByConverted.name != 'All') {
  //       api_filter['sourcedBy-eq'] = this.selectedSoucedByConverted.id;
  //     }
  //   }
  //   api_filter = Object.assign(
  //     {},
  //     api_filter,
  //     this.searchFilterConverted,
  //     this.appliedFilterConverted
  //   );
  //   if (
  //     this.userDetails &&
  //     this.userDetails.id &&
  //     this.userDetails.userType &&
  //     this.userDetails.userType == '3'
  //   ) {
  //     api_filter['sourcedBy-eq'] = this.userDetails.id;
  //   }
  //   if (api_filter) {
  //     console.log(api_filter);
  //     this.getCallBacksCount(api_filter);
  //     this.getCallBacks(api_filter);
  //   }
  // }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.callBacksTable.reset();
    }
  }

  // inputValueChangeEventConvertedCallback(dataType, value) {
  //   if (value == '') {
  //     this.searchFilterConverted = {};
  //     this.convertedcallBacksTable.reset();
  //   }
  // }
  getCallBacksCount(filter = {}) {
    this.leadsService.getCallBacksCount(filter).subscribe(
      (response) => {
        this.callBacksCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getCallBacks(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getCallBacks(filter).subscribe(
      (callBacks) => {
        this.callBacks = callBacks;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  filterWithCallBackId() {
    let searchFilter = { 'callBackId-like': this.callBackIdToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadCallBacks(this.currentTableEvent);
  }

  filterWithBusinessName() {
    let searchFilter = {};
    const trimmedInput = this.businessNameToSearch?.trim() || '';

    if (this.isPhoneNumber(trimmedInput)) {
      // console.log('Dectected Phone number:', trimmedInput);
      searchFilter = { 'phone-like': trimmedInput }
    } else {
      // console.log("Detected business name:", trimmedInput);
      searchFilter = { 'businessName-like': this.businessNameToSearch }
    }
    // console.log("Search Filter Object:", searchFilter);
    this.applyFilters(searchFilter);
  }

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[6-9]\d{9}$/;
    return phoneNumberPattern.test(value.trim())
  }

  filterWithPersonName() {
    let searchFilter = {};
    const trimmedInput = this.personNameToSearch?.trim() || '';
    if (this.isPhoneNumber(trimmedInput)) {
      // console.log('Detected phone number:', trimmedInput);
      searchFilter = { 'phone-like': trimmedInput }
    } else {
      // console.log("Detected Person Name:", trimmedInput);
      searchFilter = { 'businessName-like': trimmedInput }
    }
    // console.log("search Filter Object:", searchFilter);
    this.applyFiltersForPersonal(searchFilter);
  }

  applyFiltersForPersonal(searchFilterPersonal = {}) {
    this.searchFilterPersonal = searchFilterPersonal;
    this.loadCallbackTypes('personal');
  }
  // filterWithBusinessNameConverted() {
  //   let searchFilterConverted = {
  //     'businessName-like': this.businessNameConvertedCallback,
  //   };
  //   this.applyFiltersConverted(searchFilterConverted);
  // }

  // applyFiltersConverted(searchFilterConverted = {}) {
  //   this.searchFilterConverted = searchFilterConverted;
  //   this.loadConvertedCallBacks(this.currentTableEvent);
  // }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCallbackStatus',
      event.value
    );
    this.loadCallBacks(this.currentTableEvent);
  }
  statusChangesourcedBy(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCallbackSourcedByStatus',
      event.value
    );
    this.loadCallBacks(this.currentTableEvent);
  }

  // statusChangeConverted(event) {
  //   this.loadConvertedCallBacks(this.currentTableEvent);
  // }



  onLoanTypeSelect(event: any): void {
    // console.log('Selected Loan Type:', event.value);
    this.selectedLoanType = event.value;
    // if (this.selectedLoanType == 'businessLoan') {
    //   this.createCallBack();
    // } else {
    this.createSecuredCallBack();
    // }
  }


}


