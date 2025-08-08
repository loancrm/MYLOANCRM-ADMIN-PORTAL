import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'app-bankers',
  templateUrl: './bankers.component.html',
  styleUrl: './bankers.component.scss',
})
export class BankersComponent implements OnInit {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  currentTableEvent: any;
  bankers: any = [];
  bankersCount: any = 0;
  loading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  bankersStatus: any = projectConstantsLocal.BANKERS_STATUS;
  selectedBankersStatus = this.bankersStatus[1];
  bankersIdToSearch: any;
  bankersNameToSearch: any;
  capabilities: any;
  apiLoading: any;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  @ViewChild('bankersTable') bankersTable!: Table;
  constructor(
    private routingService: RoutingService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Lenders' },
    ];
  }
  ngOnInit(): void {
    const storedStatus = this.localStorageService.getItemFromLocalStorage(
      'selectedBankersStatus'
    );
    if (storedStatus) {
      this.selectedBankersStatus = storedStatus;
    }
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
  }
  actionItems(bankers: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    // menuItems[0].items.push({
    //   label: 'view',
    //   icon: 'pi pi-sign-in',
    //   command: () => this.viewLead(bankers.id),
    // });
    menuItems[0].items.push({
      label: 'Update',
      icon: 'pi pi-sign-in',
      command: () => this.updateBankers(bankers.id),
    });
    if (bankers.bankerInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'Archive',
        icon: 'pi pi-sign-in',
        command: () => this.sendBankersToArchive(bankers),
      });
    } else if (bankers.bankerInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Send to New Lenders',
        icon: 'pi pi-sign-in',
        command: () => this.revertBankersToNew(bankers),
      });
    }
    if (this.capabilities.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(bankers),
      });
    }
    return menuItems;
  }
  confirmDelete(bankers) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Lender ? <br>
              Lender Name: ${bankers.name}<br>
              Lender ID: ${bankers.bankerId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteBanker(bankers.bankerId);
      },
    });
  }
  deleteBanker(bankerId) {
    this.loading = true;
    this.leadsService.deleteBanker(bankerId).subscribe(
      (response: any) => {
        // console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadBankers(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  sendBankersToArchive(bankers) {
    this.changeBankersStatus(bankers.id, 2);
  }

  revertBankersToNew(bankers) {
    this.changeBankersStatus(bankers.id, 1);
  }
  // viewLead(leadId) {
  //   this.routingService.handleRoute('bankers/banker-profile/' + leadId, null);
  // }
  viewLead(event) {
    const lender = event.data
    this.routingService.handleRoute('bankers/banker-profile/' + lender.id, null);
  }
  viewLoginsDone(leadId) {
    this.routingService.handleRoute('bankers/loginsDone/' + leadId, null);
  }

  changeBankersStatus(bankersId, statusId) {
    this.loading = true;
    this.leadsService.changeBankersStatus(bankersId, statusId).subscribe(
      (bankers) => {
        this.toastService.showSuccess('Bankers Status Changed Successfully');
        this.loading = false;
        this.loadBankers(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'New':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Archived':
        return { textColor: '#FF555A', backgroundColor: '#FFE2E3' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  getStatusName(statusId) {
    if (this.leadInternalStatusList && this.leadInternalStatusList.length > 0) {
      let leadStatusName = this.leadInternalStatusList.filter(
        (leadStatus) => leadStatus.id == statusId
      );
      return (
        (leadStatusName &&
          leadStatusName[0] &&
          leadStatusName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedBankersStatus',
      event.value
    );
    this.loadBankers(this.currentTableEvent);
  }
  createBankers() {
    this.routingService.handleRoute('bankers/create', null);
  }
  updateBankers(bankersId) {
    this.routingService.handleRoute('bankers/update/' + bankersId, null);
  }
  goBack() {
    this.location.back();
  }
  loadBankers(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedBankersStatus) {
      if (this.selectedBankersStatus && this.selectedBankersStatus.name) {
        if (this.selectedBankersStatus.name != 'all') {
          api_filter['bankerInternalStatus-eq'] = this.selectedBankersStatus.id;
        } else {
          api_filter['bankerInternalStatus-or'] = '1,2';
        }
      }
    } else {
      api_filter['bankerInternalStatus-or'] = '1,2';
    }
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.getBankersCount(api_filter);
      this.getBankers(api_filter);
    }
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.bankersTable.reset();
    }
  }

  getBankersCount(filter = {}) {
    this.leadsService.getBankersCount(filter).subscribe(
      (leadsCount) => {
        this.bankersCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getBankers(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getBankers(filter).subscribe(
      (bankers) => {
        this.bankers = bankers;
        this.apiLoading = false;
        // console.log(bankers);
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  filterWithBankersId() {
    let searchFilter = { 'bankersId-like': this.bankersIdToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadBankers(this.currentTableEvent);
  }

  filterWithBankersName() {
    let searchFilter = { 'name-like': this.bankersNameToSearch };
    this.applyFilters(searchFilter);
  }
  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }
}
