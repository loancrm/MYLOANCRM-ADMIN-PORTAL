
import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';
import { Contact } from '../modules/models';

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

  loading = false;
  searchText: string = '';
  searchFilter: any = {};

  platformOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Manual', value: 'Manual' },
    { label: 'Website', value: 'Website' },
    { label: 'Excel Import', value: 'ExcelImport' }
  ];

  selectedPlatform: string = 'ALL';
  selectedDemoStatus: string = '';

  demoStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Rescheduled', value: 'rescheduled' }
  ];

  // ── TEMPLATES ──────────────────────────────────────────
  templates: any[] = [];
  selectedTemplate: any = null;
  templateBodyText = '';
  templateParams: string[] = [];
  paramMappings: { type: 'db' | 'manual'; dbField: string; manualValue: string,isButtonParam?: boolean; }[] = [];

  // ── CAMPAIGN ───────────────────────────────────────────
  campaignName = '';
  languageCode = 'en_US';
  sending = false;
  result: any = null;
  errorMsg = '';

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
  // accountsDbFields = [
  //   { label: 'Name', value: 'name' },
  //   { label: 'Business Name', value: 'businessName' },
  //   { label: 'Phone', value: 'mobile' },
  //   { label: 'Email', value: 'emailId' },
  //   { label: 'City', value: 'city' },
  // ];
  // ── DB FIELD OPTIONS (Accounts) ────────────────────────
  accountsDbFields = [
  // ── Accounts table fields ──────────────────────────
  { label: 'Name', value: 'name' },
  { label: 'Business Name', value: 'businessName' },
  { label: 'Phone', value: 'mobileNumber' },
  { label: 'Email', value: 'email' },
  { label: 'City', value: 'city' },
  { label: 'Wallet Balance', value: 'walletBalance' },
  { label: 'Created Date', value: 'createdOn' },

  // ── Subscription table fields (via JOIN) ───────────
  { label: 'Plan Name', value: 'latest_plan_name' },
  { label: 'Plan Status', value: 'latest_status' },
  { label: 'Billing Cycle', value: 'latest_billing_cycle' },
  { label: 'Start Date', value: 'start_date' },   // ✅ ADD
  { label: 'End Date', value: 'end_date' },         // ✅ ADD
];

  // ── Add these properties alongside selectedDemoStatus ──────
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

  // ── DYNAMIC DB FIELD OPTIONS ───────────────────────────
  get dbFieldOptions() {
    return this.activeTab === 'socialMedia'
      ? this.socialMediaDbFields
      : this.accountsDbFields;
  }

  constructor(
    private campaignService: CampaignService,
    private leadsService: LeadsService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.searchFilter['status-eq'] = 1;
    this.loadSocialMediaLeads();
    this.loadTemplates();
  }

  // ── TAB SWITCH ─────────────────────────────────────────
  switchTab(tab: 'socialMedia' | 'accounts'): void {
    this.activeTab = tab;
    this.selectedContacts = [];
    this.searchText = '';
    this.selectedPlatform = 'ALL';
    this.selectedDemoStatus = '';
    this.searchFilter = {};
    this.contacts = [];
    this.filteredContacts = [];

    // ✅ Reset account filters too
    this.selectedPlanType = 'ALL';
    this.selectedStatusType = 'ALL';
    this.selectedBillingCycle = 'ALL';

    if (tab === 'socialMedia') {
      this.searchFilter['status-eq'] = 1;
      this.loadSocialMediaLeads();
    } else {
      this.loadAccounts();
    }
  }

  // ── LOAD SOCIAL MEDIA LEADS ────────────────────────────
  loadSocialMediaLeads(): void {
    this.loading = true;
    this.leadsService.getSocialMediaLeads(this.searchFilter).subscribe(
      (data: any) => {
        this.contacts = data.map((lead: any) => ({
          name: lead.Name || '',
          mobileNumber: lead.PhoneNumber || '',
          email: lead.Email || '',
          city: lead.City || '',
          company: lead.Company || '',
          state: lead.State || '',
          platform: lead.Platform || ''
        }));
        this.filteredContacts = this.contacts;
        this.loading = false;
      },
      () => {
        this.errorMsg = 'Failed to load social media leads';
        this.loading = false;
      }
    );
  }

  // ── LOAD ACCOUNTS ──────────────────────────────────────
  // loadAccounts(): void {
  //   this.loading = true;
  //   this.leadsService.getAccounts(this.searchFilter).subscribe(
  //     (data: any) => {
  //       this.contacts = data.map((acc: any) => ({
  //         name: acc.name || '',
  //         businessName: acc.businessName || '',
  //         mobileNumber: acc.mobile || '',
  //         email: acc.emailId || '',
  //         city: acc.city || '',
  //         accountId: acc.accountId || ''
  //       }));
  //       this.filteredContacts = this.contacts;
  //       this.loading = false;
  //     },
  //     () => {
  //       this.errorMsg = 'Failed to load accounts';
  //       this.loading = false;
  //     }
  //   );
  // }
  loadAccounts(): void {
  this.loading = true;

  // ✅ Build filter with plan/status/billing filters
  const filter: any = { ...this.searchFilter };
  filter['status-eq'] = 1; // only active accounts

  if (this.selectedPlanType && this.selectedPlanType !== 'ALL') {
    filter['latest_plan_name-eq'] = this.selectedPlanType;
  }
  if (this.selectedStatusType && this.selectedStatusType !== 'ALL') {
    filter['latest_status-eq'] = this.selectedStatusType;
  }
  if (this.selectedBillingCycle && this.selectedBillingCycle !== 'ALL') {
    filter['latest_billing_cycle-eq'] = this.selectedBillingCycle;
  }

  this.leadsService.getAccounts(filter).subscribe(
    (data: any) => {
      // this.contacts = data.map((acc: any) => ({
      //   name: acc.name || '',
      //   businessName: acc.businessName || '',
      //   mobileNumber: acc.mobile || '',
      //   email: acc.emailId || '',
      //   city: acc.city || '',
      //   accountId: acc.accountId || ''
      // }));
      this.contacts = data.map((acc: any) => ({
      name: acc.name || '',
      businessName: acc.businessName || '',
      mobileNumber: acc.mobile || '',
      email: acc.emailId || '',
      city: acc.city || '',
      accountId: acc.accountId || '',

      // ✅ Add these so resolveParam() can find them
      walletBalance: acc.walletBalance || '',
      createdOn: acc.createdOn || '',
      latest_plan_name: acc.latest_plan_name || '',
      latest_status: acc.latest_status || '',
      latest_billing_cycle: acc.latest_billing_cycle || '',
      start_date: acc.start_date || '',    // ✅ ADD
      end_date: acc.end_date || '',        // ✅ ADD
    }));
      this.filteredContacts = this.contacts;
      this.loading = false;
    },
    () => {
      this.errorMsg = 'Failed to load accounts';
      this.loading = false;
    }
  );
}

  // ── APPLY FILTERS ──────────────────────────────────────
  // applyFilters(): void {
  //   delete this.searchFilter['search'];
  //   delete this.searchFilter['Platform-eq'];
  //   delete this.searchFilter['demoStatus-eq'];
  //   delete this.searchFilter['status-eq'];

  //   if (this.searchText?.trim()) {
  //     this.searchFilter['search'] = this.searchText;
  //   }

  //   if (this.activeTab === 'socialMedia') {
  //     if (this.selectedPlatform && this.selectedPlatform !== 'ALL') {
  //       this.searchFilter['Platform-eq'] = this.selectedPlatform;
  //     }
  //     if (this.selectedDemoStatus) {
  //       this.searchFilter['demoStatus-eq'] = this.selectedDemoStatus;
  //     }
  //     this.searchFilter['status-eq'] = 1;
  //     this.loadSocialMediaLeads();
  //   } else {
  //     this.loadAccounts();
  //   }
  // }
  applyFilters(): void {
    delete this.searchFilter['search'];
    delete this.searchFilter['Platform-eq'];
    delete this.searchFilter['demoStatus-eq'];
    delete this.searchFilter['status-eq'];

    if (this.searchText?.trim()) {
      this.searchFilter['search'] = this.searchText;
    }

    if (this.activeTab === 'socialMedia') {
      if (this.selectedPlatform && this.selectedPlatform !== 'ALL') {
        this.searchFilter['Platform-eq'] = this.selectedPlatform;
      }
      if (this.selectedDemoStatus) {
        this.searchFilter['demoStatus-eq'] = this.selectedDemoStatus;
      }
      this.searchFilter['status-eq'] = 1;
      this.loadSocialMediaLeads();
    } else {
      // ✅ loadAccounts() reads selectedPlanType/Status/BillingCycle internally
      this.loadAccounts();
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
  // onTemplateSelect(): void {
  //   if (!this.selectedTemplate) {
  //     this.templateBodyText = '';
  //     this.templateParams = [];
  //     this.paramMappings = [];
  //     return;
  //   }
  //   const bodyComp = this.selectedTemplate.components?.find((c: any) => c.type === 'BODY');
  //   this.templateBodyText = bodyComp?.text || this.selectedTemplate.body_text || '';
  //   const matches = this.templateBodyText.match(/{{\d+}}/g) || [];
  //   this.templateParams = [...new Set(matches)] as string[];
  //   this.languageCode = this.selectedTemplate.language || 'en_US';
  //   this.paramMappings = this.templateParams.map(() => ({
  //     type: 'db', dbField: '', manualValue: ''
  //   }));
  // }

  onTemplateSelect(): void {
  if (!this.selectedTemplate) {
    this.templateBodyText = '';
    this.templateHeaderText = '';
    this.templateFooterText = '';
    this.templateButtons = [];
    this.templateParams = [];
    this.paramMappings = [];
    return;
  }

  const components = this.selectedTemplate.components || [];

  const headerComp = components.find((c: any) => c.type === 'HEADER');
  const bodyComp   = components.find((c: any) => c.type === 'BODY');
  const footerComp = components.find((c: any) => c.type === 'FOOTER');
  const buttonComp = components.find((c: any) => c.type === 'BUTTONS');

  this.templateHeaderText = headerComp?.text || '';
  this.templateBodyText   = bodyComp?.text   || this.selectedTemplate.body_text || '';
  this.templateFooterText = footerComp?.text || '';
  this.templateButtons    = buttonComp?.buttons || [];

  // ✅ Count button URL params separately
  // WhatsApp URL buttons with dynamic params have {{1}} in the url
  // OR have example array — either way we count how many params the button needs
  let buttonParamCount = 0;
  this.templateButtons.forEach((btn: any) => {
    if (btn.type === 'URL') {
      // ✅ FORMAT 1: url contains {{1}}
      const urlMatches = (btn.url || '').match(/{{\d+}}/g);
      if (urlMatches && urlMatches.length > 0) {
        buttonParamCount += urlMatches.length;
      }
      // ✅ FORMAT 2: example array exists (Meta stores param as example)
      else if (btn.example && Array.isArray(btn.example) && btn.example.length > 0) {
        buttonParamCount += 1; // one dynamic param per URL button with example
      }
    }
  });

  // ✅ Collect params from HEADER + BODY text
  const textSources = [
    this.templateHeaderText,
    this.templateBodyText,
  ].join(' ');

  const textMatches = textSources.match(/{{\d+}}/g) || [];
  const textParams = [...new Set(textMatches)] as string[];

  // ✅ Build button param placeholders AFTER text params
  // e.g. if body has {{1}} {{2}}, button params become {{3}}
  const startIndex = textParams.length + 1;
  const buttonParams = Array.from(
    { length: buttonParamCount },
    (_, i) => `{{${startIndex + i}}}`
  );

  // ✅ Combined: text params first, then button params
  this.templateParams = [...textParams, ...buttonParams];
  // ✅ ADD THESE — after this.templateParams = [...textParams, ...buttonParams];
console.log('🔍 Template buttons raw:', JSON.stringify(this.templateButtons));
console.log('🔍 textParams:', textParams);
console.log('🔍 buttonParamCount:', buttonParamCount);
console.log('🔍 Final templateParams:', this.templateParams);

  this.languageCode = this.selectedTemplate.language || 'en_US';

  this.paramMappings = this.templateParams.map((param, i) => {
    const isButtonParam = i >= textParams.length;
    return {
      type: 'manual' as 'db' | 'manual', // ✅ button params default to manual (usually a URL suffix)
      dbField: '',
      manualValue: '',
      isButtonParam  // ✅ flag so UI can show a hint
    };
  });
}

//   onTemplateSelect(): void {
//   if (!this.selectedTemplate) {
//     this.templateBodyText = '';
//     this.templateParams = [];
//     this.paramMappings = [];
//     return;
//   }

//   const components = this.selectedTemplate.components || [];

//   // ── Extract each component ──────────────────────────
//   const headerComp = components.find((c: any) => c.type === 'HEADER');
//   const bodyComp   = components.find((c: any) => c.type === 'BODY');
//   const footerComp = components.find((c: any) => c.type === 'FOOTER');
//   const buttonComp = components.find((c: any) => c.type === 'BUTTONS');

//   // ── Store individually for preview ─────────────────
//   this.templateHeaderText = headerComp?.text || '';
//   this.templateBodyText   = bodyComp?.text   || this.selectedTemplate.body_text || '';
//   this.templateFooterText = footerComp?.text || '';
//   this.templateButtons    = buttonComp?.buttons || [];

//   // ── Collect ALL params from ALL components ──────────
//   const allText = [
//     this.templateHeaderText,
//     this.templateBodyText,
//     ...this.templateButtons.map((b: any) => b.text || '')
//   ].join(' ');

//   const allMatches = allText.match(/{{\d+}}/g) || [];
//   this.templateParams = [...new Set(allMatches)] as string[];

//   this.languageCode = this.selectedTemplate.language || 'en_US';

//   this.paramMappings = this.templateParams.map(() => ({
//     type: 'db' as 'db' | 'manual',
//     dbField: '',
//     manualValue: ''
//   }));
// }

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
  // resolveParam(contact: any, index: number): string {
  //   const mapping = this.paramMappings[index];
  //   if (mapping.type === 'manual') return mapping.manualValue || '';
  //   return contact[mapping.dbField] || '';
  // }
  resolveParam(contact: any, index: number): string {
  const mapping = this.paramMappings[index];
  let value = mapping.type === 'manual'
    ? (mapping.manualValue || '')
    : (contact[mapping.dbField] || '');

  // ✅ If this is a phone field, strip +91 prefix and trim
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

  // ── SEND CAMPAIGN ──────────────────────────────────────
  canSend(): boolean {
    if (!this.selectedContacts.length || !this.selectedTemplate || !this.campaignName) return false;
    return this.paramMappings.every((m) =>
      m.type === 'manual' ? m.manualValue.trim() !== '' : m.dbField !== ''
    );
  }

  // sendCampaign(): void {
  //   if (!this.canSend()) return;
  //   this.sending = true;
  //   this.result = null;

  //   const contactsWithParams = this.selectedContacts.map((contact) => ({
  //     ...contact,
  //     resolvedParams: this.templateParams.map((_, i) => this.resolveParam(contact, i))
  //   }));

  //   this.campaignService.sendCampaign({
  //     campaignName: this.campaignName,
  //     contacts: contactsWithParams,
  //     templateName: this.selectedTemplate.name,
  //     templateBodyText: this.templateBodyText,
  //     languageCode: this.languageCode,
  //     sendType: 'bulk',
  //   }).subscribe({
  //     next: (res) => { this.result = res; this.sending = false; },
  //     error: () => { this.errorMsg = 'Failed to send campaign'; this.sending = false; }
  //   });
  // }
  sendCampaign(): void {
  if (!this.canSend()) return;
  this.sending = true;
  this.result = null;

  // ✅ How many params are body params (before button params start)
  const textParamCount = this.paramMappings.filter(m => !m.isButtonParam).length;

  const contactsWithParams = this.selectedContacts.map((contact) => ({
    ...contact,
    resolvedParams: this.templateParams.map((_, i) => this.resolveParam(contact, i))
  }));

  this.campaignService.sendCampaign({
    campaignName: this.campaignName,
    contacts: contactsWithParams,
    templateName: this.selectedTemplate.name,
    templateBodyText: this.templateBodyText,
    languageCode: this.languageCode,
    sendType: 'bulk',
    buttonParamStartIndex: textParamCount,  // ✅ NEW
  }).subscribe({
    next: (res) => { this.result = res; this.sending = false; },
    error: () => { this.errorMsg = 'Failed to send campaign'; this.sending = false; }
  });
}
}