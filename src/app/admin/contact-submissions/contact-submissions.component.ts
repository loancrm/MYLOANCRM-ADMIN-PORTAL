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
  // ── Admin Remarks Dropdown ─────────────────────────────
adminRemarkOptions: { label: string; value: any }[] = [];
adminRemarksLoaded: boolean = false;

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
    this.loadAdminRemarks();
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

  loadAdminRemarks() {
  const filter = { 'status-eq': 2,'remarkInternalStatus-eq': 1  };

  this.leadsService.getAdminRemarks(filter).subscribe(
    (data: any) => {
      this.adminRemarkOptions = data.map((r: any) => ({
        label: r.displayName,
        value: String(r.remarkId),
      }));
      this.adminRemarksLoaded = true;
    },
    () => {
      this.toastService.showError('Failed to load remarks');
      this.adminRemarksLoaded = true;
    }
  );
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

  // getTeam(filter = {}) {
  //   this.apiLoading = true;
  //   this.leadsService.getContacts(filter).subscribe(
  //     (team) => {
  //       this.accounts = team;
  //       this.apiLoading = false;
  //     },
  //     (error: any) => {
  //       this.toastService.showError(error);
  //       this.apiLoading = false;
  //     }
  //   );
  // }

  getTeam(filter = {}) {
  this.apiLoading = true;

  this.leadsService.getContacts(filter).subscribe(
    (team: any) => {

      // ✅ FIX: convert remarkId → string
      this.accounts = team.map((t: any) => ({
        ...t,
        remarkId: t.remarkId !== null ? String(t.remarkId) : null
      }));

      this.apiLoading = false;
    },
    (error: any) => {
      this.toastService.showError(error);
      this.apiLoading = false;
    }
  );
}

//   saveRemark(team: any) {
//   const remark = team.remarks?.trim();

//   if (!remark) return;

//   this.leadsService.updateContactRemarkText(team.id, remark).subscribe(
//     () => {
//       this.toastService.showSuccess('Remark saved');
//     },
//     () => {
//       this.toastService.showError('Failed to save remark');
//     }
//   );
// }
//----------
//   saveRemark(team: any, event: Event) {
//   const input = event.target as HTMLInputElement;
//   const remark = input.value?.trim();

//   if (!remark) return;

//   this.leadsService.updateContactRemark(team.id, remark).subscribe(
//     () => {
//       team.remarks = remark; // update UI instantly
//       this.toastService.showSuccess('Remark saved');
//     },
//     (error) => {
//       this.toastService.showError('Failed to save remark');
//     }
//   );
// }


  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadAccounts(this.currentTableEvent);
  }

  filterWithName() {
    let searchFilter = { 'full_name-like': this.userNameToSearch };
    this.applyFilters(searchFilter);
  }

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedTeamStatus',
      event.value
    );
    this.loadAccounts(this.currentTableEvent);
  }
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


onRemarkChange(team: any, remarkId: any) {

  // ✅ Allow remove (null)
  const finalRemarkId = remarkId ? String(remarkId) : null;

  this.leadsService.updateContactRemark(team.id, remarkId).subscribe(
    () => {
      team.remarkId = finalRemarkId;

      if (finalRemarkId) {
        this.toastService.showSuccess('Remark saved');
      } else {
        this.toastService.showSuccess('Remark removed'); // ✅ NEW
      }
    },
    () => {
      this.toastService.showError('Failed to update remark');
    }
  );
}

// ✅ TEXTAREA SAVE
// saveRemark(team: any) {
//   const remark = team.remarks?.trim();
//   if (!remark) return;

//   this.leadsService.updateContactRemarkText(team.id, remark).subscribe(
//     () => {
//       this.toastService.showSuccess('Remark saved');
//     },
//     () => {
//       this.toastService.showError('Failed to save remark');
//     }
//   );
// }
saveRemark(team: any, event: any) {
  event.preventDefault(); // ✅ stop new line

  const remark = team.remarks?.trim();
  if (!remark) return;

  this.leadsService.updateContactRemarkText(team.id, remark).subscribe(
    () => {
      this.toastService.showSuccess('Remark saved');
    },
    () => {
      this.toastService.showError('Failed to save remark');
    }
  );
}
// onRemarkChange(team: any, remarkId: any) {
//   if (!remarkId) return;

//   this.leadsService.updateContactRemark(team.id, remarkId).subscribe(
//     () => {
//       team.remarkId = String(remarkId);
//       this.toastService.showSuccess('Remark updated');
//     },
//     () => {
//       this.toastService.showError('Failed to update remark');
//     }
//   );
// }
}
