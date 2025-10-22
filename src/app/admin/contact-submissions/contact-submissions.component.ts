import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Table } from 'primeng/table';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LeadsService } from '../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
@Component({
  selector: 'app-contact-submissions',
  templateUrl: './contact-submissions.component.html',
  styleUrl: './contact-submissions.component.scss'
})
export class ContactSubmissionsComponent {
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
    this.leadsService.getContactsCount(filter).subscribe(
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
    this.leadsService.getContacts(filter).subscribe(
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

//   exportToExcel() {
//   // Define the data you want to export
//   const exportData = this.accounts.map((team: any) => ({
//     'Contact Id': team.contactId || '',
//     'Business Name': team.company_name || '',
//     'Person Name': team.full_name || '',
//     'Mobile': team.phone || '',
//     'Email': team.email || '',
//     'Message': team.message || '',
//     'Created Date': team.submitted_on
//       ? new Date(team.submitted_on).toLocaleDateString()
//       : '',
//   }));

//   // Convert JSON to a worksheet
//   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

//   // Create a workbook and add the worksheet
//   const workbook: XLSX.WorkBook = {
//     Sheets: { 'Contacts Data': worksheet },
//     SheetNames: ['Contacts Data'],
//   };

//   // Generate Excel file buffer
//   const excelBuffer: any = XLSX.write(workbook, {
//     bookType: 'xlsx',
//     type: 'array',
//   });

//   // Save file
//   const blob: Blob = new Blob([excelBuffer], {
//     type:
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
//   });

//   saveAs(blob, 'Contacts_' + new Date().toISOString().split('T')[0] + '.xlsx');
// }

  exportContactsToCSV() {
  const headers = [
    'Contact Id',
    'Business Name',
    'Person Name',
    'Mobile',
    'Email',
    'Message',
    'Created Date'
  ];

  const rows = this.accounts.map((team: any) => [
    team.contactId || '',
    team.company_name || '',
    team.full_name || '',
    team.phone || '',
    team.email || '',
    team.message || '',
    team.submitted_on ? new Date(team.submitted_on).toLocaleDateString() : ''
  ]);

  let csvContent =
    headers.join(',') +
    '\n' +
    rows.map((r: string[]) => r.map(this.escapeCSVValue).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'contacts.csv';
  link.click();
}

escapeCSVValue(value: any) {
  if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
    value = `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

}
