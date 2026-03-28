import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
export interface FollowUpNote {
  date: Date;
  remarks: string;
  updatedBy: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  accountId: any;
  appliedFilter: any = {};
  activitiesCount: any = 0;
  wallettransactionsCount: any = 0
  subscriptionCount: any = 0;
  newNote: FollowUpNote = { date: new Date(), remarks: '', updatedBy: '' };
  transactionsCount: any = 0;
  payments: any[] = [];
  selectedDate: Date | null = null;
  filteredNotes: FollowUpNote[] = []; // Display filtered notes

  sidebarVisible: boolean = false;
  searchText: string = '';
  notes: FollowUpNote[] = [];
  allNotes: FollowUpNote[] = []; // Store all notes for filtering

  selectedActivity: any = null;
  accountDetails: any = null;
  showActivityDetail: boolean = false;
  currentTableEvent: any;
  subscriptions: any[] = [];
  activities: any[] = [];
  walletTransactions: any[] = [];
  filterConfig: any[] = [];
  loading: boolean = false;
  searchFilter: any = {};
  userDetails: any;
  moment: any;
  fileFollowupDebounce: any = null;
  // ── ADD these 2 properties ────────────────────────────────────────────────
  apiEnabled  = false;
  togglingApi = false;
// ── UPDATE these properties ──────────────────────────
bankLoading          = false;
banks: any[]         = [];
banksCount           = 0;          // ✅ total count for paginator
selectedBankLoanType = 'all';
currentBankEvent: any;             // ✅ store last event

bankLoanTypeOptions = [
  { label: 'All',                     value: 'all'                   },
  { label: 'Business Loan',           value: 'businessLoan'          },
  { label: 'Personal Loan',           value: 'personalLoan'          },
  { label: 'Home Loan',               value: 'homeLoan'              },
  { label: 'Mortgage Loan',           value: 'lap'                   },
  { label: 'Professional Loan',       value: 'professionalLoans'     },
  { label: 'Car Loan',                value: 'carLoan'               },
  { label: 'Commercial Vehicle Loan', value: 'commercialVehicleLoan' },
];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService,
    private leadService: LeadsService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {}

