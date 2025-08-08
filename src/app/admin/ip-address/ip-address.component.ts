import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService } from 'primeng/api';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-ip-address',
  templateUrl: './ip-address.component.html',
  styleUrl: './ip-address.component.scss',
})
export class IpAddressComponent implements OnInit {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  searchFilter: any = {};
  filterConfig: any[] = [];
  appliedFilter: {};
  loading: any;
  ipAddressCount: any = 0;
  ipAddress: any = [];
  capabilities: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Ip Address' },
    ];
  }
  ngOnInit(): void {
    this.setFilterConfig();
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
  }

  // setFilterConfig() {
  //   this.filterConfig = [
  //     {
  //       header: 'Ip Address',
  //       data: [
  //         {
  //           field: 'ipAddress',
  //           title: 'Ip Address',
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
  //   ];
  // }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Ip Address Id',
        data: [
          {
            field: 'ipAddressId',
            title: 'Ip Address Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Name',
        data: [
          {
            field: 'ipAddressName',
            title: 'Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'IP Address',
        data: [
          {
            field: 'ipAddress',
            title: 'IP Address',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Created Date Range',
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
  }
  loadIpAddress(event) {
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
      this.getIpAddressCount(api_filter);
      this.getIpAddress(api_filter);
    }
  }

  getIpAddressCount(filter = {}) {
    this.leadsService.getIpAddressCount(filter).subscribe(
      (response) => {
        this.ipAddressCount = response;
        // console.log(this.ipAddressCount);
      },
      (error: any) => {
        this.toastService.showError('error occurs');
      }
    );
  }

  getIpAddress(filter = {}) {
    this.loading = true;
    this.leadsService.getIpAddress(filter).subscribe(
      (response) => {
        this.ipAddress = response;
        // console.log(this.ipAddress);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  confirmDelete(ipAddress) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Ip Address ? <br>
              Ip Address Name: ${ipAddress.ipAddressName}<br>
              Ip Address ID: ${ipAddress.ipAddressId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteIpAddress(ipAddress.ipAddressId);
      },
    });
  }

  deleteIpAddress(ipAddressId) {
    this.loading = true;
    this.leadsService.deleteIpAddress(ipAddressId).subscribe(
      (response: any) => {
        // console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadIpAddress(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.loadIpAddress(null);
  }
  createIpAddress() {
    this.routingService.handleRoute('ipAddress/create', null);
  }
  updateIpAddress(ipAddressId) {
    this.routingService.handleRoute('ipAddress/update/' + ipAddressId, null);
  }
  goBack() {
    this.location.back();
  }
}
