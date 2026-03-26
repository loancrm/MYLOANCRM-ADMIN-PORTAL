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
  selectLog(log: any): void {
    this.selectedLog          = log;
    this.quickTemplate        = null;
    this.quickParams          = [];
    this.quickParamValues     = [];
    this.quickTemplatePreview = '';
    this.quickCustomMessage   = '';
    this.shouldScroll         = true;
  }

  // ── Template selected in quick send ──────────────────────────────────────
  onQuickTemplateSelect(): void {
    if (!this.quickTemplate) {
      this.quickParams           = [];
      this.quickParamValues      = [];
      this.quickTemplateBodyText = '';
      this.quickTemplatePreview  = '';
      return;
    }

    const bodyComp = this.quickTemplate.components?.find(
      (c: any) => c.type === 'BODY'
    );
    this.quickTemplateBodyText =
      bodyComp?.text || this.quickTemplate.body_text || '';

    const matches         = this.quickTemplateBodyText.match(/{{\d+}}/g) || [];
    this.quickParams      = [...new Set(matches)] as string[];
    this.quickParamValues = this.quickParams.map(() => '');

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
        hasImageHeader:  false,   // ✅ custom message లో image header లేదు
        imageUrl:        '',  
      };

    } else {
      if (!this.quickTemplate) return;

      const resolvedParams = this.quickParams.map((_, i) =>
        this.quickParamValues[i] || ''
      );

      payload = {
        campaignName:     'Direct Message',
        contacts:         [{ ...contact, resolvedParams }],
        templateName:     this.quickTemplate.name,
        templateBodyText: this.quickTemplateBodyText,
        languageCode:     this.quickTemplate.language || 'en_US',
        sendType:         'single',
        hasImageHeader: this.quickTemplate.components?.some(
          (c: any) => c.type === 'HEADER' && c.format === 'IMAGE'
        ) || false,
        imageUrl: 'https://myloancrm.com/assets/fav_icon.svg',
      };
    }

    this.sending = true;

    this.campaignService.sendCampaign(payload).subscribe({
      next: (res: any) => {
        this.sending = false;

        const sentResult = res.results?.[0];

        // ── Build new message entry — show immediately in chat ────────────
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

        // ── Push to selectedLog messages — shows immediately ──────────────
        if (!this.selectedLog.messages) this.selectedLog.messages = [];
        this.selectedLog.messages.push(newMsg);

        // ── Update last message preview in left panel ─────────────────────
        this.selectedLog.last_sent_at = new Date().toISOString();

        // ── Clear input ───────────────────────────────────────────────────
        this.quickCustomMessage   = '';
        this.quickTemplate        = null;
        this.quickParams          = [];
        this.quickParamValues     = [];
        this.quickTemplatePreview = '';

        // ── Scroll to bottom ──────────────────────────────────────────────
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
}