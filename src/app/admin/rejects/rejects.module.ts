import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RejectsComponent } from './rejects.component';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FilterModule } from 'src/app/filter/filter.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [
  { path: '', component: RejectsComponent },
  {
    path: 'rejectsDetails/:id',
    loadChildren: () =>
      import('./rejects-details/rejects-details.module').then(
        (m) => m.RejectsDetailsModule
      ),
  },
  {
    path: 'rejectsDetails/:status/:id',
    loadChildren: () =>
      import('./rejects-details/rejects-details.module').then(
        (m) => m.RejectsDetailsModule
      ),
  },
  {
    path: 'cniDetails/:id',
    loadChildren: () =>
      import('./cnis-details/cnis-details.module').then(
        (m) => m.CnisDetailsModule
      ),
  },
  {
    path: 'cniDetails/:status/:id',
    loadChildren: () =>
      import('./cnis-details/cnis-details.module').then(
        (m) => m.CnisDetailsModule
      ),
  },
  {
    path: 'inHouseRejects/:id',
    loadChildren: () =>
      import('./in-house-details/in-house-details.module').then(
        (m) => m.InHouseDetailsModule
      ),
  },
];
@NgModule({
  declarations: [RejectsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    DropdownModule,
    CapitalizeFirstPipe,
    ButtonModule,
    FormsModule,
    MenuModule,
    TabMenuModule,
    InputTextModule,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class RejectsModule { }
