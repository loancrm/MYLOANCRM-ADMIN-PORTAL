import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from '../../../services/toast.service';

// ── Interfaces ────────────────────────────────────────────────────
interface WhatsAppButton {
  type: string;
  text: string;
  url: string;
  phone: string;
}

interface WhatsAppTemplate {
  name: string;
  language: string;
  category: string;
  header_type: string;
  header_text: string;
  header_file?: File | null;
  header_file_name?: string;
  header_file_url?: string;       // URL returned after upload to files.loancrm.org
  body_text: string;
  footer_text: string;
  variablesSample: string[];      // sample values for {{1}}, {{2}} … required by Meta
  buttons: WhatsAppButton[];
}

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss'],
})
export class CreateTemplateComponent implements OnChanges {

  @Input() visible: boolean = false;
  @Input() editTemplate: any = null;
  @Output() visibleChange   = new EventEmitter<boolean>();
  @Output() templateSaved   = new EventEmitter<void>();

  isEditMode      = false;
  editTemplateId: number | null = null;
  templateSaving  = false;
  headerUploading = false;
  headerImagePreview = '';
  headerUploadMode: 'url' | 'upload' = 'upload';

  // ── Default form model ────────────────────────────────────────
  newTemplate: WhatsAppTemplate = this.emptyTemplate();

  // ── Dropdown options ──────────────────────────────────────────
  languageOptions = [
    { label: 'English (US)', value: 'en_US' },
    { label: 'English (UK)', value: 'en_GB' },
    { label: 'Hindi',        value: 'hi' },
    { label: 'Tamil',        value: 'ta' },
    { label: 'Telugu',       value: 'te' },
    { label: 'Kannada',      value: 'kn' },
    { label: 'Malayalam',    value: 'ml' },
    { label: 'Marathi',      value: 'mr' },
    { label: 'Bengali',      value: 'bn' },
    { label: 'Gujarati',     value: 'gu' },
  ];

  categoryOptions = [
    { label: 'Marketing',      value: 'MARKETING' },
    { label: 'Utility',        value: 'UTILITY' },
    { label: 'Authentication', value: 'AUTHENTICATION' },
  ];

  headerTypeOptions = [
    { label: 'None',     value: 'NONE' },
    { label: 'Text',     value: 'TEXT' },
    { label: 'Image',    value: 'IMAGE' },
    { label: 'Video',    value: 'VIDEO' },
    { label: 'Document', value: 'DOCUMENT' },
  ];

