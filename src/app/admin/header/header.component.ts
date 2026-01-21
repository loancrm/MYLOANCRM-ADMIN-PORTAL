import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';
import { SubscriptionService } from '../../services/subscription.service';
import { LeadsService } from '../leads/leads.service';
import { DialogService } from 'primeng/dynamicdialog';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService } from 'primeng/api';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { MatDialog } from '@angular/material/dialog';
import { BulkWhatsappModalComponent } from 'src/app/admin/bulk-whatsapp-modal/bulk-whatsapp-modal.component';
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
    private dialog: MatDialog,
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.leadsService.sidebarVisible$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('adminDetails');
    if (userDetails && userDetails.user) {
      this.userDetails = userDetails.user;
      // this.fetchSubscription(this.userDetails.accountId);
      // this.userDetails.userImage = JSON.parse(this.userDetails.userImage);
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


  upgradeSubscription() {
    this.router.navigate(['/admin/choose-subscription']);
  }
  userLogout() {
    this.authService
      .doLogout()
      .then(() => {
        this.toastService.showSuccess('Logout Successful');
        this.localStorage.clearAllFromLocalStorage();
        this.router.navigate(['admin', 'login']);
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
  openModalBulk(): void {
    this.router.navigate(['bulk-whatsapp']);
  }

//  openModalBulk(): void {
//       this.dialog.open(BulkWhatsappModalComponent, {
//         width: '80%',
//         height:'80%',
//         data: {},
//       });
//     }

  showSidebarMenu() {
    this.showSidebar = !this.showSidebar;
    this.subscriptionService.sendMessage({
      ttype: 'showSidebar',
      value: this.showSidebar,
    });
  }
}
