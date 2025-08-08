import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueComponent } from '../revenue/revenue.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: RevenueComponent }];

@NgModule({
  declarations: [RevenueComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    [RouterModule.forChild(routes)],
  ],
})
export class RevenueModule {}
