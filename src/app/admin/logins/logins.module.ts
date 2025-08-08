import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginsComponent } from './logins.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { FilterModule } from 'src/app/filter/filter.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
const routes: Routes = [
  { path: '', component: LoginsComponent },
  {
    path: 'bankSelection/:id',
    loadChildren: () =>
      import('./bank-selection/bank-selection.module').then(
        (m) => m.BankSelectionModule
      ),
  },
  {
    path: 'bankSelection/:status/:id',
    loadChildren: () =>
      import('./bank-selection/bank-selection.module').then(
        (m) => m.BankSelectionModule
      ),
  },
  {
    path: 'banksSaved/:id',
    loadChildren: () =>
      import('./banks-saved/banks-saved.module').then(
        (m) => m.BanksSavedModule
      ),
  },
  {
    path: 'banksSaved/:status/:id',
    loadChildren: () =>
      import('./banks-saved/banks-saved.module').then(
        (m) => m.BanksSavedModule
      ),
  },
];

@NgModule({
  declarations: [LoginsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    MenuModule,
    InputTextModule,
    CapitalizeFirstPipe,
    TabMenuModule,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class LoginsModule { }
