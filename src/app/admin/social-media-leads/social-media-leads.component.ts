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
  selector: 'app-social-media-leads',
  templateUrl: './social-media-leads.component.html',
  styleUrls: ['./social-media-leads.component.scss']
})
export class SocialMediaLeadsComponent {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  currentTableEvent: any;
  userNameToSearch: any;
  socialMediaLeads: any = []
  socialMediaLeadsCount: any = 0;
  loading: any;
  apiLoading: any;
  appliedFilter: {};
  filterConfig: any[] = [];
  capabilities: any;
   accountsCount: any = 0;
  version = projectConstantsLocal.VERSION_DESKTOP;
  @ViewChild('SocialMediaLeadsTable') socialMediaLeadsTable!: Table;
  constructor(
    private location: Location,
    private routingService: RoutingService,
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
  // getSocialMediaLeads() {
  //   this.leadsService.getSocialMediaLeads().subscribe(
  //     (data) => {
  //       this.socialMediaLeads = data;
  //       console.log('✅ Data received:', this.socialMediaLeads);
  //       // this.socialMediaLeadsCount = data.length;
  //     },
  //     (error) => {
  //       this.toastService.showError('Error fetching social media leads');
  //     }
  //   );
  //   // console.log(this.socialMediaLeads);
  // }
  // applyFilters(searchFilter = {}) {
  //   this.searchFilter = searchFilter;
  //   this.loadAccounts(this.currentTableEvent);
  // }
  getSocilaMediaCount(filter={}){
    this.leadsService.getSocilaMediaCount().subscribe(
      (socialmediaCount) => {
        this.socialMediaLeadsCount = socialmediaCount;
        console.log(this.socialMediaLeadsCount);
        
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }


   loadsocialmediaLeads(event) {
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
      this.getSocilaMediaCount(api_filter);
      this.getSocialMediaLeads(api_filter);
    }
  }
  getSocialMediaLeads(filter = {}) {
  this.apiLoading = true;
  console.log('Fetching social media leads...');
  this.leadsService.getSocialMediaLeads(filter).subscribe(
    (data) => {
      console.log('Raw API response:', data);
      this.socialMediaLeads = data;
      this.apiLoading = false;
      console.log('Data received and assigned:', this.socialMediaLeads);
    },
    (error) => {
      console.error('API error:', error);
      this.toastService.showError('Error fetching social media leads');
    }
  );
  
}

  // loadAccounts(event) {
  //   // console.log(event);
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

  //   api_filter = Object.assign(
  //     {},
  //     api_filter,
  //     this.searchFilter,
  //     this.appliedFilter
  //   );

  //   if (api_filter) {
  //     // console.log(api_filter);
  //     this.getTeamCount(api_filter);
  //     this.getTeam(api_filter);
  //   }
  // }
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
        this.socialMediaLeads = team;
        this.apiLoading = false;
      },
      (error: any) => {
        this.toastService.showError(error);
        this.apiLoading = false;
      }
    );
  }
  viewAccount(event) {
    const user = event.data
    this.routingService.handleRoute('team/view/' + user.id, null);
  }

  goBack() {
    this.location.back();
  }

  // ngOnInit() {
  //   console.log('SocialMediaLeadsComponent loaded!');
  //   this.loadLeads();
  // }
}



