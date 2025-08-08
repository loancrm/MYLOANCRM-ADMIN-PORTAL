import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanksSavedComponent } from './banks-saved.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { FilterModule } from 'src/app/filter/filter.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [{ path: '', component: BanksSavedComponent }];

@NgModule({
  declarations: [BanksSavedComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    MenuModule,
    FilterModule,
    InputTextareaModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class BanksSavedModule {}