  ngOnInit(): void {
    this.moment = this.dateTimeProcessor.getMoment();

    let userDetails =
      this.localStorageService.getItemFromLocalStorage('adminDetails');
    this.userDetails = userDetails.user;
    this.newNote.updatedBy = this.userDetails.name;
    console.log(this.userDetails);
    this.setFilterConfig();
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.loadoverview();
    this.loadNotes();
    // this.loadBankAnalytics();
  }
  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'User',
        data: [
          {
            field: 'userName',
            title: 'User Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Action',
        data: [
          {
            field: 'action',
            title: 'Action',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Entity Type',
        data: [
          {
            field: 'entityType',
            title: 'Entity Type',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Module',
        data: [
          {
            field: 'module',
            title: 'Module',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Status',
        data: [
          {
            field: 'status',
            title: 'Status',
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
          {
            field: 'createdOn',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
    ];
  }

  loadoverview() {
  this.loading = true;
  forkJoin({
    account: this.leadService.getAccountById(this.accountId),
  }).subscribe({
    next: (res: any) => {
      this.accountDetails = res.account;
      this.accountDetails.followupDate = this.accountDetails.followupDate
        ? new Date(this.accountDetails.followupDate)
        : null;

      // ✅ ADD THIS — set toggle state from DB value
      this.apiEnabled = this.accountDetails.isApiEnabled === 1;

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    },
  });
}
  // loadoverview() {
  //   this.loading = true;

  //   forkJoin({
  //     account: this.leadService.getAccountById(this.accountId),
  //     // subscriptions: this.leadService.getAccountById(this.accountId),
  //   }).subscribe({
  //     next: (res: any) => {
  //       this.accountDetails = res.account;
  //       (this.accountDetails.followupDate = this.accountDetails.followupDate
  //         ? new Date(this.accountDetails.followupDate)
  //         : null),
  //         (this.loading = false);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.loading = false;
  //     },
  //   });
  // }

  toggleApiAccess(event: any): void {
  this.togglingApi = true;

  this.leadService.toggleApiAccess(
    this.accountDetails.accountId,
    this.apiEnabled          // true or false
  ).subscribe({
    next: () => {
      this.togglingApi = false;
      this.accountDetails.isApiEnabled = this.apiEnabled ? 1 : 0;
      this.toastService.showSuccess(
        `API access ${this.apiEnabled ? 'enabled' : 'disabled'} successfully`
      );
    },
    error: () => {
      this.togglingApi  = false;
      this.apiEnabled   = !this.apiEnabled;   // ✅ revert toggle if API fails
      this.toastService.showError('Failed to update API access');
    }
  });
}

  loadActivities(event: any) {
    this.currentTableEvent = event;
    let api_filter = this.leadService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    api_filter['accountId-eq'] = this.accountId;
    this.loading = true;
    this.leadService.getActivities(api_filter).subscribe(
      (response: any) => {
        this.activities = response || [];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
    this.leadService.getActivitiesCount(api_filter).subscribe(
      (response: any) => {
        this.activitiesCount = parseInt(response) || 0;
      },
      (error: any) => {
        console.error('Error fetching activities count:', error);
      }
    );
  }
//   loadWalletTransactions(event: any) {
//     this.currentTableEvent = event;
//     this.loading = true;

//     this.leadService.getWalletTransactionsByAccountId(this.accountId).subscribe(
//       (res: any) => {
//         this.walletTransactions = res.transactions || [];
//         // console.log(this.walletTransactions);
        
//         this.wallettransactionsCount = res.count || 0;
//         this.loading = false;
//       },
//       (err) => {
//         this.loading = false;
//         this.toastService.showError(err);
//       }
//     );
// }
loadWalletTransactions(event: any) {
  this.currentTableEvent = event;

  let api_filter = this.leadService.setFiltersFromPrimeTable(event);
   api_filter = Object.assign({}, api_filter, this.searchFilter);
  api_filter['accountId-eq'] = this.accountId;

  this.loading = true;

  this.leadService.getWalletTransactions(api_filter).subscribe(
  (res: any) => {
    this.walletTransactions = res || [];
    this.loading = false;
  },
  (err) => {
    this.loading = false;
    this.toastService.showError(err);
  }
);
  this.leadService.getWalletTransactionsCount(api_filter).subscribe(
    (count: any) => {
      this.wallettransactionsCount = parseInt(count) || 0;
    },
    (err) => console.error(err)
  );
}

  loadSubscriptions(event: any) {
    this.currentTableEvent = event;
    let api_filter = this.leadService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    api_filter['accountId-eq'] = this.accountId;
    this.loading = true;
    this.leadService.getSubscriptions(api_filter).subscribe(
      (response: any) => {
        this.subscriptions = response || [];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
    this.leadService.getSubscriptionsCount(api_filter).subscribe(
      (response: any) => {
        this.subscriptionCount = parseInt(response) || 0;
      },
      (error: any) => {
        console.error('Error fetching activities count:', error);
      }
    );
  }

  onSearchChange() {
    this.applyFilters();
  }
  loadNotes() {
    this.leadService.getNotes(this.accountId).subscribe({
      next: (res: any) => {
        this.notes = res.notes || [];
        this.allNotes = [...this.notes];
        this.applyFilters();
      },
      error: (err) => console.error(err),
    });
  }
  addRemarks() {
    if (!this.newNote.date) {
      this.newNote.date = new Date();
    }
    console.log(this.newNote);
    this.leadService.addRemarks(this.accountId, this.newNote).subscribe(
      (res: any) => {
        this.notes = res.notes;
        this.allNotes = [...this.notes];
        this.applyFilters();
        this.newNote = {
          date: new Date(),
          remarks: '',
          updatedBy: this.userDetails?.name,
        };
        this.toastService.showSuccess('Note added successfully');
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  applyFilters() {
    let filtered = [...this.allNotes];

    if (this.searchText && this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (note) =>
          note.remarks?.toLowerCase().includes(searchLower) ||
          note.updatedBy?.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toDateString();
      filtered = filtered.filter((note) => {
        if (note.date) {
          const noteDateStr = new Date(note.date).toDateString();
          return noteDateStr === selectedDateStr;
        }
        return false;
      });
    }

    this.filteredNotes = filtered;
  }
  onDateChange() {
    this.applyFilters();
  }
  clearFilters() {
    this.searchText = '';
    this.selectedDate = null;
    this.applyFilters();
  }
  loadPayments(event: any) {
    this.currentTableEvent = event;
    let api_filter = this.leadService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    api_filter['accountId-eq'] = this.accountId;
    this.loading = true;
    this.leadService.getTransactions(api_filter).subscribe(
      (response: any) => {
        this.payments = response || [];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
    this.leadService.getTransactionsCount(api_filter).subscribe(
      (response: any) => {
        this.transactionsCount = parseInt(response) || 0;
      },
      (error: any) => {
        console.error('Error fetching activities count:', error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  toggleSidebar() {
    this.sidebarVisible = true;
  }
  applyConfigFilters(filters: any) {
    this.searchFilter = filters;
    this.appliedFilter = filters;

    this.loadActivities(this.currentTableEvent);
  }
  getStatusClass(status: string) {
    switch (status) {
      case 'Active':
        return 'badge bg-success';
      case 'Expired':
        return 'badge bg-danger';
      case 'Cancelled':
        return 'badge bg-secondary';
      case 'Trial':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-light text-dark';
    }
  }

  formatJSON(value: any): string {
    if (!value) return '';
    try {
      if (typeof value === 'string') {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return value;
    }
  }
  getStatusBadgeClass(status: string): string {
    const statusUpper = status?.toUpperCase() || '';
    switch (statusUpper) {
      case 'SUCCESS':
        return 'badge bg-success';
      case 'FAILED':
        return 'badge bg-danger';
      default:
        return 'badge bg-warning';
    }
  }
  viewActivityDetails(activity: any) {
    this.selectedActivity = activity;
    this.showActivityDetail = true;
  }
  getActionBadgeClass(action: string): string {
    const actionUpper = action?.toUpperCase() || '';
    switch (actionUpper) {
      case 'CREATE':
        return 'badge bg-success';
      case 'UPDATE':
        return 'badge bg-primary';
      case 'DELETE':
        return 'badge bg-danger';
      case 'VIEW':
        return 'badge bg-info';
      case 'LOGIN':
        return 'badge bg-success';
      case 'LOGOUT':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }
  closeActivityDetail() {
    this.showActivityDetail = false;
    this.selectedActivity = null;
  }
  updateAccountfollowupDate(accountDetails: any) {
    clearTimeout(this.fileFollowupDebounce);

    // Get the date from accountDetails.followupDate (bound to calendar) or from lead object
    const dateValue =
      this.accountDetails?.followupDate || accountDetails?.followupDate;

    if (!dateValue) {
      console.log('No date value found');
      return;
    }

    console.log('Date value to save:', dateValue);

    this.fileFollowupDebounce = setTimeout(() => {
      // Format date and time: YYYY-MM-DD HH:mm:ss
      const payload = {
        followupDate: this.moment(dateValue).format('YYYY-MM-DD HH:mm:ss'),
      };

      console.log('Payload to send:', payload);

      this.loading = true;

      // Use lead.id from the passed parameter
      const accountId = accountDetails?.accountId;

      if (!accountId) {
        this.loading = false;
        this.toastService.showError('Account ID not found');
        return;
      }

      this.leadService.updateAccountFollowupDate(accountId, payload).subscribe(
        () => {
          this.loading = false;
          this.toastService.showSuccess(
            'Follow-up Date & Time Updated Successfully'
          );
        },
        (error) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }, 700);
  }
loadBankAnalytics(event?: any): void {
  // ✅ store event for reload on filter change
  if (event) {
    this.currentBankEvent = event;
  }

  const first = this.currentBankEvent?.first ?? 0;
  const rows  = this.currentBankEvent?.rows  ?? 10;

  this.bankLoading = true;

  this.leadService.getBankWiseAnalytics(
    this.accountId,
    this.selectedBankLoanType,
    first,    // ✅ pass offset
    rows      // ✅ pass limit
  ).subscribe(
    (res: any) => {
      const rawBanks  = res.banks  || [];
      this.banksCount = res.total  || 0;  // ✅ total count from backend

      if (this.selectedBankLoanType === 'all') {
        const rows2: any[] = [];
        rawBanks.forEach((bank: any) => {
          if (bank.loanTypes && bank.loanTypes.length > 0) {
            bank.loanTypes.forEach((lt: any) => {
              rows2.push({
                bankName:          bank.bankName,
                loanType:          lt.loanType,
                filesProcessed:    lt.filesProcessed,
                totalSanctioned:   lt.totalSanctioned,
                totalDisbursed:    lt.totalDisbursed,
                highestSanctioned: lt.highestSanctioned,
                highestDisbursed:  lt.highestDisbursed,
                 lowestSanctioned: lt.lowestSanctioned || 0,
  lowestDisbursed: lt.lowestDisbursed || 0,
                avgSanctioned:     lt.avgSanctioned    || 0,  // ✅
  avgDisbursed:      lt.avgDisbursed     || 0,  // ✅
              });
            });
          } else {
            rows2.push({
              bankName:          bank.bankName,
              loanType:          '-',
              filesProcessed:    bank.filesProcessed,
              totalSanctioned:   bank.totalSanctioned,
              totalDisbursed:    bank.totalDisbursed,
              highestSanctioned: bank.highestSanctioned,
              highestDisbursed:  bank.highestDisbursed,
              lowestSanctioned: bank.lowestSanctioned || 0,
  lowestDisbursed: bank.lowestDisbursed || 0,
              
              avgSanctioned:     bank.avgSanctioned    || 0,  // ✅
  avgDisbursed:      bank.avgDisbursed     || 0,  // ✅
            });
          }
        });
        this.banks = rows2;
      } else {
        this.banks = rawBanks.map((bank: any) => ({
          bankName:          bank.bankName,
          loanType:          this.selectedBankLoanType,
          filesProcessed:    bank.filesProcessed,
          totalSanctioned:   bank.totalSanctioned,
          totalDisbursed:    bank.totalDisbursed,
          highestSanctioned: bank.highestSanctioned,
          highestDisbursed:  bank.highestDisbursed,
          // ✅ ADD THESE
  lowestSanctioned: bank.lowestSanctioned || 0,
  lowestDisbursed: bank.lowestDisbursed || 0,

  avgSanctioned: bank.avgSanctioned || 0,
  avgDisbursed: bank.avgDisbursed || 0,
        }));
      }

      this.bankLoading = false;
    },
    (error: any) => {
      console.error('Bank analytics error:', error);
      this.bankLoading = false;
    }
  );
}

onBankLoanTypeChange(): void {
  // ✅ reset to page 1 when filter changes
  this.currentBankEvent = { first: 0, rows: 10 };
  this.loadBankAnalytics();
}

//   loadBankAnalytics(): void {
//   this.bankLoading = true;
//   this.leadService.getBankWiseAnalytics(this.accountId, this.selectedBankLoanType)
//     .subscribe(
//       (res: any) => {
//         this.banks        = res.banks || [];
//         this.bankPageFirst = 0;
//         this.updatePagedBanks();
//         this.bankLoading  = false;
//       },
//       (error: any) => {
//         console.error('Bank analytics error:', error);
//         this.bankLoading = false;
//       }
//     );
// }

// updatePagedBanks(): void {
//   const start = this.bankPageFirst;
//   const end   = start + this.bankPageRows;
//   this.pagedBanks = this.banks.slice(start, end);
// }

// onBankPageChange(event: any): void {
//   this.bankPageFirst = event.first;
//   this.bankPageRows  = event.rows;
//   this.expandedBank  = null; // collapse on page change
//   this.updatePagedBanks();
// }
// onBankLoanTypeChange(): void {
//   this.bankPageFirst = 0;
//   this.expandedBank  = null;
//   this.loadBankAnalytics();
// }

// toggleBank(bankName: string): void {
//   this.expandedBank = this.expandedBank === bankName ? null : bankName;
// }

formatAmount(amount: number): string {
  if (!amount || amount === 0) return '₹0';
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + ' Cr';
  if (amount >= 100000)   return '₹' + (amount / 100000).toFixed(1)   + ' L';
  if (amount >= 1000)     return '₹' + (amount / 1000).toFixed(1)     + ' K';
  return '₹' + amount;
}


}
