import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesinProcessComponent } from './filesin-process.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TabMenuModule } from 'primeng/tabmenu';

const routes: Routes = [{ path: '', component: FilesinProcessComponent }];

@NgModule({
  declarations: [FilesinProcessComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    MenuModule,
    InputTextModule,
    CapitalizeFirstPipe,
    TabMenuModule,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class FilesinProcessModule {}
