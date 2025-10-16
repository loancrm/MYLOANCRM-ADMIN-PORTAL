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
        path: 'accounts',
        loadChildren: () =>
          import('./accounts/accounts.module').then((m) => m.AccountsModule),
      },
      {
        path: 'subscription-plans',
        loadChildren: () =>
          import('./subscription-plans/subscription-plans.module').then((m) => m.SubscriptionPlansModule),
      },
      {
        path: 'contact-submissions',
        loadChildren: () =>
          import('./contact-submissions/contact-submissions.module').then((m) => m.ContactSubmissionsModule),
      },
      {
        path: 'subscribers',
        loadChildren: () =>
          import('./subscribers/subscribers.module').then((m) => m.SubscribersModule),
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
        path: 'social-media-leads',
        loadChildren: () =>
          import('./social-media-leads/social-media-leads.module').then((m) => m.SocialMediaLeadsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
