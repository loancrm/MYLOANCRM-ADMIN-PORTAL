import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FilterModule } from 'src/app/filter/filter.module';

const routes: Routes = [{ path: '', component: InvoicesComponent }];

@NgModule({
  declarations: [InvoicesComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    BreadcrumbModule,
    TooltipModule,
    DialogModule,
    FilterModule,
    RouterModule.forChild(routes),
  ],
})
export class InvoicesModule {}
