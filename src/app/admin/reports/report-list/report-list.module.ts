import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportListComponent } from './report-list.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: ReportListComponent }];


@NgModule({
  declarations: [
    ReportListComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ]
})
export class ReportListModule { }
