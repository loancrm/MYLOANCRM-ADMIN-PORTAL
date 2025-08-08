import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditEvaluationComponent } from './credit-evaluation.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TabMenuModule } from 'primeng/tabmenu';

const routes: Routes = [
  { path: '', component: CreditEvaluationComponent },
  {
    path: 'evaluate/:id',
    loadChildren: () =>
      import('./evaluate-credit/evaluate-credit.module').then(
        (m) => m.EvaluateCreditModule
      ),
  },
  {
    path: 'evaluate/:status/:id',
    loadChildren: () =>
      import('./evaluate-credit/evaluate-credit.module').then(
        (m) => m.EvaluateCreditModule
      ),
  },
  {
    path: 'loan-evaluate/:id',
    loadChildren: () =>
      import('./loanleadsevaluatecredit/loanleadsevaluatecredit.module').then(
        (m) => m.LoanleadsevaluatecreditModule
      ),
  }
];

@NgModule({
  declarations: [CreditEvaluationComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    TableModule,
    DropdownModule,
    ButtonModule,
    FilterModule,
    FormsModule,
    MenuModule,
    TabMenuModule,
    InputTextModule,
    [RouterModule.forChild(routes)],
  ],
})
export class CreditEvaluationModule { }
