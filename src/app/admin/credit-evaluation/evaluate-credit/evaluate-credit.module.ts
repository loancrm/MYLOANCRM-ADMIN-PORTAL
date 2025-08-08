import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluateCreditComponent } from './evaluate-credit.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from "primeng/table";

const routes: Routes = [{ path: '', component: EvaluateCreditComponent }];

@NgModule({
  declarations: [EvaluateCreditComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    TableModule,
    ReactiveFormsModule,
    CapitalizeFirstPipe,
    AccordionModule,
    [RouterModule.forChild(routes)],
  ],
})
export class EvaluateCreditModule { }
