import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Table } from 'primeng/table';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LeadsService } from '../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements AfterViewInit {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  currentTableEvent: any;

  userNameToSearch: any;
  accounts: any = [];
  leadSources: any = [];
  accountsCount: any = 0;
  loading: any;
  apiLoading: any;
  appliedFilter: {};
  filterConfig: any[] = [];
  capabilities: any;
  initialFirst: number = 0; // For storing initial pagination position
  initialRows: number = 10;
  version = projectConstantsLocal.VERSION_DESKTOP;
  @ViewChild('accountTable') accountTable!: Table;
  loadingProviderLogin: { [accountId: string]: boolean } = {};
  accountInternalStatusList: any = projectConstantsLocal.ACCOUNTS_STATUS;
  selectedAccountStatus = this.accountInternalStatusList[1];
  loggedInUserRole!: number;
  selectedPlanType: string = 'ALL';

    planTypeOptions = [
      { label: 'All', value: 'ALL' },
      { label: 'Free Trial', value: 'Free Trial' },
      { label: 'Basic', value: 'Basic' },
      { label: 'Premium', value: 'Premium' },
      { label: 'Professional', value: 'Professional' }
    ];

  constructor(
    private routingService: RoutingService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/admin/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Team' },
    ];
  }

  ngOnInit(): void {
    this.restorePaginationState();

    this.setFilterConfig();
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage('accountAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }

   const adminDetails = this.localStorageService.getItemFromLocalStorage('adminDetails');
   console.log(adminDetails);
   

  if (adminDetails && adminDetails.user) {
    this.loggedInUserRole = Number(adminDetails.user.role);
    console.log(this.loggedInUserRole);
    
  }
    
  }
  ngAfterViewInit(): void {
    // Trigger initial load with restored pagination state after view is ready
    if (this.accountTable) {
      const initialEvent = {
        first: this.initialFirst,
        rows: this.initialRows,

        sortOrder: -1,
      };
      // PrimeNG will automatically trigger onLazyLoad, but we ensure it uses our restored values
      this.accountTable.first = this.initialFirst;
      this.accountTable.rows = this.initialRows;
      // Manually trigger the lazy load with restored pagination
      this.loadAccounts(initialEvent);
    }
  }

  restorePaginationState() {
    const storedPage = this.localStorageService.getItemFromLocalStorage(
      'disbursalsCurrentPage'
    );
    const storedRows = this.localStorageService.getItemFromLocalStorage(
      'disbursalsRowsPerPage'
    );

    if (storedPage) {
      const pageNumber = parseInt(storedPage, 10);
      const rowsPerPage = storedRows ? parseInt(storedRows, 10) : 10;

      // Convert page number to first index (page 1 = 0, page 2 = rows, page 3 = rows*2, etc.)
      this.initialFirst = (pageNumber - 1) * rowsPerPage;
      this.initialRows = rowsPerPage;
    }
  }
  actionItems(team: any): MenuItem[] {
    // const menuItems: MenuItem[] = [];
    const menuItems: any = [{ label: 'Actions', items: [] }];
    // menuItems[0].items.push({
    //   label: 'Update',
    //   icon: 'pi pi-refresh',
    //   command: () => this.updateAccount(team.id),
    // });

    return menuItems;
  }
  exportAccountsToCSV() {
    const headers = [
      'Account Id',
      'Name',
      'Business Name',

      'Mobile',
      'Email',
      'City',
      'Plan',
      'Status',
      'Wallet Balance',
      'Created Date',
    ];

    const rows = this.accounts.map((team: any) => [
      team.accountId || '',
      team.name || '',
      team.businessName || '',

      team.mobile || '',
      team.emailId || '',
      team.city || '',
      team.latest_plan_name || '',
      team.latest_status || '',

      team.walletBalance || '',
      team.createdOn ? new Date(team.createdOn).toLocaleDateString() : '',
    ]);

    let csvContent =
      headers.join(',') +
      '\n' +
      rows
        .map((r: string[]) => r.map(this.escapeCSVValue).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Accounts.csv';
    link.click();
  }

  escapeCSVValue(value: any) {
    if (
      typeof value === 'string' &&
      (value.includes(',') || value.includes('"'))
    ) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'Active':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Inactive':
        return { textColor: '#FF555A', backgroundColor: '#FFE2E3' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
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
      'accountAppliedFilter',
      this.appliedFilter
    );
    this.loadAccounts(null);
  }

  updateAccount(accountId) {
    this.routingService.handleRoute('team/update/' + accountId, null);
  }
  goBack() {
    this.location.back();
  }

//   loadAccounts(event) {
//   if (!event) {
//     event = {
//       first: this.initialFirst,
//       rows: this.initialRows,
//       sortOrder: -1,
//     };
//   }

//   this.currentTableEvent = event;

//   // 1️⃣ CREATE api_filter
//   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

//   // 2️⃣ 👉 ADD THIS EXACTLY HERE
//   if (!this.selectedAccountStatus || this.selectedAccountStatus.id === 1) {
//     api_filter['status-eq'] = 1;
//   }

//   // 3️⃣ MERGE OTHER FILTERS
//   api_filter = Object.assign(
//     {},
//     api_filter,
//     this.searchFilter,
//     this.appliedFilter
//   );

//   // 4️⃣ CALL APIs
//   this.getTeamCount(api_filter);
//   this.getTeam(api_filter);
// }
loadAccounts(event) {
  // 1️⃣ Use event or fallback to saved state
  if (!event) {
    event = {
      first: this.initialFirst,
      rows: this.initialRows,
      sortOrder: -1,
    };
  }

  this.currentTableEvent = event;

  // 2️⃣ Save current page and rows to localStorage
  if (event && (event.first !== undefined || event.first === 0)) {
    const rows = event.rows || 10;
    const currentPage =
      event.first === 0 ? 1 : Math.floor(event.first / rows) + 1;

    this.localStorageService.setItemOnLocalStorage(
      'disbursalsCurrentPage',
      currentPage.toString()
    );
    this.localStorageService.setItemOnLocalStorage(
      'disbursalsRowsPerPage',
      rows.toString()
    );

    // Update initial values for future fallback
    this.initialFirst = event.first;
    this.initialRows = rows;
  }

  // 3️⃣ Create API filter from Prime table event
  let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  // 4️⃣ Add default account status filter
  if (!this.selectedAccountStatus || this.selectedAccountStatus.id === 1) {
    api_filter['status-eq'] = 1;
  }

  // 5️⃣ Merge other filters
  api_filter = Object.assign({}, api_filter, this.searchFilter, this.appliedFilter);
  // ✅ APPLY PLAN FILTER ONLY HERE
  if (this.selectedPlanType && this.selectedPlanType !== 'ALL') {
    api_filter['latest_plan_name-eq'] = this.selectedPlanType;
  }
  // 6️⃣ Call APIs
  console.log('API Filter:', api_filter); // <-- for debugging
  this.getTeamCount(api_filter);
  this.getTeam(api_filter);
}

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && this.accountTable) {
      this.accountTable.filterGlobal(target.value, 'contains');
    }
  }
  viewAccount(event) {
    const lead = event.data;
    this.routingService.handleRoute('accounts/profile/' + lead.accountId, null);
  }
  setFilterConfig() {
    const followupDateRangeFilter = () => [
      { field: 'followupDate', title: 'From', type: 'date', filterType: 'gte' },
      { field: 'followupDate', title: 'To', type: 'date', filterType: 'lte' },
    ];
    this.filterConfig = [
      {
        header: 'Account Id',
        data: [
          {
            field: 'accountId',
            title: 'Account Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Name',
        data: [
          {
            field: 'name',
            title: 'Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Latest Plan',
        data: [
          {
            field: 'latest_plan_name',
            title: 'Plan',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Latest Status',
        data: [
          {
            field: 'latest_status',
            title: 'Status',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Latest Remark',
        data: [
          {
            field: 'latest_remark',
            title: 'Latest Remark',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Mobile',
        data: [
          {
            field: 'mobile',
            title: 'Mobile',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Email ID',
        data: [
          {
            field: 'emailId',
            title: 'Email ID',
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
            title: 'City',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      // {
      //   header: 'Plan',
      //   data: [
      //     {
      //       field: 'latest_plan_name',
      //       title: 'Plan',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },
      // {
      //   header: 'Status',
      //   data: [
      //     {
      //       field: 'latest_status',
      //       title: 'Status',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },
      { header: 'FollowUp Date Range', data: followupDateRangeFilter() },

      {
        header: 'Date Range',
        data: [
          {
            field: 'createdOn',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },

      {
        header: 'Last Updated Date Range',
        data: [
          {
            field: 'updatedOn',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'updatedOn',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
    ];
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.accountTable.reset();
    }
  }

  getTeamCount(filter = {}) {
    this.leadsService.getAccountsCount(filter).subscribe(
      (teamsCount) => {
        this.accountsCount = teamsCount;
        // console.log(this.accountsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTeam(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getAccounts(filter).subscribe(
      (team) => {
        this.accounts = team;
        this.apiLoading = false;
      },
      (error: any) => {
        this.toastService.showError(error);
        this.apiLoading = false;
      }
    );
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadAccounts(this.currentTableEvent);
  }

  filterWithName() {
  let searchFilter = {};
  const trimmedInput = this.userNameToSearch?.trim() || '';

  if (!trimmedInput) {
    this.applyFilters({});
    return;
  }

  // ✅ Account ID (numeric but NOT 10-digit mobile)
  if (this.isNumeric(trimmedInput) && trimmedInput.length !== 10) {
    searchFilter = { 'accountId-like': trimmedInput };
  }

  // ✅ Mobile Number (10-digit)
  else if (this.isPhoneNumber(trimmedInput)) {
    searchFilter = { 'mobile-like': trimmedInput };
  }

  // ✅ Business Name
  else {
    searchFilter = {
      'businessName-like': trimmedInput,
    };
  }

  this.applyFilters(searchFilter);
}


  isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[6-9]\d{9}$/;
    return phoneNumberPattern.test(value.trim());
  }

  // statusChange(event) {
  //   this.localStorageService.setItemOnLocalStorage(
  //     'selectedTeamStatus',
  //     event.value
  //   );
  //   this.loadAccounts(this.currentTableEvent);
  // }

  onLoginAsProvider(account: any): void {
    const accountId = account.accountId;

    if (!accountId) {
      alert('Account ID is missing');
      return;
    }

    // Confirm action
    if (
      !confirm(
        `Are you sure you want to login as provider for account ${accountId}?`
      )
    ) {
      return;
    }

    // Show loading state
    this.loadingProviderLogin[accountId] = true;

    this.leadsService
      .loginAsProviderAndRedirect(accountId)
      .then(() => {
        // Success - redirect happens automatically
        this.loadingProviderLogin[accountId] = false;
      })
      .catch((error) => {
        // Handle error
        this.loadingProviderLogin[accountId] = false;
        const errorMessage =
          error.error?.message ||
          error.message ||
          'Failed to login as provider';
        alert(errorMessage);
        console.error('Provider login error:', error);
      });
  }

  sendAccountToArchive(team) {
    this.changeAccountInternalStatus(team.accountId, 2);
  }

  changeAccountInternalStatus(accountId, statusId) {
    this.loading = true;
    this.leadsService.changeAccountInternalStatus(accountId, statusId).subscribe(
      (remarks) => {
        this.toastService.showSuccess('Account Status Changed Successfully');
        this.loading = false;
        this.loadAccounts(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  
  revertAccountToNew(team) {
    this.changeAccountInternalStatus(team.accountId, 1);
  }

  loadRemarks(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    // if (this.selectedRemarksStatus) {
    //   if (this.selectedRemarksStatus && this.selectedRemarksStatus.name) {
    //     if (this.selectedRemarksStatus.name != 'all') {
    //       api_filter['remarkInternalStatus-eq'] = this.selectedRemarksStatus.id;
    //     } else {
    //       api_filter['remarkInternalStatus-or'] = '1,2';
    //     }
    //   }
    // } else {
    //   api_filter['remarkInternalStatus-or'] = '1,2';
    // }
    // api_filter = Object.assign({}, api_filter, this.searchFilter);
    // if (api_filter) {
    //   this.getRemarksCount(api_filter);
    //   this.getRemarks(api_filter);
    // }
  }

  getStatusName(statusId) {
    if (this.accountInternalStatusList && this.accountInternalStatusList.length > 0) {
      let leadStatusName = this.accountInternalStatusList.filter(
        (leadStatus) => leadStatus.id == statusId
      );
      return (
        (leadStatusName &&
          leadStatusName[0] &&
          leadStatusName[0].name) ||
        ''
      );
    }
    return '';
  }

  statusChange(event) {
  const selectedStatus = event.value.id; // 0, 1, 2

  // Clear old filters
  delete this.searchFilter['status-eq'];
  delete this.searchFilter['status-or'];

  if (selectedStatus === 0) {
    // ALL → show 1 and 2
    this.searchFilter['status-or'] = '1,2';
  } else {
    // Active or Inactive
    this.searchFilter['status-eq'] = selectedStatus;
  }

  this.loadAccounts(this.currentTableEvent);
}

onPlanTypeChange(event: any) {
  this.selectedPlanType = event.value;
  this.accountTable.reset(); // reload table + API
}



}
