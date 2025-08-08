import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanleadsevaluatecreditComponent } from './loanleadsevaluatecredit.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CapitalizeFirstPipe } from "../../../pipes/capitalize.pipe";
import { AccordionModule } from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: LoanleadsevaluatecreditComponent }];


@NgModule({
  declarations: [
    LoanleadsevaluatecreditComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    [RouterModule.forChild(routes)],
    CapitalizeFirstPipe
  ]
})
export class LoanleadsevaluatecreditModule { }
