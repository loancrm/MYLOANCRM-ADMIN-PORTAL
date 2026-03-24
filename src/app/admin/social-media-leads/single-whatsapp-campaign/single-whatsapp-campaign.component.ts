import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LeadsService } from '../../leads/leads.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-single-whatsapp-campaign',
  templateUrl: './single-whatsapp-campaign.component.html',
  styleUrl: './single-whatsapp-campaign.component.scss'
})
export class SingleWhatsappCampaignComponent implements OnInit {

  // ── Lead ───────────────────────────────────────────────
  lead: any = null;

  // ── Templates ──────────────────────────────────────────
  templates: any[] = [];
  selectedTemplate: any = null;
  templateBodyText = '';
  templateParams: string[] = [];
  paramMappings: { type: 'db' | 'manual'; dbField: string; manualValue: string }[] = [];

  // ── Campaign ───────────────────────────────────────────
  campaignName = '';
  languageCode = 'en_US';
  sending = false;
  sent = false;
  result: any = null;
  errorMsg = '';
  messageMode: 'template' | 'custom' = 'template';
customMessage = '';
isActive24h: boolean = false;
lastSeenText: string = '';

  // ── DB Field Options ───────────────────────────────────
  dbFieldOptions = [
    { label: 'Name',     value: 'name' },
    { label: 'Phone',    value: 'mobileNumber' },
    { label: 'Email',    value: 'email' },
    { label: 'City',     value: 'city' },
    { label: 'Company',  value: 'company' },
    { label: 'State',    value: 'state' },
    { label: 'Platform', value: 'platform' },
  ];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private toastService: ToastService
  ) {}

  // ngOnInit(): void {
  
  //   // ✅ Read lead from query params
  //   this.route.queryParams.subscribe(params => {
  //     if (params['phone']) {
  //       this.lead = {
  //         name:         params['name']     || '',
  //         mobileNumber: params['phone']    || '',
  //         email:        params['email']    || '',
  //         city:         params['city']     || '',
  //         company:      params['company']  || '',
  //         state:        params['state']    || '',
  //         platform:     params['platform'] || ''
  //       };
  //     }
  //   });

  //   this.loadTemplates();
  // }
  ngOnInit(): void {
  // ✅ First, read lead from query params
  // this.route.queryParams.subscribe(params => {
  //   if (params['phone']) {
  //     this.lead = {
  //       name:         params['name']     || '',
  //       mobileNumber: params['phone']    || '',
  //       email:        params['email']    || '',
  //       city:         params['city']     || '',
  //       company:      params['company']  || '',
  //       state:        params['state']    || '',
  //       platform:     params['platform'] || ''
  //     };

  //     // ✅ Fetch last interaction immediately after lead exists
  //     if (this.lead.mobileNumber) {
  //       this.campaignService.getLastInteraction(this.lead.mobileNumber)
  //         .subscribe((res: any) => {
  //           this.isActive24h = !!res.isActive;          // boolean
  //           this.lastSeenText = res.hoursAgo + 'h ago'; // text
  //         });
  //     }
  //   }
  // });
  this.route.queryParams.subscribe(params => {
  if (params['phone']) {
    this.lead = {
      name:         params['name']     || '',
      mobileNumber: params['phone']    || '',
      email:        params['email']    || '',
      city:         params['city']     || '',
      company:      params['company']  || '',
      state:        params['state']    || '',
      platform:     params['platform'] || ''
    };

    // ✅ Now fetch last interaction
    if (this.lead.mobileNumber) {
      this.campaignService.getLastInteraction(this.lead.mobileNumber)
        .subscribe((res: any) => {
          console.log('API Response for isActive:', res); // Debug
          this.isActive24h = !!res.isActive;
          this.lastSeenText = res.hoursAgo ? res.hoursAgo + 'h ago' : '';
        });
    }
  }
});

  this.loadTemplates();
}

  loadTemplates(): void {
    this.leadsService.getWhatsappTemplatesFromDB().subscribe(
      (res: any) => { this.templates = res.data || []; },
      () => { this.errorMsg = 'Failed to load templates'; }
    );
  }

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
    this.templateBodyText = bodyComp?.text || this.selectedTemplate.body_text || '';
    const matches = this.templateBodyText.match(/{{\d+}}/g) || [];
    this.templateParams = [...new Set(matches)] as string[];
    this.languageCode = this.selectedTemplate.language || 'en_US';
    this.paramMappings = this.templateParams.map(() => ({
      type: 'db' as 'db',
      dbField: '',
      manualValue: ''
    }));
  }

  resolveParam(index: number): string {
    const mapping = this.paramMappings[index];
    if (!mapping) return '';
    if (mapping.type === 'manual') return mapping.manualValue || '';
    return this.lead?.[mapping.dbField] || '';
  }

  get previewText(): string {
    if (!this.templateBodyText) return '';
    let preview = this.templateBodyText;
    this.templateParams.forEach((param, i) => {
      const val = this.resolveParam(i);
      preview = preview.replace(param, val || param);
    });
    return preview;
  }

  getCurrentTime(): string {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  // canSend(): boolean {
  //   if (!this.campaignName || !this.selectedTemplate || !this.lead) return false;
  //   return this.paramMappings.every(m =>
  //     m.type === 'manual' ? m.manualValue.trim() !== '' : m.dbField !== ''
  //   );
  // }
  canSend(): boolean {
  if (!this.campaignName || !this.lead) return false;
  // if (this.messageMode === 'custom') {
  //   return this.customMessage.trim() !== '';
  // }
  if (this.messageMode === 'custom') {
  return this.isActive24h && this.customMessage.trim() !== '';
}
  if (!this.selectedTemplate) return false;
  return this.paramMappings.every(m =>
    m.type === 'manual' ? m.manualValue.trim() !== '' : m.dbField !== ''
  );
}

  // sendCampaign(): void {
  //   if (!this.canSend()) return;
  //   this.sending = true;
  //   this.result = null;

  //   const contactWithParams = {
  //     ...this.lead,
  //     resolvedParams: this.templateParams.map((_, i) => this.resolveParam(i))
  //   };

  //   this.campaignService.sendCampaign({
  //     campaignName: this.campaignName,
  //     contacts: [contactWithParams],
  //     templateName: this.selectedTemplate.name,
  //     languageCode: this.languageCode,
  //   }).subscribe({
  //     next: (res: any) => {
  //       this.result = res;
  //       this.sending = false;
  //       this.sent = true;
  //       this.toastService.showSuccess('Message sent successfully!');
  //     },
  //     error: () => {
  //       this.sending = false;
  //       this.toastService.showError('Failed to send message');
  //     }
  //   });
  // }
sendCampaign(): void {
  if (!this.canSend()) return;
  this.sending = true;
  this.result = null;

  if (this.messageMode === 'custom') {
    // ✅ Send free-form custom message
    this.campaignService.sendCampaign({
      campaignName: this.campaignName,
      contacts: [{ ...this.lead, resolvedParams: [] }],
      customMessage: this.customMessage,
      isCustomMessage: true,
      languageCode: this.languageCode,
    }).subscribe({
      next: (res: any) => { this.result = res; this.sending = false; },
      error: () => {
        this.errorMsg = 'Failed to send message';
        this.sending = false;
      }
    });
  } else {
    const resolvedParams = this.templateParams.map((_, i) => {
      const m = this.paramMappings[i];
      return m.type === 'manual' ? m.manualValue : (this.lead[m.dbField] || '');
    });
    this.campaignService.sendCampaign({
      campaignName: this.campaignName,
      contacts: [{ ...this.lead, resolvedParams }],
      templateName: this.selectedTemplate.name,
      languageCode: this.languageCode,
    }).subscribe({
      next: (res: any) => { this.result = res; this.sending = false; },
      error: () => {
        this.errorMsg = 'Failed to send campaign';
        this.sending = false;
      }
    });
  }
}
  goBack(): void {
    this.location.back();
  }
}