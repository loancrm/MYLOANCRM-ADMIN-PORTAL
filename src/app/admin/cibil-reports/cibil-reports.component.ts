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
  selector: 'app-cibil-reports',
  templateUrl: './cibil-reports.component.html',
  styleUrl: './cibil-reports.component.scss'
})
export class CibilReportsComponent {
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
  selectedReportType: string = 'ALL';

    reportTypeOptions = [
      { label: 'All', value: 'ALL' },
      { label: 'Experian', value: 'experian' },
      { label: 'CIBIL', value: 'cibil' },
      { label: 'CRIF', value: 'crif' },
      { label: 'Equifax', value: 'equifax' }
    ];

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
    this.loadCibilReports(null);
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

  loadCibilReports(event) {
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
    this.leadsService.getFetchedCibilReportsCount(filter).subscribe(
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
    this.leadsService.getFetchedCibilReports(filter).subscribe(
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
    this.loadCibilReports(this.currentTableEvent);
  }

  // filterWithName() {
  //   let searchFilter = { 'name-like': this.userNameToSearch };
  //   this.applyFilters(searchFilter);
  // }
   filterWithName() {
  let searchFilter = {};
  const trimmedInput = this.userNameToSearch?.trim() || '';

  if (!trimmedInput) {
    this.applyFilters({});
    return;
  }

  // ✅ Account ID (numeric but NOT 10-digit mobile)
  if (this.isNumeric(trimmedInput) && trimmedInput.length !== 10) {
    searchFilter = { 'accountId-like': trimmedInput };
  }

  // ✅ Mobile Number (10-digit)
  else if (this.isPhoneNumber(trimmedInput)) {
    searchFilter = { 'mobile-like': trimmedInput };
  }

  // ✅ Business Name
  else {
    searchFilter = {
      'name-like': trimmedInput,
    };
  }

  this.applyFilters(searchFilter);
}
 isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[6-9]\d{9}$/;
    return phoneNumberPattern.test(value.trim());
  }

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedTeamStatus',
      event.value
    );
    this.loadCibilReports(this.currentTableEvent);
  }

  exportCibilReportsToCSV() {
  const headers = [
    'Account Id',
    'Name',
    'Mobile',
    'Pan',
    'City',
    'Aadhar',
    'Gender',
    'Consent',
    'Credit Score',
    'Status',
    'Download URL',
    'Created On'
  ];

  const rows = this.accounts.map((report: any) => [
    report.accountId || '',
    report.name || '',
    report.mobile || '',
    report.pan || '',
    report.city || '',
    report.aadhar_number || '',
    report.gender || '',
    report.consent || '',
    report.credit_score || '',
    report.status || '',
    report.uploaded_url ? `https://${report.uploaded_url}` : '',
    report.created_at
      ? new Date(report.created_at).toLocaleDateString()
      : ''
  ]);

  const csvContent =
    headers.join(',') +
    '\n' +
    rows.map(r => r.map(this.escapeCSVValue).join(',')).join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Cibil_Reports.csv';
  link.click();
}
escapeCSVValue(value: any) {
  if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
    value = `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

onReportTypeChange(event: any) {
  // remove both filters first
  delete this.searchFilter['report_type-eq'];
  delete this.searchFilter['report_type-nin'];

  // apply filter only if NOT ALL
  if (event.value !== 'ALL') {
    this.searchFilter['report_type-eq'] = event.value;
  }

  this.accountTable.reset(); // reload table + API
}


//   exportCibilReportsToCSV() {
//   const headers = [
//     'Account Id',
//     'Name',
//     'Mobile',
//     'Pan',
//     'City',
//     'Aadhar',
//     'Gender',
//     'Consent',
//     'Credit Score',
//     'Status',
//     'Created On'
//   ];

//   const rows = this.accounts.map((report: any) => [
//     report.accountId || '',
//     report.name || '',
//     report.mobile || '',
//     report.pan || '',
//     report.city || '',
//     report.aadhar_number || '',
//     report.gender || '',
//     report.consent || '',
//     report.credit_score || '',
//     report.status || '',
//     report.created_at
//       ? new Date(report.created_at).toLocaleDateString()
//       : ''
//   ]);

//   const csvContent =
//     headers.join(',') +
//     '\n' +
//     rows.map(row => row.map(this.escapeCSVValue).join(',')).join('\n');

//   const blob = new Blob([csvContent], {
//     type: 'text/csv;charset=utf-8;'
//   });

//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'Cibil_Reports.csv';
//   link.click();
// }
// escapeCSVValue(value: any) {
//   if (
//     typeof value === 'string' &&
//     (value.includes(',') || value.includes('"'))
//   ) {
//     value = `"${value.replace(/"/g, '""')}"`;
//   }
//   return value;
// }


}
