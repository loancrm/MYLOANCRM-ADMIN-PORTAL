import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankersComponent } from './bankers.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { PreloaderModule } from 'src/app/preloader/preloader.module';

const routes: Routes = [
  { path: '', component: BankersComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'banker-profile/:id',
    loadChildren: () =>
      import('./banker-profile/banker-profile.module').then(
        (m) => m.BankerProfileModule
      ),
  },
  {
    path: 'loginsDone/:id',
    loadChildren: () =>
      import('./logins-done/logins-done.module').then(
        (m) => m.LoginsDoneModule
      ),
  },
];

@NgModule({
  declarations: [BankersComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    BreadcrumbModule,
    PreloaderModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MenuModule,
    [RouterModule.forChild(routes)],
  ],
})
export class BankersModule {}
