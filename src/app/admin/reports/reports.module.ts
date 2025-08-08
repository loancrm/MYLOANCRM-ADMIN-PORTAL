import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'report-list',
    loadChildren: () =>
      import('./report-list/report-list.module').then(
        (m) => m.ReportListModule
      ),
  },
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PreloaderModule,
    BreadcrumbModule,
    TooltipModule,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class ReportsModule {}
