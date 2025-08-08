import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalsComponent } from './approvals.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TabMenuModule } from 'primeng/tabmenu';
const routes: Routes = [
  { path: '', component: ApprovalsComponent },
  {
    path: 'approvalDetails/:id',
    loadChildren: () =>
      import('./approved-amount/approved-amount.module').then(
        (m) => m.ApprovedAmountModule
      ),
  },
  {
    path: 'approvalDetails/:status/:id',
    loadChildren: () =>
      import('./approved-amount/approved-amount.module').then(
        (m) => m.ApprovedAmountModule
      ),
  },
];

@NgModule({
  declarations: [ApprovalsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    BreadcrumbModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    MenuModule,
    InputTextModule,
    TabMenuModule,
    FilterModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class ApprovalsModule { }
