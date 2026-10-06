import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { CreditCamReportsComponent } from './credit-cam-reports.component';

const routes: Routes = [
  {
    path: '',
    component: CreditCamReportsComponent,
    children: [
      { path: '', redirectTo: 'credit', pathMatch: 'full' },
      {
        path: 'credit',
        loadChildren: () =>
          import('../cibil-reports/cibil-reports.module').then(
            (m) => m.CibilReportsModule,
          ),
      },
      {
        path: 'cam',
        loadChildren: () =>
          import('../cam-reports/cam-reports.module').then(
            (m) => m.CamReportsModule,
          ),
      },
      {
        path: 'pan',
        loadChildren: () =>
          import('./pan-verifications/pan-verifications.module').then(
            (m) => m.PanVerificationsModule,
          ),
      },
      {
        path: 'prefill',
        loadChildren: () =>
          import('./mobile-prefills/mobile-prefills.module').then(
            (m) => m.MobilePrefillsModule,
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [CreditCamReportsComponent],
  imports: [CommonModule, TabMenuModule, RouterModule.forChild(routes)],
})
export class CreditCamReportsModule {}
