import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpAddressComponent } from './ip-address.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FilterModule } from 'src/app/filter/filter.module';

const routes: Routes = [
  { path: '', component: IpAddressComponent },
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
];

@NgModule({
  declarations: [IpAddressComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class IpAddressModule {}
