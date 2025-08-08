import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalLoanCalculatorComponent } from './personal-loan-calculator.component';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ApexChartsModule } from 'src/app/admin/apex-charts/apex-charts.module';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


const routes: Routes = [{ path: '', component: PersonalLoanCalculatorComponent }];

@NgModule({
  declarations: [
    PersonalLoanCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ApexChartsModule,
    RouterModule.forChild(routes),
    SliderModule,
    TableModule,
    ButtonModule
  ],
  exports:[
    PersonalLoanCalculatorComponent
  ]
})
export class PersonalLoanCalculatorModule { }
