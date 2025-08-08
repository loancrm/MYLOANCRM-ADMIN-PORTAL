import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeLoanCalculatorComponent } from './home-loan-calculator.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ApexChartsModule } from 'src/app/admin/apex-charts/apex-charts.module';
import { BusinessLoanCalculatorComponent } from '../business-loan-calculator/business-loan-calculator.component';
import { ButtonModule } from 'primeng/button';


const routes: Routes = [{ path: '', component: HomeLoanCalculatorComponent }];

@NgModule({
  declarations: [
    HomeLoanCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ApexChartsModule,
    RouterModule.forChild(routes),
    SliderModule,
    ButtonModule,
    TableModule
  ],
  exports: [
    HomeLoanCalculatorComponent
  ]
})
export class HomeLoanCalculatorModule { }
