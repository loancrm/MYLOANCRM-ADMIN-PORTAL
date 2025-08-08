import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartialFilesComponent } from './partial-files.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [
  { path: '', component: PartialFilesComponent },
  {
    path: 'upload/:id',
    loadChildren: () =>
      import('./upload/upload.module').then((m) => m.UploadModule),
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
  },
];

@NgModule({
  declarations: [PartialFilesComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    CapitalizeFirstPipe,
    DropdownModule,
    ButtonModule,
    BreadcrumbModule,
    FilterModule,
    MenuModule,
    [RouterModule.forChild(routes)],
  ],
})
export class PartialFilesModule {}
