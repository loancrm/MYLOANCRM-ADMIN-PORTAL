import { Component, OnInit,ViewChild  } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';
import { Contact } from '../modules/models';
import { RoutingService } from 'src/app/services/routing-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.scss'
})
export class CampaignComponent implements OnInit {

  // ── TABS ───────────────────────────────────────────────
  activeTab: 'socialMedia' | 'accounts' = 'socialMedia';

  // ── CONTACTS ───────────────────────────────────────────
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  headerUploading = false;
  headerIsMetaHandle = false;
  loading = false;
  searchText: string = '';
  searchFilter: any = {};

  platformOptions = [
    // { label: 'All', value: 'ALL' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Manual', value: 'Manual' },
    { label: 'Website', value: 'Website' },
    { label: 'Excel Import', value: 'ExcelImport' }
  ];

  // selectedPlatform: string = 'ALL';
  selectedPlatforms: string[] = ['Facebook', 'Website'];
  selectedDemoStatus: string = '';

  demoStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Not Demo Booked', value: 'notBooked' }, 
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Rescheduled', value: 'rescheduled' }
  ];

  // ── ✅ NEW: Registration Status Filter (Social Media tab) ──
  selectedRegistrationStatus: string = '';
  registrationStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Not Registered', value: 'notRegistered' },
    { label: 'Registered', value: 'registered' },
  ];

  headerAlreadyUploaded = false;

  // ── TEMPLATES ──────────────────────────────────────────
  templates: any[] = [];
  selectedTemplate: any = null;
  templateBodyText = '';
  templateParams: string[] = [];
  paramMappings: { type: 'db' | 'manual'; dbField: string; manualValue: string; isButtonParam?: boolean; }[] = [];

  // ── CAMPAIGN ───────────────────────────────────────────
  campaignName = '';
  languageCode = 'en_US';
  sending = false;
  result: any = null;
  errorMsg = '';

  // ── ✅ NEW: Skip Registered Toggle (Accounts tab) ──────
  skipRegisteredAccounts: boolean = false;

  // ── DIALOG ─────────────────────────────────────────────
  showCreateDialog = false;
  editTemplateData: any = null;

  // ── DB FIELD OPTIONS (Social Media Leads) ──────────────
  socialMediaDbFields = [
    { label: 'Name', value: 'name' },
    { label: 'Phone', value: 'mobileNumber' },
    { label: 'Email', value: 'email' },
    { label: 'City', value: 'city' },
    { label: 'Company', value: 'company' },
    { label: 'State', value: 'state' },
    { label: 'Platform', value: 'platform' },
  ];

  // ── DB FIELD OPTIONS (Accounts) ────────────────────────
  accountsDbFields = [
    { label: 'Name', value: 'name' },
    { label: 'Business Name', value: 'businessName' },
    { label: 'Phone', value: 'mobileNumber' },
    { label: 'Email', value: 'email' },
    { label: 'City', value: 'city' },
    { label: 'Wallet Balance', value: 'walletBalance' },
    { label: 'Created Date', value: 'createdOn' },
    { label: 'Plan Name', value: 'latest_plan_name' },
    { label: 'Plan Status', value: 'latest_status' },
    { label: 'Billing Cycle', value: 'latest_billing_cycle' },
    { label: 'Start Date', value: 'start_date' },
    { label: 'End Date', value: 'end_date' },
  ];

  // ── Account filter properties ──────────────────────────
  selectedPlanType: string = 'ALL';
  selectedStatusType: string = 'ALL';
  selectedBillingCycle: string = 'ALL';

  planTypeOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Free Trial', value: 'Free Trial' },
    { label: 'Basic', value: 'Basic' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Professional', value: 'Professional' }
  ];

  accountStatusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
  ];

  billingCycleOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ];

  // ── TEMPLATE PREVIEW PARTS ─────────────────────────────
  templateHeaderText = '';
  templateFooterText = '';
  templateButtons: any[] = [];

  // ── HEADER MEDIA ───────────────────────────────────────
  templateHeaderType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'NONE' = 'NONE';
  headerMediaUrl: string = '';
  headerMediaFile: File | null = null;
  headerMediaUploadMode: 'url' | 'upload' = 'url';
  // ── PAGINATION ─────────────────────────────────────────
  socialMediaTotal = 0;
  accountsTotal = 0;
  socialMediaFirst = 0;
  accountsFirst = 0;
  pageRows = 10;
  contactsLoading = false;

