import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbacksComponent } from './callbacks.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TabMenuModule } from 'primeng/tabmenu';

const routes: Routes = [
  { path: '', component: CallbacksComponent },
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
  declarations: [CallbacksComponent],
  imports: [
    CommonModule,
    FormsModule,
    CapitalizeFirstPipe,
    TableModule,
    BreadcrumbModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    FilterModule,
    DropdownModule,
    TabMenuModule,
    [RouterModule.forChild(routes)],
  ],
})
export class CallbacksModule {}
