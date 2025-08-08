import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';
@Component({
  selector: 'app-logins-done',
  templateUrl: './logins-done.component.html',
  styleUrl: './logins-done.component.scss',
})
export class LoginsDoneComponent implements OnInit {
  breadCrumbItems: any = [];
  bankerId: string | null = null;
  searchFilter: any = {};
  currentTableEvent: any;
  bankers: any = null;
  loginsDone: any = null;
  businessNameToSearch: any;
  loginsDoneCount: any = 0;
  @ViewChild('lenderTable') lenderTable!: Table;
  loading: boolean = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private leadsService: LeadsService,
    private location: Location,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Lenders',
        routerLink: '/user/bankers',
        queryParams: { v: this.version },
      },
      { label: 'Logins Done ' },
    ];
  }
  ngOnInit(): void {
    this.bankerId = this.route.snapshot.paramMap.get('id');
    if (this.bankerId) {
      this.getBankersDetailsById(this.bankerId);
    }
  }

  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['bankId-eq'] = this.bankerId;
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.getLoginsDoneById(api_filter);
      this.getLoginsDoneCount(api_filter);
    }
  }
  getLoginsDoneCount(filter = {}) {
    this.leadsService.getLoginsDoneCount(filter).subscribe(
      (response) => {
        this.loginsDoneCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.lenderTable.reset();
    }
  }
  getBankersDetailsById(id: string) {
    this.loading = true;
    this.leadsService.getBankersDetailsById(id).subscribe(
      (response) => {
        this.bankers = response;
        // console.log('bankers', this.bankers);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLoginsDoneById(filter = {}) {
    this.loading = true;
    this.leadsService.getLoginsDoneById(filter).subscribe(
      (response) => {
        this.loginsDone = response;
        // console.log('Logins Done ', this.loginsDone);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  viewLead(event: any) {
    // console.log('Row clicked:', event.data);
    const lead = event.data;
    this.routingService.handleRoute('leads/profile/' + lead.leadId, null);
  }
  onRowEditSave(event: any) {
    const lender = event.data;

    const payload = {

      fipRemarks: lender.fipRemarks,
    };

    this.leadsService.updateFipRemark(lender.id, payload).subscribe({
      next: () => {
        this.toastService.showError('Remark updated successfully');
      },
      error: () => {
        this.toastService.showError('Failed to update remark');
      },
    });
  }
  goBack() {
    this.location.back();
  }
}
