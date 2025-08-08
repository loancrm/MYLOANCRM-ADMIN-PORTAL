import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { PreloaderModule } from '../../../preloader/preloader.module';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [{ path: '', component: CreateComponent }];

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    BreadcrumbModule,
    CalendarModule,
    PreloaderModule,
    DropdownModule,
    RadioButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class CreateModule {}
