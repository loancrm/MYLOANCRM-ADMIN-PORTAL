import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { RouterModule, Routes } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: UploadComponent }];

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    StepsModule,
    TabMenuModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    PreloaderModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    CalendarModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class UploadModule {}