@ViewChild('socialMediaTable') socialMediaTable: any;
@ViewChild('accountsTable') accountsTable: any;

selectedRemark: string = '';
adminRemarkOptions: { label: string; value: any }[] = [];
// Add alongside other filter properties
selectedEnquiryType: string = '';

enquiryTypeOptions = [
  { label: 'All',          value: '' },
  { label: 'Loan Enquiry', value: 'loanEnquiry' },
  { label: 'CRM Enquiry',  value: 'crmEnquiry' },
];
selectedAccountRemark: string = '';
accountRemarkOptions: { label: string; value: any }[] = [];
// Add alongside other properties
socialMediaFilterConfig: any[] = [];
accountsFilterConfig: any[] = [];
socialMediaAppliedFilter: any = {};
accountsAppliedFilter: any = {};
  // ── DYNAMIC DB FIELD OPTIONS ───────────────────────────
  get dbFieldOptions() {
    return this.activeTab === 'socialMedia'
      ? this.socialMediaDbFields
      : this.accountsDbFields;
  }
  get remarkFilterOptions(): { label: string; value: any }[] {
    return [{ label: 'All Remarks', value: '' }, ...this.adminRemarkOptions];
  }
  get accountRemarkFilterOptions(): { label: string; value: any }[] {
    return [{ label: 'All Remarks', value: '' }, ...this.accountRemarkOptions];
  }
  constructor(
    private campaignService: CampaignService,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.searchFilter['status-eq'] = 1;
    this.loadSocialMediaLeads();
    this.loadTemplates();
    this.loadAdminRemarks();
    this.loadAccountRemarks();
    this.setSocialMediaFilterConfig();
this.setAccountsFilterConfig();
  }

  // ── TAB SWITCH ─────────────────────────────────────────
  // switchTab(tab: 'socialMedia' | 'accounts'): void {
  //   this.activeTab = tab;
  //   this.selectedContacts = [];
  //   this.searchText = '';
  //   this.selectedPlatform = 'ALL';
  //   this.selectedDemoStatus = '';
  //   this.selectedRegistrationStatus = '';    // ✅ reset registration filter
  //   this.searchFilter = {};
  //   this.contacts = [];
  //   this.filteredContacts = [];

  //   // ✅ Reset account filters
  //   this.selectedPlanType = 'ALL';
  //   this.selectedStatusType = 'ALL';
  //   this.selectedBillingCycle = 'ALL';
  //   this.skipRegisteredAccounts = false;    // ✅ reset toggle

  //   if (tab === 'socialMedia') {
  //     this.searchFilter['status-eq'] = 1;
  //     this.loadSocialMediaLeads();
  //   } else {
  //     this.loadAccounts();
  //   }
  // }
  switchTab(tab: 'socialMedia' | 'accounts'): void {
    this.activeTab = tab;
    this.selectedContacts = [];
    this.searchText = '';
    // this.selectedPlatform = 'ALL';
    this.selectedPlatforms = ['Facebook', 'Website'];
    this.selectedDemoStatus = '';
    this.selectedRegistrationStatus = '';
    this.searchFilter = {};
    this.contacts = [];
    this.filteredContacts = [];
    this.socialMediaTotal = 0;
    this.accountsTotal = 0;

    this.selectedPlanType = 'ALL';
    this.selectedStatusType = 'ALL';
    this.selectedBillingCycle = 'ALL';
    this.skipRegisteredAccounts = false;
    this.selectedRemark = '';
    this.selectedEnquiryType = '';
    this.selectedAccountRemark = '';
    

    if (tab === 'socialMedia') {
      this.loadSocialMediaLeads({ first: 0, rows: 10 });
    } else {
      this.loadAccounts({ first: 0, rows: 10 });
    }
  }
