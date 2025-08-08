import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisbursalDetailsComponent } from './disbursal-details.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { FilterModule } from 'src/app/filter/filter.module';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: DisbursalDetailsComponent }];

@NgModule({
  declarations: [DisbursalDetailsComponent],
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
    MenuModule,
    CapitalizeFirstPipe,
    FilterModule,
    InputTextareaModule,
    [RouterModule.forChild(routes)],
  ],
})
export class DisbursalDetailsModule {}
