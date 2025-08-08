import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CnisDetailsComponent } from './cnis-details.component';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: CnisDetailsComponent }];

@NgModule({
  declarations: [CnisDetailsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    TableModule,
    [RouterModule.forChild(routes)],
  ],
})
export class CnisDetailsModule {}
