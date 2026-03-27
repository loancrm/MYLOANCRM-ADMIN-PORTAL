import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class SingleWhatsappCampaignComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatBody') chatBody!: ElementRef;

  // ── Lead ───────────────────────────────────────────────────────────────────
  lead: any = null;

  // ── Templates ──────────────────────────────────────────────────────────────
  templates: any[]     = [];
  selectedTemplate: any = null;
  templateBodyText      = '';
  templateParams: string[] = [];
  paramMappings: { type: 'db' | 'manual'; dbField: string; manualValue: string }[] = [];

  // ── Message mode ───────────────────────────────────────────────────────────
  messageMode: 'template' | 'custom' = 'template';
  customMessage = '';

  // ── 24h window ─────────────────────────────────────────────────────────────
  isActive24h  = false;
  lastSeenText = '';

  // ── Sending ────────────────────────────────────────────────────────────────
  sending = false;
  result: any = null;

  // ── Sent messages — shown as bubbles immediately ───────────────────────────
  sentMessages: any[] = [];

  // ── Auto scroll ────────────────────────────────────────────────────────────
  private shouldScroll = false;

  // ── DB Field Options ───────────────────────────────────────────────────────
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

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {

    // ✅ Check phone exists first
    if (params['phone']) {

      // ✅ Set lead FIRST
      this.lead = {
        name:         params['name']     || '',
        mobileNumber: params['phone']    || '',
        email:        params['email']    || '',
        city:         params['city']     || '',
        company:      params['company']  || '',
        state:        params['state']    || '',
        platform:     params['platform'] || ''
      };

      // ✅ NOW safe to use this.lead.mobileNumber
      this.campaignService.getLastInteraction(this.lead.mobileNumber)
        .subscribe((res: any) => {
          this.isActive24h  = !!res.isActive;
          this.lastSeenText = res.hoursAgo ? res.hoursAgo + 'h ago' : '';
        });

      // ✅ Fetch previous messages
      this.campaignService.getContactLogs(this.lead.mobileNumber)
        .subscribe((res: any) => {
          if (res.data?.messages) {
            this.sentMessages = res.data.messages;
            this.shouldScroll = true;
          }
        });
    }

  });

  // ✅ Load templates — outside queryParams, runs independently
  this.loadTemplates();
}
  // ngOnInit(): void {
    
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

  //       if (this.lead.mobileNumber) {
  //         this.campaignService.getLastInteraction(this.lead.mobileNumber)
  //           .subscribe((res: any) => {
  //             this.isActive24h  = !!res.isActive;
  //             this.lastSeenText = res.hoursAgo ? res.hoursAgo + 'h ago' : '';
  //           });
  //       }
  //     }
  //   });

  //   this.loadTemplates();
  // }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  // ── Load templates ─────────────────────────────────────────────────────────
  loadTemplates(): void {
    this.leadsService.getWhatsappTemplatesFromDB().subscribe({
      next: (res: any) => { this.templates = res.data || []; },
      error: () => {}
    });
  }

  // ── Template select ────────────────────────────────────────────────────────
  onTemplateSelect(): void {
    if (!this.selectedTemplate) {
      this.templateBodyText = '';
      this.templateParams   = [];
      this.paramMappings    = [];
      return;
    }

    const bodyComp = this.selectedTemplate.components?.find(
      (c: any) => c.type === 'BODY'
    );
    this.templateBodyText = bodyComp?.text || this.selectedTemplate.body_text || '';
    const matches         = this.templateBodyText.match(/{{\d+}}/g) || [];
    this.templateParams   = [...new Set(matches)] as string[];
    this.paramMappings    = this.templateParams.map(() => ({
      type: 'db' as 'db', dbField: '', manualValue: ''
    }));
  }

  // ── Resolve param value ────────────────────────────────────────────────────
  resolveParam(index: number): string {
    const m = this.paramMappings[index];
    if (!m) return '';
    return m.type === 'manual' ? m.manualValue || '' : this.lead?.[m.dbField] || '';
  }

  // ── Preview text ───────────────────────────────────────────────────────────
  get previewText(): string {
    if (!this.templateBodyText) return '';
    let preview = this.templateBodyText;
    this.templateParams.forEach((param, i) => {
      preview = preview.replace(param, this.resolveParam(i) || param);
    });
    return preview;
  }

  // ── Enter to send ──────────────────────────────────────────────────────────
  onEnterSend(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendCampaign();
    }
  }

  // ── Can send ───────────────────────────────────────────────────────────────
  canSend(): boolean {
    if (!this.lead) return false;
    if (this.messageMode === 'custom') {
      return this.customMessage.trim() !== '';
    }
    if (!this.selectedTemplate) return false;
    return this.paramMappings.every(m =>
      m.type === 'manual' ? m.manualValue.trim() !== '' : m.dbField !== ''
    );
  }

  // ── SEND ───────────────────────────────────────────────────────────────────
  sendCampaign(): void {
    if (!this.canSend() || this.sending) return;

    this.sending = true;
    this.result  = null;

    let payload: any;
    let messageSentText = '';

    if (this.messageMode === 'custom') {
      messageSentText = this.customMessage.trim();
      payload = {
        campaignName:    'Direct Message',
        contacts:        [{ ...this.lead, resolvedParams: [] }],
        customMessage:   messageSentText,
        isCustomMessage: true,
        languageCode:    'en_US',
        sendType:        'single',
      };
    } else {
      const resolvedParams = this.templateParams.map((_, i) => this.resolveParam(i));
      messageSentText      = this.previewText;
      payload = {
        campaignName:     'Direct Message',
        contacts:         [{ ...this.lead, resolvedParams }],
        templateName:     this.selectedTemplate.name,
        templateBodyText: this.templateBodyText,
        languageCode:     this.selectedTemplate.language || 'en_US',
        sendType:         'single',
      };
    }

    this.campaignService.sendCampaign(payload).subscribe({
      next: (res: any) => {
        this.sending = false;
        this.result  = res;

        const sentResult = res.results?.[0];

        // ── Add bubble immediately ────────────────────────────────────────
        this.sentMessages.push({
          templateName: this.messageMode === 'custom'
            ? 'CUSTOM_MESSAGE'
            : this.selectedTemplate?.name,
          messageSent:       sentResult?.messageSent || messageSentText,
          status:            sentResult?.status      || 'failed',
          whatsappMessageId: sentResult?.whatsappMessageId || null,
          error:             sentResult?.error        || null,
          sent_at:           new Date().toISOString(),
        });

        // ── Clear input ───────────────────────────────────────────────────
        this.customMessage    = '';
        this.selectedTemplate = null;
        this.templateBodyText = '';
        this.templateParams   = [];
        this.paramMappings    = [];

        this.shouldScroll = true;

        if (sentResult?.status === 'sent') {
          this.toastService.showSuccess('Message sent successfully!');
        } else {
          this.toastService.showError('Message failed to send');
        }
      },
      error: () => {
        this.sending = false;
        this.toastService.showError('Failed to send message');
      }
    });
  }

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  scrollToBottom(): void {
    try {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop =
          this.chatBody.nativeElement.scrollHeight;
      }
    } catch {}
  }

  goBack(): void { this.location.back(); }
}