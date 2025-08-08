import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'leads',
        loadChildren: () =>
          import('./leads/leads.module').then((m) => m.LeadsModule),
      },
      {
        path: 'leads/:type',
        loadChildren: () =>
          import('./leads/leads.module').then((m) => m.LeadsModule),
      },
      {
        path: 'callbacks',
        loadChildren: () =>
          import('./callbacks/callbacks.module').then((m) => m.CallbacksModule),
      },
      {
        path: 'followups',
        loadChildren: () =>
          import('./followups/followups.module').then((m) => m.FollowupsModule),
      },
      {
        path: 'files',
        loadChildren: () =>
          import('./files/files.module').then((m) => m.FilesModule),
      },
      {
        path: 'files/:type',
        loadChildren: () =>
          import('./files/files.module').then((m) => m.FilesModule),
      },
      // {
      //   path: 'partial',
      //   loadChildren: () =>
      //     import('./partial-files/partial-files.module').then(
      //       (m) => m.PartialFilesModule
      //     ),
      // },
      // {
      //   path: 'partial/:type',
      //   loadChildren: () =>
      //     import('./partial-files/partial-files.module').then(
      //       (m) => m.PartialFilesModule
      //     ),
      // },
      {
        path: 'credit',
        loadChildren: () =>
          import('./credit-evaluation/credit-evaluation.module').then(
            (m) => m.CreditEvaluationModule
          ),
      },
      {
        path: 'team',
        loadChildren: () =>
          import('./team/team.module').then((m) => m.TeamModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'ipAddress',
        loadChildren: () =>
          import('./ip-address/ip-address.module').then(
            (m) => m.IpAddressModule
          ),
      },
      {
        path: 'integrations',
        loadChildren: () =>
          import('./integrations/integrations.module').then(
            (m) => m.IntegrationsModule
          ),
      },

      {
        path: 'bankers',
        loadChildren: () =>
          import('./bankers/bankers.module').then((m) => m.BankersModule),
      },
      {
        path: 'rejects',
        loadChildren: () =>
          import('./rejects/rejects.module').then((m) => m.RejectsModule),
      },

      {
        path: 'logins',
        loadChildren: () =>
          import('./logins/logins.module').then((m) => m.LoginsModule),
      },
      {
        path: 'filesinprocess',
        loadChildren: () =>
          import('./filesin-process/filesin-process.module').then(
            (m) => m.FilesinProcessModule
          ),
      },
      {
        path: 'logins/:type',
        loadChildren: () =>
          import('./leads/leads.module').then((m) => m.LeadsModule),
      },
      {
        path: 'approvals',
        loadChildren: () =>
          import('./approvals/approvals.module').then((m) => m.ApprovalsModule),
      },
      {
        path: 'disbursals',
        loadChildren: () =>
          import('./disbursals/disbursals.module').then(
            (m) => m.DisbursalsModule
          ),
      },
      {
        path: 'bsanalyzer',
        loadChildren: () =>
          import('./bsanalyzer/bsanalyzer.module').then((m) => m.BsanalyzerModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
