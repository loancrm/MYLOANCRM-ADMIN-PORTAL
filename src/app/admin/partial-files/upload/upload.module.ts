import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { RouterModule, Routes } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: UploadComponent }];

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    StepsModule,
    PreloaderModule,
    TabMenuModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    CalendarModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class UploadModule {}
