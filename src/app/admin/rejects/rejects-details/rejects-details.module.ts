import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RejectsDetailsComponent } from './rejects-details.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: RejectsDetailsComponent }];

@NgModule({
  declarations: [RejectsDetailsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class RejectsDetailsModule {}
