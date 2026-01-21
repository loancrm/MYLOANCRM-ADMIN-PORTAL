import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
const routes: Routes = [{ path: '', component: UsersComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create-users/create-users.module').then((m) => m.CreateUsersModule),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./create-users/create-users.module').then((m) => m.CreateUsersModule),
  },
];
@NgModule({
  declarations: [
    UsersComponent,
    CreateUsersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TabMenuModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    [RouterModule.forChild(routes)],
  ]
})
export class UsersModule { }
