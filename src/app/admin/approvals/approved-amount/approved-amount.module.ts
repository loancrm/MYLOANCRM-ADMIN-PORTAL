import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovedAmountComponent } from './approved-amount.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CalendarModule } from 'primeng/calendar';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: ApprovedAmountComponent }];

@NgModule({
  declarations: [ApprovedAmountComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    MenuModule,
    InputTextareaModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class ApprovedAmountModule {}
