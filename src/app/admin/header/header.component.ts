import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';
import { SubscriptionService } from '../../services/subscription.service';
import { LeadsService } from '../leads/leads.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LeadSearchComponent } from '../leadSearch/leadSearch.component';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService } from 'primeng/api';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showSidebar: any = false;
  sidebarVisible: boolean = false;
  sidebarCollapsed = false;
  userDetails: any;
  userRoles: any = [];
  searchFilter: any = {};
  businessNameToSearch: any;
  currentTableEvent: any;
  loading: any;
  moment: any;
  notificationCount = 0; isMobile: boolean = false;
  notifications: { message: string, timestamp: Date }[] = [];
  showDropdown = false;
  subscriptionPlanName: string = '';
  subscriptionStatus: any;
  upgradeMessage: any;
  subscriptionEndDate: string = '';
  dropdownOpen = false;
  displayPlanStatus: string = '';
  showUpgradeMessage: boolean = false;
  showUpgradeButton: boolean = false;
  upgradeButtonLabel: string = 'Upgrade Now';
  constructor(
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private toastService: ToastService,
    private localStorage: LocalStorageService,
    private router: Router,
    private dialogService: DialogService,
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService,
    private subscriptionService: SubscriptionService,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService,
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.leadsService.sidebarVisible$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
    this.getUserRoles();
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails && userDetails.user) {
      this.userDetails = userDetails.user;
      this.fetchSubscription(this.userDetails.accountId);
      this.userDetails.userImage = JSON.parse(this.userDetails.userImage);
    }
    // this.leadsService.connect(this.userDetails.id, this.userDetails.userType);

    // this.leadsService.onDocumentAdded((data) => {
    //   if (this.userDetails.userType == 1) {
    //     this.notifications.unshift({ message: data.message, timestamp: new Date() });
    //     this.notificationCount = this.notifications.length;
    //   }
    // });
  }
  //   confirmLogout(){
  //   this.confirmationService.confirm({
  //     message: `Are you sure you want to logout?`,
  //     header: 'Confirm Logout',
  //     icon: 'pi pi-sign-out',
  //     accept: () => {
  //       this.authService
  //         .doLogout()
  //         .then(() => {
  //           this.toastService.showSuccess('Logout Successful');
  //           this.localStorage.clearAllFromLocalStorage();
  //           this.router.navigate(['user', 'login']);
  //         })
  //         .catch((error) => {
  //           this.toastService.showError(error);
  //         });
  //     },
  //     reject: () => {
  //       this.toastService.showInfo('Logout cancelled');
  //     }
  //   });
  // }
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  fetchSubscription(accountId: number) {
    this.leadsService.getSubscriptionById(accountId).subscribe({
      next: (sub: any) => {
        if (sub) {
          this.subscriptionPlanName = sub.plan_name;
          this.subscriptionEndDate = sub.end_date;
          this.subscriptionStatus = sub.status;

          const today = this.moment();
          const end = this.moment(sub.end_date);
          const diff = end.diff(today, 'days');

          // Build the display string for the header badge
          if (diff < 0 || sub.status === 'Expired') {
            this.displayPlanStatus = `${sub.plan_name} - Expired`;
            this.upgradeMessage = `Your ${sub.plan_name} plan has expired.`;
            this.upgradeButtonLabel = sub.plan_name === 'Free Trial' ? 'Upgrade Now' : 'Renew';
            this.showUpgradeButton = true;
          } else if (diff <= 1) {
            this.displayPlanStatus = `${sub.plan_name} - Expires in 1 day`;
            this.upgradeMessage = `Your ${sub.plan_name} plan will expire in 1 day.`;
            this.upgradeButtonLabel = sub.plan_name === 'Free Trial' ? 'Upgrade Now' : 'Renew';
            this.showUpgradeButton = true;
          } else if (diff <= 7) {
            this.displayPlanStatus = `${sub.plan_name} - Expires in ${diff} days`;
            this.upgradeMessage = `Your ${sub.plan_name} plan will expire in ${diff} days.`;
            this.upgradeButtonLabel = sub.plan_name === 'Free Trial' ? 'Upgrade Now' : 'Renew';
            this.showUpgradeButton = true;
          } else {
            this.displayPlanStatus = `${sub.plan_name} - Active`;
            this.upgradeMessage = '';
            this.showUpgradeButton = false;
          }
        }
      },
      error: (err) => {
        console.error('Failed to fetch subscription:', err);
      }
    });
  }

  upgradeSubscription() {
    this.router.navigate(['/user/choose-subscription']);
  }
  userLogout() {
    this.authService
      .doLogout()
      .then(() => {
        this.toastService.showSuccess('Logout Successful');
        this.localStorage.clearAllFromLocalStorage();
        this.router.navigate(['user', 'login']);
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  viewUser(userId) {
    this.routingService.handleRoute('team/view/' + userId, null);
  }
  // toggleDropdown() {
  //   this.showDropdown = !this.showDropdown;
  //   if (this.showDropdown) {
  //     this.notificationCount = 0; // Optionally reset badge when user opens dropdown
  //   }
  // }

  // clearNotifications() {
  //   this.notifications = [];
  //   this.notificationCount = 0;
  // }
  filterWithBusinessName() {
    let searchFilter = {};
    if (this.isPhoneNumber(this.businessNameToSearch)) {
      searchFilter = { 'primaryPhone-like': this.businessNameToSearch };
    } else {
      searchFilter = { 'businessName-like': this.businessNameToSearch };
    }
    this.applyFilters(searchFilter);
  }

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[0-9]{10}$/;
    return phoneNumberPattern.test(value);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.searchLeads(api_filter);
    }
  }

  searchLeads(filter = {}) {
    this.loading = true;
    this.leadsService.searchLeads(filter).subscribe(
      (response: any) => {
        // console.log(response);
        if (response) {
          this.dialogService.open(LeadSearchComponent, {
            data: response,
            header: 'Lead Information',
            width: '80%',
          });
        } else {
          this.toastService.showError('An unknown error occurred.');
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getUserRoles(filter = {}) {
    this.leadsService.getUserRoles(filter).subscribe(
      (roles) => {
        this.userRoles = roles;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getUserRoleName(userId) {
    if (this.userRoles && this.userRoles.length > 0) {
      let leadUserName = this.userRoles.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }
  showSidebarMenu() {
    this.showSidebar = !this.showSidebar;
    this.subscriptionService.sendMessage({
      ttype: 'showSidebar',
      value: this.showSidebar,
    });
  }
}
