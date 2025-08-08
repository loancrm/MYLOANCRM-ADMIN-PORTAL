import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessLoanCalculatorComponent } from './business-loan-calculator.component';
import { FormsModule } from '@angular/forms';
import { ApexChartsModule } from 'src/app/admin/apex-charts/apex-charts.module';
import { RouterModule, Routes } from '@angular/router';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


const routes: Routes = [{ path: '', component: BusinessLoanCalculatorComponent }];

@NgModule({
  declarations: [
    BusinessLoanCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ApexChartsModule,
    RouterModule.forChild(routes),
    SliderModule,
    TableModule,
    ButtonModule
  ],
  exports: [
    BusinessLoanCalculatorComponent
  ]
})
export class BusinessLoanCalculatorModule { }
