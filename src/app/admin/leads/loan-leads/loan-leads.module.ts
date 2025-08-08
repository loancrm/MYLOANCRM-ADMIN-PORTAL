import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoanLeadsComponent } from './loan-leads.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [{ path: '', component: LoanLeadsComponent }];

@NgModule({
  declarations: [LoanLeadsComponent],
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
    RadioButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class LoanLeadsModule {}
