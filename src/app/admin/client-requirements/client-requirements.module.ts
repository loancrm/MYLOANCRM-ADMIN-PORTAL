import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRequirementsComponent } from './client-requirements.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { MultiSelectModule } from 'primeng/multiselect';

const routes: Routes = [
  {
    path: '',
    component: ClientRequirementsComponent
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./create/create.module').then(m => m.CreateModule),
  },
  {
      path: 'view/:id',
      loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  }

];

@NgModule({
  declarations: [
    ClientRequirementsComponent
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
    MultiSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class ClientRequirementsModule { }