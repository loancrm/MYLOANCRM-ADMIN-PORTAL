import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsComponent } from './leads.component';
import { CreateComponent } from './create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TabMenuModule } from 'primeng/tabmenu';

const routes: Routes = [
  { path: '', component: LeadsComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'createLoanLead',
    loadChildren: () =>
      import('./loan-leads/loan-leads.module').then((m) => m.LoanLeadsModule),
  },
  {
    path: 'updateLoanLead/:id',
    loadChildren: () =>
      import('./loan-leads/loan-leads.module').then((m) => m.LoanLeadsModule),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./lead-profile/lead-profile.module').then(
        (m) => m.LeadProfileModule
      ),
  },
  {
    path: 'profile/:status/:id',
    loadChildren: () =>
      import('./lead-profile/lead-profile.module').then(
        (m) => m.LeadProfileModule
      ),
  },
];

@NgModule({
  declarations: [LeadsComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipe,
    TableModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    BreadcrumbModule,
    MenuModule,
    FilterModule,
    TabMenuModule,
    [RouterModule.forChild(routes)],
  ],
})
export class LeadsModule {}
