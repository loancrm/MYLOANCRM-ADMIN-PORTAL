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

  // ── CONTACTS ───────────────────────────────────────────
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContacts: Contact[] = [];

  loading = false;
  searchText: string = '';

  // ✅ SAME LIKE SAMPLE
  searchFilter: any = {};

  platformOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Manual', value: 'Manual' }
  ];

  selectedPlatform: string = 'ALL';

  // ── TEMPLATES ──────────────────────────────────────────
  templates: any[] = [];
  selectedTemplate: any = null;
  templateBodyText = '';
  templateParams: string[] = [];
  paramMappings: { type: 'db' | 'manual'; dbField: string; manualValue: string }[] = [];

  // ── CAMPAIGN ───────────────────────────────────────────
  campaignName = '';
  languageCode = 'en_US';
  sending = false;
  result: any = null;
  errorMsg = '';

  // ── DIALOG ─────────────────────────────────────────────
  showCreateDialog = false;
  editTemplateData: any = null;

  // ── DB FIELD OPTIONS ───────────────────────────────────
  dbFieldOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Phone', value: 'mobileNumber' },
    { label: 'Email', value: 'email' },
    { label: 'City', value: 'city' },
    { label: 'Company', value: 'company' },
    { label: 'State', value: 'state' },
    { label: 'Platform', value: 'platform' },
  ];

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

  // ── LOAD CONTACTS (BACKEND FILTER ONLY) ─────────────────
  loadSocialMediaLeads(): void {
    this.loading = true;

    this.leadsService.getSocialMediaLeads(this.searchFilter).subscribe(
      (data: any) => {

        // ✅ KEEP YOUR ORIGINAL MAPPING
        this.contacts = data.map((lead: any) => ({
          name: lead.Name || '',
          mobileNumber: lead.PhoneNumber || '',
          email: lead.Email || '',
          city: lead.City || '',
          company: lead.Company || '',
          state: lead.State || '',
          platform: lead.Platform || ''
        }));

        // ✅ NO FRONTEND FILTER
        this.filteredContacts = this.contacts;

        this.loading = false;
      },
      () => {
        this.errorMsg = 'Failed to load social media leads';
        this.loading = false;
      }
    );
  }
  applyFilters(): void {

  // ❌ CLEAR OLD FILTERS
  delete this.searchFilter['search'];
  delete this.searchFilter['Platform-eq'];
  delete this.searchFilter['status-eq'];

  const value = this.searchText;

  // ✅ SEARCH
  if (value && value.trim() !== '') {
    this.searchFilter['search'] = value;
  }

  // ✅ PLATFORM
  if (this.selectedPlatform && this.selectedPlatform !== 'ALL') {
    this.searchFilter['Platform-eq'] = this.selectedPlatform;
  }

  // ✅ ALWAYS ONLY ACTIVE (IMPORTANT 🔥)
  this.searchFilter['status-eq'] = 1;

  // ✅ CALL API
  this.loadSocialMediaLeads();
}
//   applyFilters(): void {

//   // ❌ CLEAR OLD FILTERS
//   delete this.searchFilter['search'];
//   delete this.searchFilter['Platform-eq'];
  

//   const value = this.searchText;

//   // ✅ ONLY ONE SEARCH PARAM (IMPORTANT)
//   if (value && value.trim() !== '') {
//     this.searchFilter['search'] = value;
//   }

//   // ✅ PLATFORM FILTER (same as your sample)
//   if (this.selectedPlatform && this.selectedPlatform !== 'ALL') {
//     // this.searchFilter['Platform-eq'] = this.selectedPlatform;
//     this.searchFilter['platform-eq'] = this.selectedPlatform;
//   }

//   // ✅ CALL API
//   this.loadSocialMediaLeads();
// }
  // ── LOAD TEMPLATES ─────────────────────────────────────
  loadTemplates(): void {
    this.leadsService.getWhatsappTemplatesFromDB().subscribe(
      (res: any) => {
        this.templates = res.data || [];
      },
      () => {
        this.errorMsg = 'Failed to load templates';
      }
    );
  }

  // ── TEMPLATE SELECT ────────────────────────────────────
  onTemplateSelect(): void {
    if (!this.selectedTemplate) {
      this.templateBodyText = '';
      this.templateParams = [];
      this.paramMappings = [];
      return;
    }

    const bodyComp = this.selectedTemplate.components?.find(
      (c: any) => c.type === 'BODY'
    );

    this.templateBodyText =
      bodyComp?.text || this.selectedTemplate.body_text || '';

    const matches = this.templateBodyText.match(/{{\d+}}/g) || [];
    this.templateParams = [...new Set(matches)];

    this.languageCode = this.selectedTemplate.language || 'en_US';

    this.paramMappings = this.templateParams.map(() => ({
      type: 'db',
      dbField: '',
      manualValue: ''
    }));
  }

  // ── DIALOG FUNCTIONS (FIX ERRORS) ──────────────────────
  openCreateDialog(): void {
    this.editTemplateData = null;
    this.showCreateDialog = true;
  }

  onTemplateSaved(): void {
    this.showCreateDialog = false;
    this.loadTemplates();
  }

  onDialogClose(): void {
    this.showCreateDialog = false;
    this.editTemplateData = null;
  }

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
    return this.selectedContacts.some(
      (c) => c.mobileNumber === contact.mobileNumber
    );
  }

  selectAll(checked: boolean): void {
    this.selectedContacts = checked ? [...this.filteredContacts] : [];
  }

  allSelected(): boolean {
  return this.filteredContacts.length > 0 &&
    this.filteredContacts.every(c => this.isSelected(c));
}

  // allSelected(): boolean {
  //   return this.filteredContacts.length > 0 &&
  //     this.selectedContacts.length === this.filteredContacts.length;
  // }

  // ── PARAMS ─────────────────────────────────────────────
  resolveParam(contact: any, index: number): string {
    const mapping = this.paramMappings[index];
    if (mapping.type === 'manual') return mapping.manualValue || '';
    return contact[mapping.dbField] || '';
  }

  previewMessage(contact: any): string {
    let preview = this.templateBodyText;

    this.templateParams.forEach((param, i) => {
      preview = preview.replace(param, this.resolveParam(contact, i));
    });

    return preview;
  }

  previewMessageForFirstContact(): string {
    if (this.selectedContacts.length > 0) {
      return this.previewMessage(this.selectedContacts[0]);
    }
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
    if (!this.selectedContacts.length || !this.selectedTemplate || !this.campaignName)
      return false;

    return this.paramMappings.every((m) =>
      m.type === 'manual'
        ? m.manualValue.trim() !== ''
        : m.dbField !== ''
    );
  }

  sendCampaign(): void {
    if (!this.canSend()) return;

    this.sending = true;
    this.result = null;

    const contactsWithParams = this.selectedContacts.map((contact) => ({
      ...contact,
      resolvedParams: this.templateParams.map((_, i) =>
        this.resolveParam(contact, i)
      )
    }));

    this.campaignService.sendCampaign({
      campaignName: this.campaignName,
      contacts: contactsWithParams,
      templateName: this.selectedTemplate.name,
      templateBodyText: this.templateBodyText, 
      languageCode: this.languageCode,
      sendType:'bulk',    
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.sending = false;
      },
      error: () => {
        this.errorMsg = 'Failed to send campaign';
        this.sending = false;
      }
    });
  }
}
