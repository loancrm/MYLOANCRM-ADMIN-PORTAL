import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from '../../../services/toast.service';

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
  body_text: string;
  buttons: WhatsAppButton[];
}

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrl: './create-template.component.scss'
})
export class CreateTemplateComponent implements OnChanges {

  @Input() visible: boolean = false;
  @Input() editTemplate: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() templateSaved = new EventEmitter<void>();

  isEditMode = false;
  editTemplateId: number | null = null;
  templateSaving = false;
  headerImagePreview: string = '';

  newTemplate: WhatsAppTemplate = {
    name: '',
    language: 'en_US',
    category: 'MARKETING',
    header_type: 'NONE',
    header_text: '',
    header_file: null,
    header_file_name: '',
    body_text: '',
    buttons: []
  };

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

  buttonTypes = [
    { label: 'Quick Reply',   value: 'QUICK_REPLY' },
    { label: 'Visit Website', value: 'URL' },
    { label: 'Call Phone',    value: 'PHONE_NUMBER' }
  ];

  headerTypeOptions = [
    { label: 'None',     value: 'NONE' },
    { label: 'Text',     value: 'TEXT' },
    { label: 'Image',    value: 'IMAGE' },
    { label: 'Video',    value: 'VIDEO' },
    { label: 'Document', value: 'DOCUMENT' },
  ];

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editTemplate'] && this.editTemplate) {
      this.isEditMode = true;
      this.editTemplateId = this.editTemplate.id;
      this.headerImagePreview = '';
      this.newTemplate = {
        name: this.editTemplate.name,
        language: this.editTemplate.language,
        category: this.editTemplate.category,
        header_type: this.editTemplate.header_type || 'NONE',
        header_text: this.editTemplate.header_text || '',
        header_file: null,
        header_file_name: '',
        body_text: this.editTemplate.body_text,
        buttons: (this.editTemplate.buttons || []).map((btn: any) => ({
          type: btn.type || 'QUICK_REPLY',
          text: btn.text || '',
          url: btn.url || '',
          phone: btn.phone_number || btn.phone || ''
        }))
      };
    } else if (changes['visible'] && this.visible && !this.editTemplate) {
      this.isEditMode = false;
      this.editTemplateId = null;
      this.headerImagePreview = '';
      this.newTemplate = {
        name: '',
        language: 'en_US',
        category: 'MARKETING',
        header_type: 'NONE',
        header_text: '',
        header_file: null,
        header_file_name: '',
        body_text: '',
        buttons: []
      };
    }
  }

  get templatePreviewText(): string {
    return this.newTemplate.body_text || '';
  }

  getCurrentTime(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  addButton(): void {
    if (this.newTemplate.buttons.length >= 3) return;
    const newBtn: WhatsAppButton = {
      type: 'QUICK_REPLY',
      text: '',
      url: '',
      phone: ''
    };
    this.newTemplate.buttons.push(newBtn);
  }

  removeButton(index: number): void {
    this.newTemplate.buttons.splice(index, 1);
  }

  onHeaderFileSelected(event: any, type: string): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizes: any = {
      IMAGE: 5 * 1024 * 1024,
      VIDEO: 16 * 1024 * 1024,
      DOCUMENT: 100 * 1024 * 1024
    };

    if (file.size > maxSizes[type]) {
      this.toastService.showError(
        `File too large. Max: ${type === 'IMAGE' ? '5MB' : type === 'VIDEO' ? '16MB' : '100MB'}`
      );
      event.target.value = '';
      return;
    }

    this.newTemplate.header_file = file;
    this.newTemplate.header_file_name = file.name;

    if (type === 'IMAGE') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.headerImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.headerImagePreview = '';
    }
  }

  clearHeaderFile(): void {
    this.newTemplate.header_file = null;
    this.newTemplate.header_file_name = '';
    this.headerImagePreview = '';
    ['headerImageFile', 'headerVideoFile', 'headerDocumentFile'].forEach(id => {
      const el = document.getElementById(id) as HTMLInputElement;
      if (el) el.value = '';
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  saveTemplate(): void {
    if (!this.newTemplate.name.trim() || !this.newTemplate.body_text.trim()) {
      this.toastService.showError('Template name and body text are required');
      return;
    }

    this.templateSaving = true;

    if (this.isEditMode && this.editTemplateId) {
      this.leadsService.updateWhatsappTemplate(this.editTemplateId, this.newTemplate).subscribe(
        () => {
          this.templateSaving = false;
          this.toastService.showSuccess('Template updated successfully');
          this.templateSaved.emit();
          this.closeDialog();
        },
        () => {
          this.templateSaving = false;
          this.toastService.showError('Failed to update template');
        }
      );
    } else {
      this.leadsService.createWhatsappTemplate(this.newTemplate).subscribe(
        () => {
          this.templateSaving = false;
          this.toastService.showSuccess('Template created and submitted to Meta');
          this.templateSaved.emit();
          this.closeDialog();
        },
        () => {
          this.templateSaving = false;
          this.toastService.showError('Failed to create template');
        }
      );
    }
  }
}