import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { ApexChartsModule } from '../../apex-charts/apex-charts.module';
import { PreloaderModule } from 'src/app/preloader/preloader.module';

const routes: Routes = [{ path: '', component: ViewComponent }];

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    AccordionModule,
    ButtonModule,
    TabMenuModule,
    TimelineModule,
    FormsModule,
    InputTextModule,
    TableModule,
    FilterModule,
    MenuModule,
    CapitalizeFirstPipe,
    PreloaderModule,
    ApexChartsModule,
    [RouterModule.forChild(routes)],
  ],
})
export class ViewModule {}
