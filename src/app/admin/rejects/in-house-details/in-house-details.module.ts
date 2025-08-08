import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TableModule } from 'primeng/table';
import { InHouseDetailsComponent } from './in-house-details.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: InHouseDetailsComponent }];
@NgModule({
  declarations: [InHouseDetailsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class InHouseDetailsModule {}
