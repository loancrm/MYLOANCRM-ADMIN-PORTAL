import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('chatBody') chatBody!: ElementRef;

  // ── Logs ──────────────────────────────────────────────────────────────────
  logs: any[]         = [];
  filteredLogs: any[] = [];
  selectedLog: any    = null;
  loading             = false;
  searchText          = '';

  // ── Templates (for quick send) ────────────────────────────────────────────
  templates: any[]    = [];

  // ── Input box state ───────────────────────────────────────────────────────
  inputMode: 'template' | 'custom' = 'custom';

  // Template mode
  quickTemplate: any         = null;
  quickParams: string[]      = [];
  quickParamValues: string[] = [];
  quickTemplateBodyText      = '';
  quickTemplatePreview       = '';
  quickButtonParamStartIndex = 0;  // ✅ NEW
  quickParamIsButton: boolean[] = []; 
  quickTemplateHeaderType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'NONE' = 'NONE';
  quickHeaderMediaUrl: string = '';
  quickHeaderMediaFile: File | null = null;
  quickHeaderMediaUploadMode: 'url' | 'upload' = 'url';

  quickHeaderAlreadyUploaded = false;
quickHeaderIsMetaHandle    = false;
quickHeaderUploading       = false;


  // Custom mode
  quickCustomMessage = '';

  // Sending state
  sending = false;

  // ── Auto scroll flag ──────────────────────────────────────────────────────
  private shouldScroll = false;

  // ── Polling ───────────────────────────────────────────────────────────────
  private pollingInterval: any = null;

  constructor(
    private campaignService: CampaignService,
    private leadsService: LeadsService,
    private toastService: ToastService,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadLogs();
    this.loadTemplates();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  // ── Polling: silent refresh every 10 seconds ──────────────────────────────
  startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.silentRefresh();
    }, 10000);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  silentRefresh(): void {
    this.campaignService.getLogs().subscribe({
      next: (res) => {
        const freshLogs = res.data || [];

        // ── Update left panel list ─────────────────────────────────────────
        this.logs = freshLogs;
        this.applySearch();

        // ── If a contact is open, refresh their messages ───────────────────
        if (this.selectedLog) {
          const updated = freshLogs.find(
            (l: any) => l.mobile_number === this.selectedLog.mobile_number
          );
          if (updated) {
            const oldCount = this.selectedLog.messages?.length || 0;
            const newCount = updated.messages?.length || 0;

            this.selectedLog = updated;

            // Scroll only if new messages arrived
            if (newCount > oldCount) {
              this.shouldScroll = true;
            }
          }
        }
      },
      error: () => {}
    });
  }

  // ── Load all logs ─────────────────────────────────────────────────────────
  loadLogs(): void {
    this.loading = true;
    this.campaignService.getLogs().subscribe({
      next: (res) => {
        this.logs         = res.data || [];
        this.filteredLogs = [...this.logs];
        this.loading      = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Load templates for quick send dropdown ────────────────────────────────
  loadTemplates(): void {
    this.leadsService.getWhatsappTemplatesFromDB().subscribe({
      next: (res: any) => { this.templates = res.data || []; },
      error: () => {}
    });
  }

  // ── Search ────────────────────────────────────────────────────────────────
  applySearch(): void {
    const text = this.searchText.toLowerCase().trim();
    if (!text) { this.filteredLogs = [...this.logs]; return; }
    this.filteredLogs = this.logs.filter((log) =>
      log.name?.toLowerCase().includes(text) ||
      String(log.mobile_number).includes(text)
    );
  }

  // ── Select contact from left panel ───────────────────────────────────────
  // selectLog(log: any): void {
  //   this.selectedLog          = log;
  //   this.quickTemplate        = null;
  //   this.quickParams          = [];
  //   this.quickParamValues     = [];
  //   this.quickParamIsButton       = [];       // ✅ NEW
  // this.quickButtonParamStartIndex = 0; 
  //   this.quickTemplatePreview = '';
  //   this.quickCustomMessage   = '';
  //   this.quickTemplateHeaderType    = 'NONE';   // ✅ add
  // this.quickHeaderMediaUrl        = '';        // ✅ add
  // this.quickHeaderMediaFile       = null;      // ✅ add
  //   this.shouldScroll         = true;
  // }

  selectLog(log: any): void {
  this.selectedLog                = log;
  this.quickTemplate              = null;
  this.quickParams                = [];
  this.quickParamValues           = [];
  this.quickParamIsButton         = [];
  this.quickButtonParamStartIndex = 0;
  this.quickTemplatePreview       = '';
  this.quickCustomMessage         = '';
  this.quickTemplateHeaderType    = 'NONE';
  this.quickHeaderMediaUrl        = '';
  this.quickHeaderMediaFile       = null;
  this.quickHeaderAlreadyUploaded = false;   // ✅ new
  this.quickHeaderIsMetaHandle    = false;   // ✅ new
  this.quickHeaderUploading       = false;   // ✅ new
  this.shouldScroll               = true;
}


  // ── Template selected in quick send ──────────────────────────────────────
  onQuickTemplateSelect(): void {
  if (!this.quickTemplate) {
    this.quickParams                = [];
    this.quickParamValues           = [];
    this.quickTemplateBodyText      = '';
    this.quickTemplatePreview       = '';
    this.quickButtonParamStartIndex = 0;
    this.quickParamIsButton         = [];
    this.quickTemplateHeaderType    = 'NONE';
    this.quickHeaderMediaUrl        = '';
    this.quickHeaderMediaFile       = null;
    this.quickHeaderAlreadyUploaded = false;
    this.quickHeaderIsMetaHandle    = false;
    return;
  }

  const components = this.quickTemplate.components || [];

  const headerComp = components.find((c: any) => c.type === 'HEADER');
  const bodyComp   = components.find((c: any) => c.type === 'BODY');
  const buttonComp = components.find((c: any) => c.type === 'BUTTONS');

  const headerFormat = headerComp?.format?.toUpperCase() || 'NONE';
  this.quickTemplateHeaderType = ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerFormat)
    ? headerFormat
    : (headerComp?.text ? 'TEXT' : 'NONE');

  // ✅ Check if template already has a header image from Meta
  const existingHeaderHandle = headerComp?.example?.header_handle?.[0] || null;

  if (existingHeaderHandle) {
    // ✅ Already has image in Meta — use directly, no upload needed
    this.quickHeaderMediaUrl        = existingHeaderHandle;
    this.quickHeaderMediaFile       = null;
    this.quickHeaderAlreadyUploaded = true;
    this.quickHeaderIsMetaHandle    = true;
  } else {
    // ✅ No existing image — user must provide one
    this.quickHeaderMediaUrl        = '';
    this.quickHeaderMediaFile       = null;
    this.quickHeaderAlreadyUploaded = false;
    this.quickHeaderIsMetaHandle    = false;
  }

  this.quickHeaderMediaUploadMode = 'url';

  const headerText           = headerComp?.text || '';
  this.quickTemplateBodyText = bodyComp?.text || this.quickTemplate.body_text || '';
  const templateButtons      = buttonComp?.buttons || [];

  // ✅ Count button URL params
  let buttonParamCount = 0;
  templateButtons.forEach((btn: any) => {
    if (btn.type === 'URL') {
      const urlMatches = (btn.url || '').match(/{{\d+}}/g);
      if (urlMatches && urlMatches.length > 0) {
        buttonParamCount += urlMatches.length;
      } else if (btn.example && Array.isArray(btn.example) && btn.example.length > 0) {
        buttonParamCount += 1;
      }
    }
  });

  // ✅ Collect text params from HEADER + BODY
  const textSources = [headerText, this.quickTemplateBodyText].join(' ');
  const textMatches = textSources.match(/{{\d+}}/g) || [];
  const textParams  = [...new Set(textMatches)] as string[];

  // ✅ Build button param placeholders
  const startIndex   = textParams.length + 1;
  const buttonParams = Array.from(
    { length: buttonParamCount },
    (_, i) => `{{${startIndex + i}}}`
  );

  this.quickParams                = [...textParams, ...buttonParams];
  this.quickParamValues           = this.quickParams.map(() => '');
  this.quickButtonParamStartIndex = textParams.length;
  this.quickParamIsButton         = this.quickParams.map((_, i) => i >= textParams.length);

  this.updateQuickPreview();
}

  // ── Update preview as user types param values ─────────────────────────────
  updateQuickPreview(): void {
    if (!this.quickTemplateBodyText) { this.quickTemplatePreview = ''; return; }
    let preview = this.quickTemplateBodyText;
    this.quickParams.forEach((param, i) => {
      preview = preview.replace(param, this.quickParamValues[i] || param);
    });
    this.quickTemplatePreview = preview;
  }

  // ── Enter key sends in custom mode ───────────────────────────────────────
  onEnterSend(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendQuickMessage();
    }
  }

  // ── SEND from chat input box ──────────────────────────────────────────────
sendQuickMessage(): void {
  if (!this.selectedLog || this.sending) return;

  const contact = {
    name:         this.selectedLog.name,
    mobileNumber: this.selectedLog.mobile_number,
  };

  let payload: any;

  if (this.inputMode === 'custom') {
    if (!this.quickCustomMessage.trim()) return;

    payload = {
      campaignName:    'Direct Message',
      contacts:        [{ ...contact, resolvedParams: [] }],
      customMessage:   this.quickCustomMessage.trim(),
      isCustomMessage: true,
      languageCode:    'en_US',
      sendType:        'single',
      hasImageHeader:  false,
      imageUrl:        '',
    };

  } else {
    if (!this.quickTemplate) return;

    const needsMedia = ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(this.quickTemplateHeaderType);

    // ✅ Block send if uploading or media missing
    if (needsMedia && this.quickHeaderUploading) return;
    if (needsMedia && !this.quickHeaderMediaUrl.trim()) return;

    const resolvedParams = this.quickParams.map((_, i) =>
      this.quickParamValues[i] || ''
    );

    payload = {
      campaignName:          'Direct Message',
      contacts:              [{ ...contact, resolvedParams }],
      templateName:          this.quickTemplate.name,
      templateBodyText:      this.quickTemplateBodyText,
      languageCode:          this.quickTemplate.language || 'en_US',
      sendType:              'single',
      buttonParamStartIndex: this.quickButtonParamStartIndex,
      hasImageHeader:        needsMedia,
      headerMediaType:       this.quickTemplateHeaderType,
      imageUrl:              this.quickHeaderMediaUrl,
      headerIsMetaHandle:    this.quickHeaderIsMetaHandle,   // ✅ same as bulk
    };
  }

  this.sending = true;

  this.campaignService.sendCampaign(payload).subscribe({
    next: (res: any) => {
      this.sending = false;

      const sentResult = res.results?.[0];

      const newMsg = {
        type:              'single',
        campaignName:      'Direct Message',
        templateName:      this.inputMode === 'custom'
                             ? 'CUSTOM_MESSAGE'
                             : this.quickTemplate?.name,
        messageSent:       sentResult?.messageSent ||
                           (this.inputMode === 'custom'
                             ? this.quickCustomMessage
                             : this.quickTemplatePreview),
        status:            sentResult?.status || 'failed',
        whatsappMessageId: sentResult?.whatsappMessageId || null,
        error:             sentResult?.error || null,
        sent_at:           new Date().toISOString(),
      };

      if (!this.selectedLog.messages) this.selectedLog.messages = [];
      this.selectedLog.messages.push(newMsg);
      this.selectedLog.last_sent_at = new Date().toISOString();

      // ✅ Full reset including header state
      this.quickCustomMessage         = '';
      this.quickTemplate              = null;
      this.quickParams                = [];
      this.quickParamValues           = [];
      this.quickTemplatePreview       = '';
      this.quickHeaderMediaUrl        = '';
      this.quickHeaderMediaFile       = null;
      this.quickHeaderAlreadyUploaded = false;
      this.quickHeaderIsMetaHandle    = false;
      this.quickHeaderUploading       = false;

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


  // ── Scroll chat to bottom ─────────────────────────────────────────────────
  scrollToBottom(): void {
    try {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop =
          this.chatBody.nativeElement.scrollHeight;
      }
    } catch {}
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  getLastMessage(log: any): string {
    if (!log.messages?.length) return '';
    const last = log.messages[log.messages.length - 1];
    return last.messageSent || last.templateName || '';
  }

  getLastStatus(log: any): string {
    if (!log.messages?.length) return 'unknown';
    return log.messages[log.messages.length - 1].status || 'unknown';
  }

  // ── Check if last message is an incoming reply ────────────────────────────
  isLastMessageReply(log: any): boolean {
    if (!log.messages?.length) return false;
    return log.messages[log.messages.length - 1].type === 'reply';
  }

  getErrorMessage(error: string): string {
    if (!error) return '';
    try {
      const parsed = JSON.parse(error);
      return parsed?.error?.message || error;
    } catch { return error; }
  }

  onQuickHeaderFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  this.quickHeaderMediaFile = file;
  this.quickHeaderMediaUrl  = '';        // ← clear, no blob URL
  this.quickHeaderUploading = true;

  this.leadsService.uploadWhatsappMedia(file).subscribe({
    next: (res: any) => {
      this.quickHeaderMediaUrl  = res.url;  // ← real uploaded URL
      this.quickHeaderUploading = false;
    },
    error: () => {
      this.toastService.showError('Failed to upload media');
      this.quickHeaderMediaFile = null;
      this.quickHeaderMediaUrl  = '';
      this.quickHeaderUploading = false;
    }
  });
}

}