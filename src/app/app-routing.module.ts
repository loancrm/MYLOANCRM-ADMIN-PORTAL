import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SubscriptionComponent } from './subscription/subscription.component';
import { BusinessLoanCalculatorComponent } from './calculators/business-loan-calculator/business-loan-calculator.component';
import { PersonalLoanCalculatorComponent } from './calculators/personal-loan-calculator/personal-loan-calculator.component';
import { HomeLoanCalculatorComponent } from './calculators/home-loan-calculator/home-loan-calculator.component';

const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'user/register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'user/forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule),
  },
  {
    path: 'user/reset-password',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
  },
  { path: 'user/choose-subscription', component: SubscriptionComponent },
  { path: 'calculator/business', component: BusinessLoanCalculatorComponent },
  { path: 'calculator/personal', component: PersonalLoanCalculatorComponent },
  { path: 'calculator/home', component: HomeLoanCalculatorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