  buttonTypes = [
    { label: 'Quick Reply',   value: 'QUICK_REPLY' },
    { label: 'Visit Website', value: 'URL' },
    { label: 'Call Phone',    value: 'PHONE_NUMBER' },
  ];

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnChanges(changes: SimpleChanges): void {
    // Load edit data when editTemplate input arrives
    if (changes['editTemplate'] && this.editTemplate) {
      this.isEditMode    = true;
      this.editTemplateId = this.editTemplate.id;
      this.headerImagePreview = '';
      this.headerUploadMode   = 'upload';

      this.newTemplate = {
        name:             this.editTemplate.name             || '',
        language:         this.editTemplate.language         || 'en_US',
        category:         this.editTemplate.category         || 'MARKETING',
        header_type:      this.editTemplate.header_type      || 'NONE',
        header_text:      this.editTemplate.header_text      || '',
        header_file:      null,
        header_file_name: '',
        header_file_url:  this.editTemplate.header_file_url  || this.editTemplate.headerMediaUrl || '',
        body_text:        this.editTemplate.body_text        || '',
        footer_text:      this.editTemplate.footer_text      || '',
        variablesSample:  Array.isArray(this.editTemplate.variablesSample)
                            ? [...this.editTemplate.variablesSample]
                            : [],
        buttons: (this.editTemplate.buttons || []).map((btn: any) => ({
          type:  btn.type           || 'QUICK_REPLY',
          text:  btn.text           || '',
          url:   btn.url            || '',
          phone: btn.phone_number   || btn.phone || '',
        })),
      };

      // If there's a saved image URL, show it as preview
      if (this.newTemplate.header_type === 'IMAGE' && this.newTemplate.header_file_url) {
        this.headerImagePreview = this.newTemplate.header_file_url;
        this.headerUploadMode   = 'url';
      }

      // Sync variable samples with actual variable count in saved body
      this.syncVariableSamples();
    }

    // Reset form when dialog opens fresh (no editTemplate)
    if (changes['visible'] && this.visible && !this.editTemplate) {
      this.resetForm();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────
  private emptyTemplate(): WhatsAppTemplate {
    return {
      name:             '',
      language:         'en_US',
      category:         'MARKETING',
      header_type:      'NONE',
      header_text:      '',
      header_file:      null,
      header_file_name: '',
      header_file_url:  '',
      body_text:        '',
      footer_text:      '',
      variablesSample:  [],
      buttons:          [],
    };
  }

  private resetForm(): void {
    this.isEditMode         = false;
    this.editTemplateId     = null;
    this.headerImagePreview = '';
    this.headerUploadMode   = 'upload';
    this.newTemplate        = this.emptyTemplate();
  }

  // ── Template name: auto-lowercase + no spaces ─────────────────
  onTemplateNameChange(): void {
    this.newTemplate.name = this.newTemplate.name
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');
  }

  // ── Preview text: replace {{1}} with sample values ────────────
  get templatePreviewText(): string {
    let text = this.newTemplate.body_text || '';
    this.newTemplate.variablesSample.forEach((val, i) => {
      text = text.replace(`{{${i + 1}}}`, val || `[var ${i + 1}]`);
    });
    return text;
  }

  // ── Detect how many unique variables are in body_text ─────────
  get detectedVariableCount(): number {
    const matches = this.newTemplate.body_text.match(/\{\{\d+\}\}/g);
    if (!matches) return 0;
    const unique = new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')));
    return unique.size;
  }

  // ── Keep variablesSample array in sync with detectedVariableCount
  //    Called on every keypress in the body textarea via (ngModelChange)
  syncVariableSamples(): void {
    const count   = this.detectedVariableCount;
    const current = this.newTemplate.variablesSample;

    if (count > current.length) {
      // Grow: add empty slots for new variables
      for (let i = current.length; i < count; i++) {
        current.push('');
      }
    } else if (count < current.length) {
      // Shrink: remove slots for deleted variables
      this.newTemplate.variablesSample = current.slice(0, count);
    }
  }

  // ── Header: paste URL ─────────────────────────────────────────
  onHeaderUrlChange(): void {
    if (this.newTemplate.header_type === 'IMAGE' && this.newTemplate.header_file_url) {
      this.headerImagePreview = this.newTemplate.header_file_url;
    }
  }

  // ── Header: file selected → upload to files.loancrm.org ──────
  onHeaderFileSelected(event: any, type: string): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizes: Record<string, number> = {
      IMAGE:    5  * 1024 * 1024,
      VIDEO:    16 * 1024 * 1024,
      DOCUMENT: 100 * 1024 * 1024,
    };

    if (file.size > maxSizes[type]) {
      this.toastService.showError(
        `File too large. Max: ${type === 'IMAGE' ? '5MB' : type === 'VIDEO' ? '16MB' : '100MB'}`
      );
      event.target.value = '';
      return;
    }

    this.newTemplate.header_file      = file;
    this.newTemplate.header_file_name = file.name;
    this.headerUploading              = true;

    // Show local preview immediately for images
    if (type === 'IMAGE') {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.headerImagePreview = e.target.result; };
      reader.readAsDataURL(file);
    } else {
      this.headerImagePreview = '';
    }

    // Upload to file server using same URL pattern as rest of the project
    const formData = new FormData();
    formData.append('files', file, file.name);

    const accountId  = 'admin';
    const uploadUrl  = `https://files.loancrm.org/files?type=WHATSAPP_MEDIA&leadId=WHATSAPP&accountId=${accountId}`;
    const authToken  = localStorage.getItem('accessToken') || '';

    fetch(uploadUrl, {
      method:  'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body:    formData,
    })
      .then((r) => r.json())
      .then((res) => {
        let url = res?.links?.[0] || '';
        // Ensure https:// prefix
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        this.newTemplate.header_file_url = url;
        this.headerUploading             = false;
      })
      .catch(() => {
        this.toastService.showError('Failed to upload header media');
        this.headerUploading = false;
      });
  }

