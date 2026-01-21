

import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {

   users: any = [];
  loading = false;
  userNameToSearch: any;
  apiLoading: any;
  currentTableEvent: any;
  searchFilter: any = {};
  appliedFilter: {};
  accounts: any = [];
   accountsCount: any = 0;
  @ViewChild('userTable') userTable!: Table;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // loadUsers() {
  //   this.loading = true;
  //   this.http.get<any[]>('http://localhost:5002/adminusers')
  //     .subscribe(res => {
  //       this.users = res;
  //       this.loading = false;
  //     });
  // }

   loadUsers() {
    this.loading = true;
    this.leadsService.getUsers().subscribe(res => {
      this.users = res;
      this.loading = false;
    });
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadAccounts(this.currentTableEvent);
  }

   inputValueChangeEvent(dataType, value) {
    console.log(value);
    
    if (value == '') {
      this.searchFilter = {};
      this.userTable.reset();
    }
  }
  
  filterWithName() {
    let searchFilter = { 'name-like': this.userNameToSearch };
    this.applyFilters(searchFilter);
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

   getTeamCount(filter = {}) {
    this.leadsService.getTeamCounts(filter).subscribe(
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
    this.leadsService.getUsers(filter).subscribe(
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


  goToCreate() {
    this.router.navigate(['admin/users/create']);
  }

  editUser(id: number) {
    this.router.navigate(['admin/users/update', id]);
  }

  goBack() {
    this.location.back();
  }
}
