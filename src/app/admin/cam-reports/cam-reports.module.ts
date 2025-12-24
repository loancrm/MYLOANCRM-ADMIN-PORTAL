import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamReportsComponent } from './cam-reports.component';
import { TableModule } from 'primeng/table';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: CamReportsComponent },
   {
    path: 'bank-report/:reportId',
    loadChildren: () =>
      import('./analyzed-bank-report/analyzed-bank-report.module').then((m) => m.AnalyzedBankReportModule),
  },
];
@NgModule({
  declarations: [CamReportsComponent],
  imports: [CommonModule, TableModule,ButtonModule, [RouterModule.forChild(routes)]],
  exports: [CamReportsComponent],
})
export class CamReportsModule {}
