import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { Table } from 'primeng/table';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-followups',
  templateUrl: './followups.component.html',
  styleUrl: './followups.component.scss',
})
export class FollowupsComponent implements OnInit {
  currentTableEvent: any;
  selectedSoucedByStatus: any;
  leadUsers: any = [];
  searchFilter: any = {};
  breadCrumbItems: any = [];
  filterConfig: any[] = [];
  leads: any = [];
  mobileNumberToSearch: any;
  businessNameToSearch: any;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;

  @ViewChild('leadsTable') leadsTable!: Table;

  totalLeadsCount: any = 0;
  loading: any;
  userDetails: any;
  appliedFilter: {};
  apiLoading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Follow Ups' },
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
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage(
        'followupsAppliedFilter'
      );
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedStatus =
      this.localStorageService.getItemFromLocalStorage('selectedFollowups');
    if (storedStatus) {
      this.selectedSoucedByStatus = storedStatus;
    }
  }

  actionItems(lead: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    const userTypeIsNot3 =
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType !== '3';
    // menuItems[0].items.push({
    //   label: 'Update Lead',
    //   icon: 'pi pi-sign-in',
    //   command: () => this.updateLead(lead.id),
    // });
    menuItems[0].items.push({
      label: 'Send To New Lead',
      icon: 'pi pi-sign-in',
      command: () => this.sendToLead(lead),
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
      // menuItems[0].items.push({
      //   label: 'Send to Partial',
      //   icon: 'pi pi-sign-in',
      //   command: () => this.sendLeadToPartialFiles(lead),
      // });
    }

    return menuItems;
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
  sendLeadToFiles(lead) {
    this.changeLeadStatus(lead.id, 3);
    this.createleadDocumentsTable(lead);
  }
  sendToLead(lead) {
    this.changeLeadStatus(lead.id, 1);
  }

  sendLeadToPartialFiles(lead) {
    this.changeLeadStatus(lead.id, 4);
    this.createleadDocumentsTable(lead);
  }
  createleadDocumentsTable(lead) {
    this.loading = true;
    this.leadsService.createleadDocumentsTable(lead).subscribe(
      (leads) => {
        this.loading = false;
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
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 16;
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['leadInternalStatus-eq'] = '16';
      } else {
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
      this.getTotalLeadsCount(api_filter);
      this.getTotalLeads(api_filter);
    }
  }
  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getLeads(filter).subscribe(
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
  getTotalLeadsCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
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

  viewLead(event: any) {
    console.log('Row clicked:', event.data);
    const lead = event.data;
    this.routingService.handleRoute('leads/profile/' + lead.id, null);
  }
  // viewLead(leadId) {
  //   this.routingService.handleRoute('leads/profile/' + leadId, null);
  // }
  updateLead(leadId) {
    this.routingService.handleRoute('leads/update/' + leadId, null);
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
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedFollowups',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
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
      'followupsAppliedFilter',
      this.appliedFilter
    );
    this.loadLeads(null);
  }
  goBack() {
    this.location.back();
  }
}
