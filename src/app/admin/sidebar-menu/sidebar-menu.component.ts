import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  OnChanges,
  Input,
  ViewChild,
  HostListener,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SubSink } from 'subsink';
import { LocalStorageService } from '../../services/local-storage.service';
import { SubscriptionService } from '../../services/subscription.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import { Sidebar } from 'primeng/sidebar';
import { RoutingService } from '../../services/routing-service';
import { ToastService } from '../../services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnChanges {
  @Input() showSidebar;
  @ViewChild('sidebarMenu') sidebarMenu: Sidebar;
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;
  sidebarVisible: any;
  userDetails: any;
  userRoles: any = [];
  capabilities: any;
  subscription: Subscription;
  private subs = new SubSink();
  iswiz = false;
  minimizeMenu = false;
  showMenu = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  featureMenuItems: any = [];
  subFeatureMenuItems: any = [];
  moreFeatureMenuItems: any = [];
  @Output() menuToggle: EventEmitter<boolean> = new EventEmitter();
  isMenuCollapsed = false;
  businessNameToSearch: any;
  searchFilter: any = {};
  currentTableEvent: any;
  loading: any;
  menuItems: any = [];
  @Output() toggle = new EventEmitter<boolean>();
  @Input() isSidebarVisible = true;
  isMobile = false;
  constructor(
    private confirmationService: ConfirmationService,
    private subscriptionService: SubscriptionService,
    private renderer: Renderer2,
    private lStorageService: LocalStorageService,
    private authService: AuthService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private localStorage: LocalStorageService,
    private router: Router,
    private leadsService: LeadsService,
    private dialogService: DialogService,
    private localStorageService: LocalStorageService
  ) {
    this.checkIfMobile();
    this.leadsService.sidebarVisible$.subscribe(
      (visible) => (this.isSidebarVisible = visible)
    );
    this.subs.sink = this.subscriptionService
      .getMessage()
      .subscribe((message) => {
        switch (message.ttype) {
          case 'showSidebar':
            this.sidebarVisible = message.value;
            break;
        }
        this.setMenuItems();
      });
  }

  @HostListener('window:resize')
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 991;
  }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.toggle.emit(this.isSidebarVisible);
  }
  closeSidebar() {
    this.isSidebarVisible = false;
    this.toggle.emit(this.isSidebarVisible);
  }








  closeMenu() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }

  dashboardClicked() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }

  ngOnInit() {
    this.getGlobalSettings().then(() => {
      this.setMenuItems();
    });
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('adminDetails');
    if (this.userDetails && this.userDetails.user) {
      this.userDetails = this.userDetails.user;
      // this.userDetails.userImage = JSON.parse(this.userDetails.userImage);
    }
    // console.log(this.userDetails);
    // this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
  }

  setMenuItems() {

    // console.log("hello")
    this.menuItems = [
      { label: 'Home', icon: '../../../assets/images/icons/home.svg', route: 'dashboard', condition: true, },
      { label: 'Accounts', icon: '../../../assets/images/icons/leads.svg', route: 'accounts', condition: true },
      { label: 'Subscriptions', icon: '../../../assets/images/icons/callbacks.svg', route: 'subscription-plans', condition: true },
      { label: 'Contacts', icon: '../../../assets/images/icons/callbacks.svg', route: 'contact-submissions', condition: true },
      { label: 'Subscribers', icon: '../../../assets/images/icons/callbacks.svg', route: 'subscribers', condition: true },
      { label: 'Cibil Reports', icon: '../../../assets/images/icons/callbacks.svg', route: 'cibil-reports', condition: true },
      { label: 'Social Media Leads', icon: '../../../assets/images/icons/callbacks.svg', route: 'social-media-leads', condition: true },
    ];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getProviderSettings() { }

  getGlobalSettings() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  minimizeSideBar() {
    this.minimizeMenu = !this.minimizeMenu;
    // console.log(this.minimizeMenu);
    this.subscriptionService.sendMessage({
      ttype: 'smallMenu',
      value: this.minimizeMenu,
    });
  }

  gotoActiveHome() {
    this.routingService.setFeatureRoute(null);
    this.routingService.handleRoute('', null);
  }

  showSidebarMenu(event) {
    this.sidebarVisible = event;
  }

  ngOnChanges(changes) {
    if (changes && changes.showSidebar) {
      if (this.sidebarMenu && !this.sidebarMenu.visible) {
        this.sidebarVisible = true;
      } else {
        this.sidebarVisible = false;
      }
    }
  }

  showMenuSection() {
    this.sidebarVisible = false;
    this.showMenu = false;
    this.subscriptionService.sendMessage({
      ttype: 'showmenu',
      value: this.showMenu,
    });
  }

  enableOrDisableSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // doLogout() {
  //   this.authService
  //     .doLogout()
  //     .then(() => {
  //       this.toastService.showSuccess('Logout Successful');
  //       const userType =
  //         this.lStorageService.getItemFromLocalStorage('userType');
  //       this.routingService.handleRoute('user' + '/login', null);
  //       this.lStorageService.clearAllFromLocalStorage();
  //     })
  //     .catch((error) => {
  //       this.toastService.showError(error);
  //     });
  // }

  confirmLogout(event: Event) {
    event.preventDefault(); // prevent default <a> behavior
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-sign-out',
      accept: () => {
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
      },
      reject: () => {
        this.toastService.showInfo('Logout cancelled');
      }
    });
  }
}
