import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PreloaderModule } from '../../../preloader/preloader.module';
import { FileUploadModule } from '../../file-upload/file-upload.module';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';

const routes: Routes = [{ path: '', component: CreateComponent }];

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    StepsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    PreloaderModule,
    FileUploadModule,
    [RouterModule.forChild(routes)],
  ],
})
export class CreateModule {}