  // ── Clear header file ─────────────────────────────────────────
  clearHeaderFile(): void {
    this.newTemplate.header_file      = null;
    this.newTemplate.header_file_name = '';
    this.newTemplate.header_file_url  = '';
    this.headerImagePreview           = '';
    ['headerImageFile', 'headerVideoFile', 'headerDocumentFile'].forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement;
      if (el) el.value = '';
    });
  }

  // ── Current time for preview ──────────────────────────────────
  getCurrentTime(): string {
    const now     = new Date();
    let hours     = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm    = hours >= 12 ? 'PM' : 'AM';
    hours         = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // ── Buttons ───────────────────────────────────────────────────
  addButton(): void {
    if (this.newTemplate.buttons.length >= 3) return;
    this.newTemplate.buttons.push({ type: 'QUICK_REPLY', text: '', url: '', phone: '' });
  }

  removeButton(index: number): void {
    this.newTemplate.buttons.splice(index, 1);
  }

  // ── Dialog close ─────────────────────────────────────────────
  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  // ── Save ─────────────────────────────────────────────────────
  saveTemplate(): void {
    // Basic validation
    if (!this.newTemplate.name.trim()) {
      this.toastService.showError('Template name is required');
      return;
    }
    if (!this.newTemplate.body_text.trim()) {
      this.toastService.showError('Message body is required');
      return;
    }

    // Validate that all variable samples have at least 2 chars (Meta requirement)
    const emptySample = this.newTemplate.variablesSample.findIndex(
      (s) => !s || s.trim().length < 2
    );
    if (emptySample !== -1) {
      this.toastService.showError(
        `Please enter a sample value (min. 2 characters) for {{${emptySample + 1}}}`
      );
      return;
    }

    // Validate header media URL is present when a media header type is selected
    const mediaHeaderTypes = ['IMAGE', 'VIDEO', 'DOCUMENT'];
    if (
      mediaHeaderTypes.includes(this.newTemplate.header_type) &&
      !this.newTemplate.header_file_url
    ) {
      this.toastService.showError(
        `Please upload or paste a URL for the ${this.newTemplate.header_type.toLowerCase()} header`
      );
      return;
    }

    this.templateSaving = true;

    // Build payload — matches what the backend createWhatsappTemplate / updateWhatsappTemplate expects
    const payload = {
      name:             this.newTemplate.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      language:         this.newTemplate.language,
      category:         this.newTemplate.category,
      header_type:      this.newTemplate.header_type,
      header_text:      this.newTemplate.header_text  || null,
      header_file_url:  this.newTemplate.header_file_url || null,
      body_text:        this.newTemplate.body_text,
      footer_text:      this.newTemplate.footer_text  || null,
      variablesSample:  this.newTemplate.variablesSample.length
                          ? this.newTemplate.variablesSample
                          : undefined,
      buttons:          this.newTemplate.buttons.length
                          ? this.newTemplate.buttons
                          : undefined,
    };

    if (this.isEditMode && this.editTemplateId) {
      this.leadsService.updateWhatsappTemplate(this.editTemplateId, payload).subscribe({
        next: () => {
          this.templateSaving = false;
          this.toastService.showSuccess('Template updated successfully');
          this.templateSaved.emit();
          this.closeDialog();
        },
        error: (err: any) => {
          this.templateSaving = false;
          const msg = err?.error?.error || 'Failed to update template';
          this.toastService.showError(msg);
        },
      });
    } else {
      this.leadsService.createWhatsappTemplate(payload).subscribe({
        next: () => {
          this.templateSaving = false;
          this.toastService.showSuccess('Template saved. Submit to Meta when ready.');
          this.templateSaved.emit();
          this.closeDialog();
        },
        error: (err: any) => {
          this.templateSaving = false;
          const msg = err?.error?.error || 'Failed to create template';
          this.toastService.showError(msg);
        },
      });
    }
  }
}