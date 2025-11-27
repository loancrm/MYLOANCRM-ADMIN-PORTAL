import { Component, ViewChild } from '@angular/core';
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
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
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
  version = projectConstantsLocal.VERSION_DESKTOP;
  @ViewChild('accountTable') accountTable!: Table;

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
    this.setFilterConfig();
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
      'Created Date'
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
      team.createdOn ? new Date(team.createdOn).toLocaleDateString() : ''
    ]);

    let csvContent =
      headers.join(',') +
      '\n' +
      rows.map((r: string[]) => r.map(this.escapeCSVValue).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Accounts.csv';
    link.click();
  }

  escapeCSVValue(value: any) {
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
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
      'teamAppliedFilter',
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

  loadAccounts(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );

    if (api_filter) {
      // console.log(api_filter);
      this.getTeamCount(api_filter);
      this.getTeam(api_filter);
    }
  }
  viewAccount(event) {
    const lead = event.data
    this.routingService.handleRoute('accounts/profile/' + lead.accountId, null);
  }
  setFilterConfig() {

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
    let searchFilter = { 'name-like': this.userNameToSearch };
    this.applyFilters(searchFilter);
  }

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedTeamStatus',
      event.value
    );
    this.loadAccounts(this.currentTableEvent);
  }
}
