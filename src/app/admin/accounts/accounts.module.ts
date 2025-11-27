import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';


const routes: Routes = [
  { path: '', component: AccountsComponent },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./profile/profile.module').then(
        (m) => m.ProfileModule
      ),
  },
];

@NgModule({
  declarations: [
    AccountsComponent
  ],
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
  ]
})
export class AccountsModule { }
