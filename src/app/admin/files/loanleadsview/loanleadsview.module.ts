import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanleadsviewComponent } from './loanleadsview.component';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { BreadcrumbModule } from 'primeng/breadcrumb';

const routes: Routes = [{ path: '', component: LoanleadsviewComponent }];


@NgModule({
  declarations: [
    LoanleadsviewComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipe,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ]
})
export class LoanleadsviewModule { }
