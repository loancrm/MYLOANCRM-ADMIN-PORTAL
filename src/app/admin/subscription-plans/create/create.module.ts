import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { PreloaderModule } from 'src/app/preloader/preloader.module';

const routes: Routes = [{ path: '', component: CreateComponent }];


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    StepsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    PreloaderModule,
    [RouterModule.forChild(routes)],
  ]
})
export class CreateModule { }
