import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeadsService } from '../leads/leads.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  uploadedFiles: any[] = [];
  previouslyUploadedFiles: any[] = [];
  dialogData: any;
  acceptableTypes: any = '*/*';
  constructor(
    private fileUploadRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private leadsService: LeadsService
  ) {}

  ngOnInit() {
    if (this.dialogConfig && this.dialogConfig.data) {
      this.dialogData = this.dialogConfig.data;
    }
    if (this.dialogData && this.dialogData.acceptableTypes) {
      this.acceptableTypes = this.dialogData.acceptableTypes;
    }
    if (this.dialogData && this.dialogData.uploadedFiles) {
      this.previouslyUploadedFiles = this.dialogData.uploadedFiles;
    }
    if (this.dialogData && this.dialogData.files) {
      this.uploadedFiles.push(...this.dialogData.files);
    }
  }

  close() {
    this.fileUploadRef.close();
  }

  ngOnDestroy() {
    this.fileUploadRef.close();
  }

  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.fileUploadRef.close(this.uploadedFiles);
  }

  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
}
