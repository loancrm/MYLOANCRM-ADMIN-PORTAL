import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ApexChartsModule } from '../apex-charts/apex-charts.module';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ApexChartsModule,
    DropdownModule,
    CapitalizeFirstPipe,
    PreloaderModule,
    TableModule,
    FormsModule,
    ChartModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
