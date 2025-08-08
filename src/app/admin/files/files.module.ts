import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
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
import { TabMenuModule } from 'primeng/tabmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
const routes: Routes = [
  { path: '', component: FilesComponent },
  {
    path: 'upload/:id',
    loadChildren: () =>
      import('./upload/upload.module').then((m) => m.UploadModule),
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
  },
  {
    path: 'loanleadview/:id',
    loadChildren: () =>
      import('./loanleadsview/loanleadsview.module').then(
        (m) => m.LoanleadsviewModule
      ),
  },
  {
    path: 'uploadloanleads/:id',
    loadChildren: () =>
      import('./loanleaduploads/loanleaduploads.module').then(
        (m) => m.LoanleaduploadsModule
      ),
  },
];

@NgModule({
  declarations: [FilesComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    TabMenuModule,
    CapitalizeFirstPipe,
    ButtonModule,
    FilterModule,
    BreadcrumbModule,
    OverlayPanelModule,
    MenuModule,
    CalendarModule,
    [RouterModule.forChild(routes)],
  ],
})
export class FilesModule {}
