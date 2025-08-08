import { Component, OnInit, ViewChild } from "@angular/core";
import { projectConstantsLocal } from "src/app/constants/project-constants";
import { LeadsService } from "../leads/leads.service";
import { ToastService } from "../../services/toast.service";
import { Table } from "primeng/table";
import { Location } from "@angular/common";
import { RoutingService } from "../../services/routing-service";
import { MenuItem } from "primeng/api";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, forkJoin, map, of, switchMap } from "rxjs";

@Component({
  selector: "app-partial-files",
  templateUrl: "./partial-files.component.html",
  styleUrl: "./partial-files.component.scss"
})
export class PartialFilesComponent {
  // leads: any = [];
  // loading: any;
  // totalLeadsCount: any = 0;
  // businessNameToSearch: any;
  // leadIdToSearch: any;
  // mobileNumberToSearch: any;
  // appliedFilter: {};
  // userDetails: any;
  // filterConfig: any[] = [];
  // leadStatus: any = projectConstantsLocal.LEAD_STATUS;
  // hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  // currentTableEvent: any;
  // selectedSoucedByStatus: any;
  // leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  // turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  // entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  // natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  // searchFilter: any = {};
  // @ViewChild('leadsTable') leadsTable!: Table;
  // breadCrumbItems: any = [];
  // leadSources: any = [];
  // leadUsers: any = [];
  // apiLoading: any;
  // version = projectConstantsLocal.VERSION_DESKTOP;
  // constructor(
  //   private leadsService: LeadsService,
  //   private toastService: ToastService,
  //   private location: Location,
  //   private route: ActivatedRoute,
  //   private routingService: RoutingService,
  //   private localStorageService: LocalStorageService
  // ) {
  //   this.breadCrumbItems = [
  //     {
  //
  //       label: ' Home',
  //       routerLink: '/user/dashboard',
  //       queryParams: { v: this.version },
  //     },
  //     { label: 'Partial Files' },
  //   ];
  //   this.getLeadUsers();
  // }
  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     this.selectedSoucedByStatus = {
  //       id: params['id'],
  //       name: params['name'],
  //     };
  //   });
  //   let userDetails =
  //     this.localStorageService.getItemFromLocalStorage('userDetails');
  //   this.userDetails = userDetails.user;
  //   this.setFilterConfig();
  //   const storedAppliedFilter =
  //     this.localStorageService.getItemFromLocalStorage('partialsAppliedFilter');
  //   if (storedAppliedFilter) {
  //     this.appliedFilter = storedAppliedFilter;
  //   }
  //   const storedStatus =
  //     this.localStorageService.getItemFromLocalStorage('selectedPartials');
  //   if (storedStatus) {
  //     this.selectedSoucedByStatus = storedStatus;
  //   }
  // }
  // loadLeads(event) {
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   api_filter['leadInternalStatus-eq'] = 4;
  //   if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
  //     if (this.selectedSoucedByStatus.name == 'All') {
  //       api_filter['leadInternalStatus-eq'] = '4';
  //     } else {
  //       api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
  //     }
  //   }
  //   api_filter = Object.assign(
  //     {},
  //     api_filter,
  //     this.searchFilter,
  //     this.appliedFilter
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
  //     this.getTotalLeadsCount(api_filter);
  //     this.getTotalLeads(api_filter);
  //   }
  // }
  // actionItems(lead: any): MenuItem[] {
  //   const menuItems: any = [
  //     {
  //       label: 'Actions',
  //       items: [
  //         {
  //           label: 'Send to Leads',
  //           icon: 'pi pi-sign-in',
  //           command: () => this.revertLeadToNew(lead),
  //         },
  //         ...(this.userDetails?.userType && this.userDetails.userType !== '5'
  //           ? [
  //               {
  //                 label: 'Send to Credit Evaluation',
  //                 icon: 'pi pi-dollar',
  //                 command: () => this.sendFileToCreditEvaluation(lead),
  //               },
  //             ]
  //           : []),
  //       ],
  //     },
  //   ];
  //   return menuItems;
  // }
  // sendFileToCreditEvaluation(lead) {
  //   console.log(lead);
  //   this.createDscrTable(lead);
  //   this.changeLeadStatus(lead.id, 5);
  // }
  // setFilterConfig() {
  //   this.filterConfig = [
  //     {
  //       header: 'Lead Id',
  //       data: [
  //         {
  //           field: 'id',
  //           title: 'Lead Id',
  //           type: 'text',
  //           filterType: 'like',
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Business Name',
  //       data: [
  //         {
  //           field: 'businessName',
  //           title: 'Business Name',
  //           type: 'text',
  //           filterType: 'like',
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Date Range',
  //       data: [
  //         {
  //           field: 'createdOn',
  //           title: 'From',
  //           type: 'date',
  //           filterType: 'gte',
  //         },
  //         { field: 'createdOn', title: 'To', type: 'date', filterType: 'lte' },
  //       ],
  //     },
  //     {
  //       header: 'Phone Number',
  //       data: [
  //         {
  //           field: 'primaryPhone',
  //           title: 'Phone Number',
  //           type: 'text',
  //           filterType: 'like',
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Business Entity',
  //       data: [
  //         {
  //           field: 'businessEntity',
  //           title: 'Business Entity',
  //           type: 'dropdown',
  //           filterType: 'like',
  //           options: this.entityDetails.map((entity) => ({
  //             label: entity.displayName,
  //             value: entity.name,
  //           })),
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Contact Person',
  //       data: [
  //         {
  //           field: 'contactPerson',
  //           title: 'Contact Person Name',
  //           type: 'text',
  //           filterType: 'like',
  //         },
  //       ],
  //     },
  //     {
  //       header: 'City',
  //       data: [
  //         {
  //           field: 'city',
  //           title: 'City Name',
  //           type: 'text',
  //           filterType: 'like',
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Business Turnover',
  //       data: [
  //         {
  //           field: 'businessTurnover',
  //           placeholder: 'Select Turnover',
  //           title: 'Business Turnover',
  //           type: 'dropdown',
  //           filterType: 'like',
  //           options: this.turnoverDetails.map((turnover) => ({
  //             label: turnover.displayName,
  //             value: turnover.name,
  //           })),
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Nature Of Business',
  //       data: [
  //         {
  //           field: 'natureOfBusiness',
  //           title: 'Nature of Business',
  //           type: 'dropdown',
  //           filterType: 'like',
  //           options: this.natureofBusinessDetails.map((natureofB) => ({
  //             label: natureofB.displayName,
  //             value: natureofB.name,
  //           })),
  //         },
  //       ],
  //     },
  //     {
  //       header: 'created On  ',
  //       data: [
  //         {
  //           field: 'createdOn',
  //           title: 'Date ',
  //           type: 'date',
  //           filterType: 'like',
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Had Own House',
  //       data: [
  //         {
  //           field: 'hadOwnHouse',
  //           title: 'Had Own House',
  //           type: 'dropdown',
  //           filterType: 'like',
  //           options: this.hadOwnHouse.map((ownHouse) => ({
  //             label: ownHouse.displayName,
  //             value: ownHouse.name,
  //           })),
  //         },
  //       ],
  //     },
  //   ];
  // }
  // applyConfigFilters(event) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this.appliedFilter = {};
  //   } else {
  //     this.appliedFilter = api_filter;
  //   }
  //   this.localStorageService.setItemOnLocalStorage(
  //     'partialsAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadLeads(null);
  // }
  // createDscrTable(lead) {
  //   this.loading = true;
  //   this.leadsService.createDscrTable(lead).subscribe(
  //     (leads) => {
  //       //this.toastService.showSuccess("Id Inserted  into the Dscr Table Changed Successfully")
  //       this.loading = false;
  //       //this.loadLeads(this.currentTableEvent);
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       //this.toastService.showError(error);
  //     }
  //   );
  // }
  // changeLeadStatus(leadId, statusId) {
  //   this.loading = true;
  //   this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
  //     (leads) => {
  //       this.toastService.showSuccess('Lead Status Changed Successfully');
  //       this.loading = false;
  //       this.loadLeads(this.currentTableEvent);
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // revertLeadToNew(lead) {
  //   this.changeLeadStatus(lead.id, 1);
  // }
  // getStatusName(statusId) {
  //   if (this.leadInternalStatusList && this.leadInternalStatusList.length > 0) {
  //     let leadStatusName = this.leadInternalStatusList.filter(
  //       (leadStatus) => leadStatus.id == statusId
  //     );
  //     return (
  //       (leadStatusName &&
  //         leadStatusName[0] &&
  //         leadStatusName[0].displayName) ||
  //       ''
  //     );
  //   }
  //   return '';
  // }
  // getSourceName(userId) {
  //   if (this.leadUsers && this.leadUsers.length > 0) {
  //     let leadUserName = this.leadUsers.filter(
  //       (leadUser) => leadUser.id == userId
  //     );
  //     return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
  //   }
  //   return '';
  // }
  // getTotalLeadsCount(filter = {}) {
  //   this.leadsService.getLeadsCount(filter).subscribe(
  //     (leadsCount) => {
  //       this.totalLeadsCount = leadsCount;
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // getTotalLeads(filter = {}) {
  //   this.apiLoading = true;
  //   this.leadsService.getLeads(filter).pipe(
  //     switchMap((leads: any) => {
  //       this.leads = leads;
  //       const docRequests = leads.map((lead: any) => {
  //         console.log('Fetching documents for lead:', lead.id);  // Debug line
  //         return this.leadsService.getLeadDocumentsById(lead.id).pipe(
  //           map((documents: any) => {
  //             const firstDoc = documents || {};
  //             return {
  //               ...lead,
  //               fileReceivedOn: firstDoc.createdOn ||null ,
  //               fileUploadedBy: firstDoc.createdBy||null
  //             };
  //           }),
  //           catchError((err) => {
  //             console.warn('Error fetching documents for lead:', lead.id, err);
  //             return of({
  //               ...lead,
  //               fileReceivedOn: null,
  //               filecreatedBy: null
  //             });
  //           })
  //         );
  //       });
  //       return forkJoin(docRequests);
  //     })
  //   ).subscribe({
  //     next: (updatedLeads: any) => {
  //       this.leads = updatedLeads;
  //       this.apiLoading = false;
  //       console.log('Final Updated Leads:', this.leads);
  //     },
  //     error: (err) => {
  //       this.apiLoading = false;
  //       this.toastService.showError('Error fetching leads or documents');
  //     }
  //   });
  // }
  // getLeadSources(filter = {}) {
  //   this.loading = true;
  //   this.leadsService.getLeadSources(filter).subscribe(
  //     (leadSources) => {
  //       this.leadSources = leadSources;
  //       this.loading = false;
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // getLeadUsers(filter = {}) {
  //   this.loading = true;
  //   this.leadsService.getUsers(filter).subscribe(
  //     (leadUsers: any) => {
  //       this.leadUsers = [{ name: 'All' }, ...leadUsers];
  //       this.loading = false;
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // filterWithMobileNumber() {
  //   let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
  //   this.applyFilters(searchFilter);
  // }
  // inputValueChangeEvent(dataType, value) {
  //   if (value == '') {
  //     this.searchFilter = {};
  //     this.leadsTable.reset();
  //   }
  // }
  // applyFilters(searchFilter = {}) {
  //   this.searchFilter = searchFilter;
  //   this.loadLeads(this.currentTableEvent);
  // }
  // filterWithBusinessName() {
  //   let searchFilter = { 'businessName-like': this.businessNameToSearch };
  //   this.applyFilters(searchFilter);
  // }
  // statusChange(event) {
  //   this.localStorageService.setItemOnLocalStorage(
  //     'selectedPartials',
  //     event.value
  //   );
  //   this.loadLeads(this.currentTableEvent);
  // }
  // createLead() {
  //   this.routingService.handleRoute('leads/create', null);
  // }
  // viewLead(leadId) {
  //   this.routingService.handleRoute('partial/view/' + leadId, null);
  // }
  // uploadLeadFiles(leadId) {
  //   this.routingService.handleRoute('partial/upload/' + leadId, null);
  // }
  // goBack() {
  //   this.location.back();
  // }
}
