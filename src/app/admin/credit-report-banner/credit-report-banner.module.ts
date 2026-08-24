import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CreditReportBannerComponent } from './credit-report-banner.component';
import { CreditReportBannerFormComponent } from './credit-report-banner-form/credit-report-banner-form.component';

const routes: Routes = [
  { path: '', component: CreditReportBannerComponent },
  { path: 'create', component: CreditReportBannerFormComponent },
  { path: 'edit/:id', component: CreditReportBannerFormComponent },
];

@NgModule({
  declarations: [CreditReportBannerComponent, CreditReportBannerFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    SelectButtonModule,
    MultiSelectModule,
    DropdownModule,
    TableModule,
    RouterModule.forChild(routes),
  ],
})
export class CreditReportBannerModule {}
