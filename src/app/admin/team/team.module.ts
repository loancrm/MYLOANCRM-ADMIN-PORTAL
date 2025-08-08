import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [
  { path: '', component: TeamComponent },
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
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
  },
];

@NgModule({
  declarations: [TeamComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    BreadcrumbModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MenuModule,
    FilterModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class TeamModule {}
