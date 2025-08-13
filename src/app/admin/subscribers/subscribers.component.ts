import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';
import { LeadsService } from '../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent {
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
  viewAccount(event) {
    const user = event.data
    this.routingService.handleRoute('team/view/' + user.id, null);
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

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.accountTable.reset();
    }
  }

  getTeamCount(filter = {}) {
    this.leadsService.getSubscibersCount(filter).subscribe(
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
    this.leadsService.getsubscribers(filter).subscribe(
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