loadSocialMediaLeads(event: any = { first: 0, rows: 10 }): void {
  this.contactsLoading = true;

  const start  = event.first ?? 0;
  const length = event.rows  ?? 10;

  let sortField = 'CreatedOn';
  let sortOrder = 'desc';

  if (event.sortField) {
    sortField = event.sortField;
    sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
  }

  const filter: any = {
    ...this.searchFilter,
    start,
    length,
    sort:  sortField,
    order: sortOrder,
    'status-eq': 1,
  };

  if (this.selectedRegistrationStatus) {
    filter['registrationStatus'] = this.selectedRegistrationStatus;
  }
  if (this.selectedPlatforms && this.selectedPlatforms.length > 0) {
    filter['Platform-eq'] = this.selectedPlatforms.join(',');
  }
  if (this.selectedDemoStatus) {
    filter['demoStatus-eq'] = this.selectedDemoStatus;
  }
  if (this.selectedRemark) {
    filter['remarkId-eq'] = this.selectedRemark;
  }
  if (this.selectedEnquiryType) {
    filter['enquiryType-eq'] = this.selectedEnquiryType;
  }

  // Merge app-filter panel filters
  Object.keys(this.socialMediaAppliedFilter).forEach(key => {
    const val = this.socialMediaAppliedFilter[key];
    if (val !== undefined && val !== null && val !== '') {
      filter[key] = val;
    }
  });

  // Count query — send same filter WITHOUT pagination params
  const countFilter = { ...filter };
  delete countFilter['start'];
  delete countFilter['length'];
  delete countFilter['sort'];
  delete countFilter['order'];

  this.leadsService.getSocilaMediaCount(countFilter).subscribe((count: any) => {
    this.socialMediaTotal = Number(count) || 0;
  });

  this.leadsService.getSocialMediaLeads(filter).subscribe(
    (data: any) => {
      this.contacts = data.map((lead: any) => ({
        name:         lead.Name         || '',
        mobileNumber: lead.PhoneNumber  || '',
        email:        lead.Email        || '',
        city:         lead.City         || '',
        company:      lead.Company      || '',
        state:        lead.State        || '',
        platform:     lead.Platform     || '',
        isRegistered: lead.isRegistered || false,
        id:           lead.id,
      }));
      this.filteredContacts = this.contacts;
      this.contactsLoading  = false;
    },
    () => {
      this.errorMsg        = 'Failed to load social media leads';
      this.contactsLoading = false;
    }
  );
}

  // ── LOAD ACCOUNTS ──────────────────────────────────────

  loadAccounts(event: any = { first: 0, rows: 10 }): void {
  this.contactsLoading = true;
  const filter: any = { ...this.searchFilter };
  filter['status-eq'] = 1;
  filter['from']  = event.first ?? 0;
  filter['count'] = event.rows  ?? 10;

  if (this.selectedPlanType && this.selectedPlanType !== 'ALL') {
    filter['latest_plan_name-eq'] = this.selectedPlanType;
  }
  if (this.selectedStatusType && this.selectedStatusType !== 'ALL') {
    filter['latest_status-eq'] = this.selectedStatusType;
  }
  if (this.selectedBillingCycle && this.selectedBillingCycle !== 'ALL') {
    filter['latest_billing_cycle-eq'] = this.selectedBillingCycle;
  }
  if (this.selectedAccountRemark) {
    filter['remarkId-eq'] = this.selectedAccountRemark;
  }

  // ✅ Also merge any applied filter from app-filter panel
  Object.keys(this.accountsAppliedFilter).forEach(key => {
    const val = this.accountsAppliedFilter[key];
    if (val !== undefined && val !== null && val !== '') {
      filter[key] = val;
    }
  });

  this.leadsService.getAccountsCount(filter).subscribe((count: any) => {
    this.accountsTotal = Number(count) || 0;
  });

  this.leadsService.getAccounts(filter).subscribe(
    (data: any) => {
      this.contacts = data.map((acc: any) => ({
        name:                acc.name             || '',
        businessName:        acc.businessName     || '',
        mobileNumber:        acc.mobile           || '',
        email:               acc.emailId          || '',
        city:                acc.city             || '',
        accountId:           acc.accountId        || '',
        walletBalance:       acc.walletBalance    || '',
        createdOn:           acc.createdOn        || '',
        latest_plan_name:    acc.latest_plan_name || '',
        latest_status:       acc.latest_status    || '',
        latest_billing_cycle: acc.latest_billing_cycle || '',
        start_date:          acc.start_date       || '',
        end_date:            acc.end_date         || '',
      }));
      this.filteredContacts  = this.contacts;
      this.contactsLoading   = false;
    },
    () => {
      this.errorMsg        = 'Failed to load accounts';
      this.contactsLoading = false;
    }
  );
}
  applyFilters(): void {
  delete this.searchFilter['search'];

  if (this.searchText?.trim()) {
    this.searchFilter['search'] = this.searchText;
  }

  if (this.activeTab === 'socialMedia') {
    if (this.socialMediaTable) this.socialMediaTable.first = 0;
    this.loadSocialMediaLeads({ first: 0, rows: 10 });
  } else {
    if (this.accountsTable) this.accountsTable.first = 0;
    this.loadAccounts({ first: 0, rows: 10 });
  }
}

  // ── LOAD TEMPLATES ─────────────────────────────────────
  loadTemplates(): void {
    this.leadsService.getWhatsappTemplatesFromDB().subscribe(
      (res: any) => { this.templates = res.data || []; },
      () => { this.errorMsg = 'Failed to load templates'; }
    );
  }

  // ── TEMPLATE SELECT ────────────────────────────────────
  onTemplateSelect(): void {
    if (!this.selectedTemplate) {
      this.templateBodyText = '';
      this.templateHeaderText = '';
      this.templateFooterText = '';
      this.templateButtons = [];
      this.templateParams = [];
      this.paramMappings = [];
      this.templateHeaderType = 'NONE';
      this.headerMediaUrl = '';
      this.headerMediaFile = null;
      return;
    }

    const components = this.selectedTemplate.components || [];
    const headerComp = components.find((c: any) => c.type === 'HEADER');
    const bodyComp   = components.find((c: any) => c.type === 'BODY');
    const footerComp = components.find((c: any) => c.type === 'FOOTER');
    const buttonComp = components.find((c: any) => c.type === 'BUTTONS');

    const headerFormat = headerComp?.format?.toUpperCase() || 'NONE';
    this.templateHeaderType = ['IMAGE','VIDEO','DOCUMENT'].includes(headerFormat)
      ? headerFormat
      : (headerComp?.text ? 'TEXT' : 'NONE');

    this.templateHeaderText = headerComp?.text || '';
    this.templateBodyText   = bodyComp?.text || this.selectedTemplate.body_text || '';
    this.templateFooterText = footerComp?.text || '';
    this.templateButtons    = buttonComp?.buttons || [];

    const existingHeaderHandle = headerComp?.example?.header_handle?.[0] || null;
    if (existingHeaderHandle) {
      this.headerMediaUrl  = existingHeaderHandle;
      this.headerMediaFile = null;
      this.headerAlreadyUploaded = true;
      this.headerIsMetaHandle   = true;
    } else {
      this.headerMediaUrl  = '';
      this.headerMediaFile = null;
      this.headerAlreadyUploaded = false;
    }

    let buttonParamCount = 0;
    this.templateButtons.forEach((btn: any) => {
      if (btn.type === 'URL') {
        const urlMatches = (btn.url || '').match(/{{\d+}}/g);
        if (urlMatches && urlMatches.length > 0) {
          buttonParamCount += urlMatches.length;
        } else if (btn.example && Array.isArray(btn.example) && btn.example.length > 0) {
          buttonParamCount += 1;
        }
      }
    });

    const textSources = [this.templateHeaderText, this.templateBodyText].join(' ');
    const textMatches = textSources.match(/{{\d+}}/g) || [];
    const textParams  = [...new Set(textMatches)] as string[];

    const startIndex   = textParams.length + 1;
    const buttonParams = Array.from({ length: buttonParamCount }, (_, i) => `{{${startIndex + i}}}`);

    this.templateParams = [...textParams, ...buttonParams];
    this.languageCode   = this.selectedTemplate.language || 'en_US';

    this.paramMappings = this.templateParams.map((param, i) => {
      const isButtonParam = i >= textParams.length;
      return { type: 'manual' as 'db' | 'manual', dbField: '', manualValue: '', isButtonParam };
    });
  }

  // ── DIALOG ─────────────────────────────────────────────
  openCreateDialog(): void { this.editTemplateData = null; this.showCreateDialog = true; }
  onTemplateSaved(): void { this.showCreateDialog = false; this.loadTemplates(); }
  onDialogClose(): void { this.showCreateDialog = false; this.editTemplateData = null; }

  // ── CONTACT SELECTION ──────────────────────────────────
  toggleContact(contact: Contact, checked: boolean): void {
    if (checked) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts = this.selectedContacts.filter(
        (c) => c.mobileNumber !== contact.mobileNumber
      );
    }
  }

  isSelected(contact: Contact): boolean {
    return this.selectedContacts.some((c) => c.mobileNumber === contact.mobileNumber);
  }

  selectAll(checked: boolean): void {
    this.selectedContacts = checked ? [...this.filteredContacts] : [];
  }

  allSelected(): boolean {
    return this.filteredContacts.length > 0 &&
      this.filteredContacts.every(c => this.isSelected(c));
  }

  // ── PARAMS ─────────────────────────────────────────────
  resolveParam(contact: any, index: number): string {
    const mapping = this.paramMappings[index];
    let value = mapping.type === 'manual'
      ? (mapping.manualValue || '')
      : (contact[mapping.dbField] || '');

    if (mapping.dbField === 'mobileNumber' || mapping.isButtonParam) {
      value = String(value).trim().replace(/^\+91/, '').replace(/^91(\d{10})$/, '$1');
    }

    return value;
  }

  previewMessage(contact: any): string {
    let preview = this.templateBodyText;
    this.templateParams.forEach((param, i) => {
      preview = preview.replace(param, this.resolveParam(contact, i));
    });
    return preview;
  }

  previewHeader(contact: any): string {
    let header = this.templateHeaderText;
    this.templateParams.forEach((param, i) => {
      header = header.replace(param, this.resolveParam(contact, i));
    });
    return header;
  }

  previewHeaderForFirstContact(): string {
    const contact = this.selectedContacts.length > 0 ? this.selectedContacts[0] : null;
    return contact ? this.previewHeader(contact) : this.templateHeaderText || '';
  }

  previewMessageForFirstContact(): string {
    if (this.selectedContacts.length > 0) return this.previewMessage(this.selectedContacts[0]);
    return this.templateBodyText || '';
  }

  getCurrentTime(): string {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  // ── ✅ Count how many selected contacts will be skipped ─
  get skippedCount(): number {
    if (this.activeTab !== 'accounts' || !this.skipRegisteredAccounts) return 0;
    // All contacts in accounts tab ARE registered — skip all if toggle on
    return this.selectedContacts.length;
  }

  get willSendCount(): number {
    if (this.activeTab === 'accounts' && this.skipRegisteredAccounts) return 0;
    return this.selectedContacts.length;
  }

  // ── SEND CAMPAIGN ──────────────────────────────────────
  canSend(): boolean {
    if (!this.selectedContacts.length || !this.selectedTemplate || !this.campaignName) return false;

    // ✅ If accounts tab + skip toggle ON → nothing will be sent → disable button
    if (this.activeTab === 'accounts' && this.skipRegisteredAccounts) return false;

    if (['IMAGE','VIDEO','DOCUMENT'].includes(this.templateHeaderType)) {
      if (this.headerUploading) return false;
      if (!this.headerMediaUrl.trim()) return false;
    }

    return this.paramMappings.every((m) =>
      m.type === 'manual' ? m.manualValue.trim() !== '' : m.dbField !== ''
    );
  }

  sendCampaign(): void {
    if (!this.canSend()) return;
    this.sending = true;
    this.result = null;

    const textParamCount = this.paramMappings.filter(m => !m.isButtonParam).length;

    const contactsWithParams = this.selectedContacts.map((contact) => ({
      ...contact,
      resolvedParams: this.templateParams.map((_, i) => this.resolveParam(contact, i))
    }));

    const hasMediaHeader = ['IMAGE','VIDEO','DOCUMENT'].includes(this.templateHeaderType);

    this.campaignService.sendCampaign({
      campaignName: this.campaignName,
      contacts: contactsWithParams,
      templateName: this.selectedTemplate.name,
      templateBodyText: this.templateBodyText,
      languageCode: this.languageCode,
      sendType: 'bulk',
      buttonParamStartIndex: textParamCount,
      hasImageHeader: hasMediaHeader,
      headerMediaType: this.templateHeaderType,
      imageUrl: this.headerMediaUrl,
      headerIsMetaHandle: this.headerIsMetaHandle,
      // ✅ Tell backend whether to skip registered accounts
      skipRegistered: this.activeTab === 'accounts' ? this.skipRegisteredAccounts : false,
      sourceTab: this.activeTab,
    }).subscribe({
      next: (res) => { this.result = res; this.sending = false; },
      error: () => { this.errorMsg = 'Failed to send campaign'; this.sending = false; }
    });
  }

  onHeaderFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    this.headerMediaFile = file;
    this.headerMediaUrl  = '';
    this.headerUploading = true;

    this.leadsService.uploadWhatsappMedia(file).subscribe({
      next: (res: any) => {
        this.headerMediaUrl  = res.url;
        this.headerUploading = false;
      },
      error: () => {
        this.toastService.showError('Failed to upload media');
        this.headerMediaFile = null;
        this.headerMediaUrl  = '';
        this.headerUploading = false;
      }
    });
  }

  campaignhistory() {
    this.routingService.handleRoute('campaign/campaign-history', null);
  }

  goBack() {
    this.location.back();
  }

