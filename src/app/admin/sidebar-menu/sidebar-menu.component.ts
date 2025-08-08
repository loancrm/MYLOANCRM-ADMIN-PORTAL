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
import { LeadSearchComponent } from '../leadSearch/leadSearch.component';
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
    this.getUserRoles();
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

  filterWithBusinessName() {
    let searchFilter = {};
    if (this.isPhoneNumber(this.businessNameToSearch)) {
      searchFilter = { 'primaryPhone-like': this.businessNameToSearch };
    } else {
      searchFilter = { 'businessName-like': this.businessNameToSearch };
    }
    this.applyFilters(searchFilter);
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

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[0-9]{10}$/;
    return phoneNumberPattern.test(value);
  }
  getUserRoles(filter = {}) {
    this.leadsService.getUserRoles(filter).subscribe(
      (roles) => {
        this.userRoles = roles;
        // console.log(this.userRoles);
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
      // console.log(leadUserName);
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
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
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (this.userDetails && this.userDetails.user) {
      this.userDetails = this.userDetails.user;
      this.userDetails.userImage = JSON.parse(this.userDetails.userImage);
    }
    // console.log(this.userDetails);
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
  }

  setMenuItems() {
    this.subFeatureMenuItems = [
      {
        name: 'Dashboard',
        condition: true,
        routerLink: 'dashboard',
        image: 'dashboard.gif',
        thumbnail: 'home-color.png',
        showOutside: true,
      },
      {
        name: 'Leads',
        condition: this.capabilities.leads,
        routerLink: 'leads',
        image: 'leads.gif',
        thumbnail: 'leads.png',
        showOutside: true,
      },
      {
        name: 'Callbacks',
        condition: this.capabilities.callbacks,
        routerLink: 'callbacks',
        image: 'callbacks.gif',
        thumbnail: 'callbacks.png',
        showOutside: true,
      },
      {
        name: 'Follow Ups',
        condition: this.capabilities.followups,
        routerLink: 'followups',
        image: 'followups.gif',
        thumbnail: 'followups.png',
        showOutside: true,
      },
      {
        name: 'Files',
        condition: this.capabilities.files,
        routerLink: 'files',
        image: 'files.gif',
        thumbnail: 'files.png',
        showOutside: true,
      },
      // {
      //   name: 'Partial Files',
      //   condition: this.capabilities.files,
      //   routerLink: 'partial',
      //   image: 'partial.gif',
      //   thumbnail: 'partial.png',
      //   showOutside: true,
      // },
      {
        name: 'Credit Eval',
        condition: this.capabilities.credit,
        routerLink: 'credit',
        image: 'credit.gif',
        thumbnail: 'credit.png',
        showOutside: true,
      },

      {
        name: 'Logins',
        condition: this.capabilities.logins,
        routerLink: 'logins',
        image: 'logins.gif',
        thumbnail: 'logins.png',
        showOutside: true,
      },

      {
        name: 'Files in Process',
        condition: this.capabilities.filesinprocess,
        routerLink: 'filesinprocess',
        image: 'activity.gif',
        thumbnail: 'filesinprocess.png',
        showOutside: true,
      },

      {
        name: 'Sanctions',
        condition: this.capabilities.approvals,
        routerLink: 'approvals',
        image: 'approvals.gif',
        thumbnail: 'approvals.png',
        showOutside: true,
      },
      {
        name: 'Disbursals',
        condition: this.capabilities.disbursals,
        routerLink: 'disbursals',
        image: 'disbursal.gif',
        thumbnail: 'disbursal.png',
        showOutside: true,
      },
      {
        name: 'Rejects',
        condition: this.capabilities.rejects,
        routerLink: 'rejects',
        image: 'rejects.gif',
        thumbnail: 'rejects.png',
        showOutside: true,
      },
      // {
      //   name: 'Lenders',
      //   condition: this.capabilities.lenders,
      //   routerLink: 'lenders',
      //   image: 'lenders.gif',
      //   thumbnail: 'lenders.png',
      //   showOutside: true,
      // },
      {
        name: 'Team',
        condition: this.capabilities.team,
        routerLink: 'team',
        image: 'team.gif',
        thumbnail: 'team.png',
        showOutside: true,
      },
      {
        name: 'Lenders',
        condition: this.capabilities.bankers,
        routerLink: 'bankers',
        image: 'lenders.gif',
        thumbnail: 'lenders.png',
        showOutside: true,
      },
      {
        name: 'Reports',
        condition: this.capabilities.reports,
        routerLink: 'reports',
        image: 'reports.gif',
        thumbnail: 'reports.png',
        showOutside: false,
      },
      {
        name: 'Ip Address',
        condition: this.capabilities.ipAddress,
        routerLink: 'ipAddress',
        image: 'ip.png',
        thumbnail: 'ip.png',
        showOutside: false,
      },
      {
        name: 'Settings',
        condition: true,
        routerLink: 'settings',
        image: 'settings.gif',
        thumbnail: 'settings.png',
        showOutside: false,
      },
    ];
    this.menuItems = [
      { label: 'Home', icon: '../../../assets/images/icons/home.svg', route: 'dashboard', condition: true, },
      { label: 'Leads', icon: '../../../assets/images/icons/leads.svg', route: 'leads', condition: this.capabilities.leads, },
      { label: 'Callbacks', icon: '../../../assets/images/icons/callbacks.svg', route: 'callbacks', condition: this.capabilities.callbacks, },
      { label: 'Follow Ups', icon: '../../../assets/images/icons/followups.svg', route: 'followups', condition: this.capabilities.followups, },
      { label: 'Files', icon: '../../../assets/images/icons/files.svg', route: 'files', condition: this.capabilities.files, },
      { label: 'Credit Evaluation', icon: '../../../assets/images/icons/credit.svg', route: 'credit', condition: this.capabilities.credit, },
      { label: 'Logins', icon: '../../../assets/images/icons/logins.svg', route: 'logins', condition: this.capabilities.logins, },
      { label: 'File In Process', icon: '../../../assets/images/icons/filesinprocess.svg', route: 'filesinprocess', condition: this.capabilities.filesinprocess, },
      { label: 'Sanctions', icon: '../../../assets/images/icons/sanctions.svg', route: 'approvals', condition: this.capabilities.approvals, },
      { label: 'Disbursals', icon: '../../../assets/images/icons/disbursal.svg', route: 'disbursals', condition: this.capabilities.disbursals, },
      { label: 'Rejects', icon: '../../../assets/images/icons/rejects.svg', route: 'rejects', condition: this.capabilities.rejects, },
      { label: 'Users', icon: '../../../assets/images/icons/team.svg', route: 'team', condition: this.capabilities.team, },
      { label: 'Lenders', icon: '../../../assets/images/icons/lender1.svg', route: 'bankers', condition: this.capabilities.bankers, },
      { label: 'Reports', icon: '../../../assets/images/icons/reports.svg', route: 'reports', condition: this.capabilities.reports, },
      { label: 'Ip Address', icon: '../../../assets/images/icons/ipaddress.svg', route: 'ipAddress', condition: this.capabilities.ipAddress, },
      { label: 'Integrations', icon: '../../../assets/images/icons/Integ.svg', route: 'integrations', condition: this.capabilities.integrations, },
      { label: 'Settings', icon: '../../../assets/images/icons/Settings.svg', route: 'settings' },
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
            this.router.navigate(['user', 'login']);
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
