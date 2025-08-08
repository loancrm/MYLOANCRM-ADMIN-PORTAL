import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  currentTableEvent: any;
  userNameToSearch: any;
  users: any = [];
  leadSources: any = [];
  usersStatus: any = projectConstantsLocal.USER_STATUS;
  userTypes = projectConstantsLocal.USER_TYPE;
  usersCount: any = 0;
  loading: any;
  apiLoading: any;
  userRoles: any = [];
  appliedFilter: {};
  filterConfig: any[] = [];
  capabilities: any;
  userDetails: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  @ViewChild('userTable') userTable!: Table;
  selectedTeamStatus = this.usersStatus[1];
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
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Team' },
    ];
    this.getUserRoles();
  }

  ngOnInit(): void {
    this.setFilterConfig();
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage('teamAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedStatus1 =
      this.localStorageService.getItemFromLocalStorage('selectedTeamStatus');
    if (storedStatus1) {
      this.selectedTeamStatus = storedStatus1;
    }
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Employee Id',
        data: [
          {
            field: 'userId',
            title: 'Employee Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Employee Name',
        data: [
          {
            field: 'name',
            title: 'Employee Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Employee Designation',
        data: [
          {
            field: 'userType',
            title: 'Employee Designation',
            type: 'dropdown',
            filterType: 'like',
            options: this.userTypes.map((entity) => ({
              label: entity.displayName,
              value: entity.id,
            })),
          },
        ],
      },
      {
        header: 'Date Range',
        data: [
          {
            field: 'addedOn',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'addedOn', title: 'To', type: 'date', filterType: 'lte' },
        ],
      },
      {
        header: 'Password',
        data: [
          {
            field: 'phone',
            title: 'Password',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Email',
        data: [
          {
            field: 'email',
            title: 'Email',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Joining Date',
        data: [
          {
            field: 'joiningDate',
            title: 'Date ',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'created On  ',
        data: [
          {
            field: 'addedOn',
            title: 'Date ',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
    ];
  }
  getUserRoles(filter = {}) {
    this.leadsService.getUserRoles(filter).subscribe(
      (roles) => {
        this.userRoles = roles;
        // console.log(this.userRoles);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  actionItems(team: any): MenuItem[] {
    // const menuItems: MenuItem[] = [];
    const menuItems: any = [{ label: 'Actions', items: [] }];
    // menuItems[0].items.push({
    //   label: 'Update',
    //   icon: 'pi pi-refresh',
    //   command: () => this.updateUsers(team.id),
    // });
    menuItems[0].items.push({
      label: team.status === 'Active' ? 'Deactivate' : 'Activate',
      icon: 'pi pi-refresh',
      command: () => this.updateStatus(team.id, team.status),
    });
    if (this.capabilities.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(team),
      });
    }
    return menuItems;
  }

  confirmDelete(team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this User ? <br>
              User Name: ${team.name}<br>
              User ID: ${team.userId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUsers(team.id);
      },
    });
  }
  deleteUsers(userId) {
    this.loading = true;
    this.leadsService.deleteUsers(userId).subscribe(
      (response: any) => {
        // console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadTeam(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  updateStatus(userId: number, currentStatus: string) {
    let newStatus: string;
    if (currentStatus === 'Active') {
      newStatus = 'Inactive';
    } else {
      newStatus = 'Active';
    }
    this.leadsService.updateUserStatus(userId, newStatus).subscribe(
      (response) => {
        this.toastService.showSuccess('User status updated successfully');
        const updatedUser = this.users.find((user) => user.id === userId);
        if (updatedUser) {
          updatedUser.status = newStatus;
        }
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  getUserRoleName(userId) {
    if (this.userRoles && this.userRoles.length > 0) {
      let leadUserName = this.userRoles.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
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
    this.loadTeam(null);
  }
  createUsers() {
    this.routingService.handleRoute('team/create', null);
  }
  updateUsers(userId) {
    this.routingService.handleRoute('team/update/' + userId, null);
  }
  viewUser(event) {
    const user = event.data
    this.routingService.handleRoute('team/view/' + user.id, null);
  }
  goBack() {
    this.location.back();
  }

  loadTeam(event) {
    // console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedTeamStatus) {
      if (this.selectedTeamStatus && this.selectedTeamStatus.name) {
        if (this.selectedTeamStatus.name === 'Active') {
          api_filter['status-eq'] = 'Active';
        } else if (this.selectedTeamStatus.name === 'Inactive') {
          api_filter['status-eq'] = 'Inactive';
        } else {
          api_filter['status-or'] = 'Active,Inactive';
        }
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (this.userDetails?.id && this.userDetails?.userType) {
      switch (this.userDetails.userType) {
        case '2':
          api_filter['userType-or'] = '2,3,4,5';
          break;
        case '4':
          api_filter['userType-or'] = '3,4,5';
          break;
        case '5':
          api_filter['userType-or'] = '3,5';
          break;
      }
    }
    if (api_filter) {
      // console.log(api_filter);
      this.getTeamCount(api_filter);
      this.getTeam(api_filter);
    }
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.userTable.reset();
    }
  }

  getTeamCount(filter = {}) {
    this.leadsService.getUsersCount(filter).subscribe(
      (teamsCount) => {
        this.usersCount = teamsCount;
        // console.log(this.usersCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTeam(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getUsers(filter).subscribe(
      (team) => {
        this.users = team;
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
    this.loadTeam(this.currentTableEvent);
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
    this.loadTeam(this.currentTableEvent);
  }
}