//   loadAdminRemarks(): void {
//   const filter = { 'status-eq': 3, 'remarkInternalStatus-eq': 1 };
//   this.leadsService.getAdminRemarks(filter).subscribe(
//     (data: any) => {
//       this.adminRemarkOptions = data.map((r: any) => ({
//         label: r.displayName,
//         value: String(r.remarkId),
//       }));
//     },
//     () => {}
//   );
// }
// loadAccountRemarks(): void {
//   const filter = { 'status-eq': 1, 'remarkInternalStatus-eq': 1 };
//   this.leadsService.getAdminRemarks(filter).subscribe(
//     (data: any) => {
//       this.accountRemarkOptions = data.map((r: any) => ({
//         label: r.displayName,
//         value: String(r.remarkId),
//       }));
//     },
//     () => {}
//   );
// }

loadAdminRemarks(): void {
  const filter = { 'status-eq': 3, 'remarkInternalStatus-eq': 1 };
  this.leadsService.getAdminRemarks(filter).subscribe(
    (data: any) => {
      this.adminRemarkOptions = data.map((r: any) => ({
        label: r.displayName,
        value: String(r.remarkId),
      }));

      // ✅ Update remarks options in filter configs
      const remarkOptions = [
        { label: 'All', value: '' },
        ...this.adminRemarkOptions
      ];
      const smRemarkField = this.socialMediaFilterConfig
        .find(c => c.header === 'Remarks')?.data?.[0];
      if (smRemarkField) smRemarkField.options = remarkOptions;
    },
    () => {}
  );
}

