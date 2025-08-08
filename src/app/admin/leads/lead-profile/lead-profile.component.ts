import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lead-profile',
  templateUrl: './lead-profile.component.html',
  styleUrl: './lead-profile.component.scss',
})
export class LeadProfileComponent implements OnInit {
  breadCrumbItems: any = [];
  displayedItems: any = [];
  loading: boolean = false;
  leadId: string | null = null;
  leadsData: any;
  accountId: any;
  expandedRows: { [key: string]: boolean } = {};
  loanType: string = '';
  employmentStatus: string = '';
  leadUsers: any = [];
  isDialogVisible = false;
  selectLender: any = null;
  leadSources: any = [];
  userDetails: any;
  selectedRows: any[] = [];
  isFullscreen = false;
  bankMap = new Map<number, string>();
  banks: any = [];
  isEditingRemarks: boolean = false;
  showTableDialog: boolean = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  businessEntities: any = projectConstantsLocal.BUSINESS_ENTITIES;
  timelineEvents: { date: Date | null; title: string; image: string; }[];

  constructor(
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
  ) {
    this.getBankers();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.accountId = this.userDetails?.accountId; // make sure accountId is available
    this.leadId = this.route.snapshot.paramMap.get('id');
    const status = this.route.snapshot.paramMap.get('status');
    if (this.leadId) {
      if (!status) {
        this.getAllLeadData(this.leadId);
      } else {
        const validStatuses = ['personalLoan', 'homeLoan', 'lap'];
        if (validStatuses.includes(status)) {
          this.getAllLoanLeadData(this.leadId);
        } else {
          console.warn('Unknown status:', status);
          this.getAllLeadData(this.leadId);
        }
      }
    }
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'leads',
        routerLink: '/user/leads',
        queryParams: { v: this.version },
      },
      { label: 'Profile' },
    ];
    this.getLeadUsers();
    this.getLeadSourcesvalues();
  }

  getAllLeadData(leadId: string) {
    this.loading = true;
    this.leadsService.getAllLeadData(leadId).subscribe(
      (response) => {
        this.leadsData = response;
        // console.log(this.leadsData);
        this.loanType = (this.leadsData?.leadData?.loanType || '').toLowerCase();
        this.employmentStatus = (this.leadsData?.leadData?.employmentStatus || '').toLowerCase();
        this.updateDisplayedItems();
        this.setTimelineDates();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getAllLoanLeadData(leadId: string) {
    this.loading = true;
    this.leadsService.getAllLoanLeadData(leadId).subscribe(
      (response) => {
        this.leadsData = response;
        this.leadsData.documents = this.leadsData.documents || {};
        // console.log(this.leadsData);
        // console.log('Lead Status:', this.leadsData.leadStatusName);
        // console.log('Lead Internal Status:', this.leadsData.leadData?.leadInternalStatus);
        this.loanType = (this.leadsData?.leadData?.loanType || '').toLowerCase();
        this.employmentStatus = (this.leadsData?.leadData?.employmentStatus || '').toLowerCase();
        this.updateDisplayedItems();
        this.setTimelineDates();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  onDownloadZip(): void {
    const accountId = 1270983;
    const leadId = 3745806921;
    const url = `https://files.loancrm.org/files?accountId=${accountId}&leadId=${leadId}&downloadZip=true`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        if (!blob || blob.size === 0) {
          console.error('Empty or invalid file received.');
          this.toastService.showError('Empty or invalid ZIP file received.');
          return;
        }
        const downloadURL = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadURL;
        a.download = `lead_${leadId}_files.zip`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadURL);
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.toastService.showError('ZIP download failed. Please try again.');
      }
    });
  }

  isBusinessView(): boolean {
    return (
      (this.loanType === 'homeloan' && this.employmentStatus === 'self-employed') ||
      (this.loanType === 'lap' && this.employmentStatus === 'self-employed') ||
      (!['personalloan', 'homeloan', 'lap'].includes(this.loanType))
    );
  }

  isPersonalView(): boolean {
    return (
      (this.loanType === 'personalloan' && this.employmentStatus === 'employed') ||
      (this.loanType === 'homeloan' && this.employmentStatus === 'employed') ||
      (this.loanType === 'lap' && this.employmentStatus === 'employed')
    );
  }

  isProprietorPersonal(): boolean {
    return ['personalloan', 'homeloan', 'lap'].includes(this.loanType) &&
      this.employmentStatus === 'employed';
  }


  getMaskedPhone(phone: any) {
    return this.leadsService.maskPhoneNumber(phone);
  }
  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
  isRowSelected(item: any): boolean {
    return this.selectedRows?.some(selected => selected.id === item.id);
  }

  toggleRow(index: number | string): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }
  // getAllLeadData(leadId: string) {
  //   this.loading = true;
  //   this.leadsService.getAllLeadData(leadId).subscribe(
  //     (response) => {
  //       this.leadsData = response;
  //       this.loanType = (this.leadsData?.leadData?.loanType || '').toLowerCase();
  //       this.employmentStatus = (this.leadsData?.leadData?.employmentStatus || '').toLowerCase();

  //       // console.log(this.leadsData);
  //       // console.log('leads full data:', this.leadsData);
  //       this.updateDisplayedItems();
  //       this.setTimelineDates();
  //       this.loading = false; // Ensure loading is set to false after data is processed
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // getAllLoanLeadData(leadId: string) {
  //   this.loading = true;
  //   this.leadsService.getAllLoanLeadData(leadId).subscribe(
  //     (response) => {
  //       this.leadsData = response;
  //       // console.log('loanleads full data:', this.loanleads);
  //       console.log(this.leadsData.leadData);
  //       // console.log('loanleads full data:', this.loanleads.logins);
  //       // console.log("loanleads.logins length:", this.loanleads?.logins?.length);  // ✅ Ensure array exists

  //       // console.log(this.loanleads.leaData.logins);
  //       // console.log(this.loanleads.leadData.loanType);
  //       // console.log(this.loanleads.leadData.employmentStatus);
  //       // console.log(this.loanleads.leadData.salary);
  //       // console.log(this.loanleads.leadData.sanctionedAmount);
  //       // console.log(this.loanleads.leadData.logins);
  //       this.updateDisplayedItems();
  //       this.setTimelineDates();
  //       this.loading = false; // Ensure loading is set to false after data is processed
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  saveRemarks(newRemark: string) {
    this.isEditingRemarks = false;
    const leadId = this.leadsData.leadData.id
    const payload = {
      businessName: this.leadsData.leadData.businessName,
      remarks: newRemark
    };

    this.leadsService.updateLead(leadId, payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Remarks updated successfully');
      },
      error: (err) => {
        this.toastService.showError('Failed to update remarks');
        console.error(err);
      }
    });
  }
  showUserDetails(user: any): void {
    // console.log('User details:', user);
    this.selectLender = user.data;
    this.isDialogVisible = true;
  }
  clearDialog(): void {
    this.selectLender = null;
    this.isDialogVisible = false;
  }

  convertToLakhsOrCrores(amount: number): string {
    // console.log(amount);
    if (amount >= 10000000) {
      const crores = amount / 10000000;

      return crores % 1 === 0
        ? crores.toFixed(0) + ' Cr'
        : crores.toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
      const lakhs = amount / 100000;
      return lakhs % 1 === 0
        ? lakhs.toFixed(0) + ' L'
        : lakhs.toFixed(2) + ' L';
    } else {
      return amount % 1 === 0 ? amount.toFixed(0) : amount.toString();
    }
  }
  setTimelineDates(): void {
    const baseTimeline = [
      { title: 'Lead Created', image: 'assets/images/icons/leads.svg' },
      { title: 'Files Uploaded', image: 'assets/images/icons/files.svg' },
      { title: 'Credit Evaluation', image: 'assets/images/icons/credit.svg' },
      { title: 'Login', image: 'assets/images/icons/logins.svg' },
      { title: 'Approved', image: 'assets/images/icons/sanctions.svg' },
      { title: 'Disbursed', image: 'assets/images/icons/disbursal.svg' }
    ];

    this.timelineEvents = baseTimeline.map(item => {
      let date = null;
      switch (item.title) {
        case 'Lead Created':
          date = this.leadsData?.leadData?.createdOn;
          break;
        case 'Files Uploaded':
          date = this.leadsData?.documents?.createdOn;
          break;
        case 'Credit Evaluation':
          date = this.leadsData?.credits?.createdOn;
          break;
        case 'Login':
          date = this.leadsData?.leadData?.loginDate;
          break;
        case 'Approved':
          date = this.leadsData?.leadData?.approvalDate;
          break;
        case 'Disbursed':
          date = this.leadsData?.leadData?.disbursalDate;
          break;
      }
      return { ...item, date: date ? new Date(date) : null };
    });

    // If no timeline events are set, handle accordingly (e.g., setting default dates or showing a message)
    if (!this.timelineEvents || this.timelineEvents.length === 0) {
      console.warn('No timeline events found for the provided lead.');
    }
  }

  // getLeadById(id: string) {
  //   this.loading = true;
  //   this.leadsService.getLeadDetailsById(id).subscribe(
  //     (response) => {
  //       this.leads = response;
  //       console.log('leads', this.leads);
  //       this.updateDisplayedItems();
  //       this.loading = false;
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  getLoanLeadById(id: string) {
    this.loading = true;
    this.leadsService.getLoanLeadById(id).subscribe(
      (response) => {
        this.leadsData = response[0];
        // console.log('loanleads', this.loanleads);
        this.updateDisplayedItems();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  // updateDisplayedItems() {
  //   const loanDisplayProperty =
  //     this.leadsData && this.leadsData?.employmentStatus === 'employed'
  //       ? 'contactPerson'
  //       : 'businessName';
  //   this.displayedItems = [
  //     { data: this.leadsData?.leadData, displayProperty: 'businessName', image: "assets/images/profile/office.png", },
  //     { data: this.leadsData, displayProperty: loanDisplayProperty, image: "assets/images/profile/profile.png" },
  //   ];
  // }
  updateDisplayedItems() {
    if (this.isBusinessView()) {
      this.displayedItems = [
        {
          data: this.leadsData?.leadData,
          displayProperty: 'businessName',
          image: 'assets/images/profile/office.png'
        }
      ];
    } else if (this.isPersonalView()) {
      this.displayedItems = [
        {
          data: this.leadsData?.leadData,
          displayProperty: 'contactPerson',
          image: 'assets/images/profile/profile.png'
        }
      ];
    } else {
      this.displayedItems = [];
    }
  }

  getSourceName(userId) {
    if (this.leadUsers && this.leadUsers.length > 0) {
      let leadUserName = this.leadUsers.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
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

  getEntityName(entity) {
    if (this.businessEntities && this.businessEntities.length > 0) {
      let entityName = this.businessEntities.filter(
        (leadStatus) => leadStatus.name == entity
      );
      return (
        (entityName &&
          entityName[0] &&
          entityName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers) => {
        this.leadUsers = leadUsers;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLeadSourceName(userId) {
    if (this.leadSources && this.leadSources.length > 0) {
      let leadSourceName = this.leadSources.filter(
        (leadUser) => leadUser.id == userId
      );
      return (
        (leadSourceName && leadSourceName[0] && leadSourceName[0].name) || ''
      );
    }
    return '';
  }
  getLeadSourcesvalues(filter = {}) {
    this.loading = true;
    this.leadsService.getLeadSources(filter).subscribe(
      (leadSources) => {
        this.leadSources = leadSources;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  updateLead(leadId) {
    this.routingService.handleRoute('leads/update/' + leadId, null);
  }
  goBack() {
    this.location.back();
  }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  getBankers(filter = {}) {
    this.loading = true;
    this.leadsService.getBankers(filter).subscribe(
      (response: any) => {
        this.banks = [{ name: 'All' }, ...response];

        // Create a Map for quick lookup
        this.bankMap.clear();
        for (const bank of response) {
          if (bank.id && bank.name) {
            this.bankMap.set(bank.id, bank.name);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLenderName(bankId: number): string {
    return this.bankMap.get(bankId) || '';
  }
  isValidDate(date: any): boolean {
    return date && !isNaN(new Date(date).getTime());
  }
}
