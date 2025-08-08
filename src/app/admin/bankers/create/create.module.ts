import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: '', component: CreateComponent }
];

@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    BreadcrumbModule,
    MultiSelectModule,
    ButtonModule,
    CalendarModule,
    PreloaderModule,
    FileUploadModule,
    [RouterModule.forChild(routes)]
  ]
})
export class CreateModule { }