loadAccountRemarks(): void {
  const filter = { 'status-eq': 1, 'remarkInternalStatus-eq': 1 };
  this.leadsService.getAdminRemarks(filter).subscribe(
    (data: any) => {
      this.accountRemarkOptions = data.map((r: any) => ({
        label: r.displayName,
        value: String(r.remarkId),
      }));

      // ✅ Update remarks options in accounts filter config
      const remarkOptions = [
        { label: 'All', value: '' },
        ...this.accountRemarkOptions
      ];
      const accRemarkField = this.accountsFilterConfig
        .find(c => c.header === 'Remarks')?.data?.[0];
      if (accRemarkField) accRemarkField.options = remarkOptions;
    },
    () => {}
  );
}

setSocialMediaFilterConfig(): void {
  this.socialMediaFilterConfig = [
    {
      header: 'Demo Status',
      data: [{ field: 'demoStatus', title: 'Demo Status', type: 'dropdown', filterType: 'eq',
        options: [
          { label: 'All', value: '' },
          { label: 'Not Demo Booked', value: 'notBooked' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Rescheduled', value: 'rescheduled' },
        ]
      }]
    },
    {
      header: 'Registration Status',
      data: [{ field: 'registrationStatus', title: 'Registration Status', type: 'dropdown', filterType: 'eq',
        options: [
          { label: 'All', value: '' },
          { label: 'Not Registered', value: 'notRegistered' },
          { label: 'Registered', value: 'registered' },
        ]
      }]
    },
    {
      header: 'Enquiry Type',
      data: [{ field: 'enquiryType', title: 'Enquiry Type', type: 'dropdown', filterType: 'eq',
        options: [
          { label: 'All', value: '' },
          { label: 'Loan Enquiry', value: 'loanEnquiry' },
          { label: 'CRM Enquiry', value: 'crmEnquiry' },
        ]
      }]
    },
    {
      header: 'Remarks',
      data: [{ field: 'remarkId', title: 'Remarks', type: 'dropdown', filterType: 'eq',
        options: [] // loaded dynamically
      }]
    },
  ];
}

setAccountsFilterConfig(): void {
  this.accountsFilterConfig = [
    {
      header: 'Remarks',
      data: [{ field: 'remarkId-eq', title: 'Remarks', type: 'dropdown', filterType: 'eq',
        options: [] // loaded dynamically
      }]
    },
  ];
}

applySocialMediaConfigFilters(event: any): void {
  console.log('Filter event received:', event);
  if (event['reset']) {
    delete event['reset'];
    this.socialMediaAppliedFilter = {};
  } else {
    this.socialMediaAppliedFilter = { ...event };
  }
  if (this.socialMediaTable) this.socialMediaTable.first = 0;
  this.loadSocialMediaLeads({ first: 0, rows: 10 });
}

applyAccountsConfigFilters(event: any): void {
  if (event['reset']) {
    delete event['reset'];
    this.accountsAppliedFilter = {};
  } else {
    this.accountsAppliedFilter = { ...event };
  }
  if (this.accountsTable) this.accountsTable.first = 0;
  this.loadAccounts({ first: 0, rows: 10 });
}
}