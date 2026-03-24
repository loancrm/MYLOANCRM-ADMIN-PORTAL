
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-whatsapp-templates',
  templateUrl: './whatsapp-templates.component.html',
  styleUrl: './whatsapp-templates.component.scss'
})
export class WhatsappTemplatesComponent implements OnInit {

  // ✅ Emit selected template to campaign component
  @Output() templateSelected = new EventEmitter<any>();

  templates: any[] = [];
  selectedTemplate: any = null;
  showCreateDialog = false;
  editTemplateData: any = null;
  isSyncing = false;

  constructor(
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.leadsService.getWhatsappTemplatesFromDB().subscribe(
      (res: any) => { this.templates = res.data || []; },
      () => this.toastService.showError('Failed to load templates')
    );
  }

  openCreateDialog(): void {
    this.editTemplateData = null;
    this.showCreateDialog = true;
  }

  openEditDialog(template: any): void {
    this.editTemplateData = { ...template };
    this.showCreateDialog = true;
  }

  onDialogClose(): void {
    this.showCreateDialog = false;
    this.editTemplateData = null;
  }

  onTemplateSaved(): void {
    this.loadTemplates();
  }

  selectTemplate(template: any): void {
    this.selectedTemplate = template;
    this.templateSelected.emit(template);
  }

  deleteTemplate(template: any): void {
    if (!confirm(`Delete template "${template.name}"?`)) return;
    this.leadsService.deleteWhatsappTemplate(template.id).subscribe(
      () => {
        this.toastService.showSuccess('Template deleted');
        this.loadTemplates();
        if (this.selectedTemplate?.id === template.id) {
          this.selectedTemplate = null;
          this.templateSelected.emit(null);
        }
      },
      () => this.toastService.showError('Failed to delete template')
    );
  }

  refreshTemplateStatus(template: any): void {
    this.leadsService.checkWhatsappTemplateStatus(template.id).subscribe(
      (res: any) => {
        template.approval_status = res.approval_status;
        template.rejection_reason = res.rejection_reason;
        this.toastService.showSuccess(`Status: ${res.approval_status}`);
      },
      () => this.toastService.showError('Failed to check status')
    );
  }

  syncAllTemplateStatus(): void {
    this.isSyncing = true;
    this.leadsService.syncWhatsappTemplateStatus().subscribe(
      (res: any) => {
        this.isSyncing = false;
        this.toastService.showSuccess(res.message);
        this.loadTemplates();
      },
      () => {
        this.isSyncing = false;
        this.toastService.showError('Failed to sync');
      }
    );
  }
}