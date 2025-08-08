import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule as primeNgFileUpload } from 'primeng/fileupload';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    primeNgFileUpload,
  ],
})
export class FileUploadModule {}
