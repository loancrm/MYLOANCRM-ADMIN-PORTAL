import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyzedBankReportComponent } from './analyzed-bank-report.component';
import { RouterModule, Routes } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ApexChartsModule } from '../../apex-charts/apex-charts.module';
import { AccordionModule } from 'primeng/accordion';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  // other routes
  { path: '', component: AnalyzedBankReportComponent }
];
@NgModule({
  declarations: [
    AnalyzedBankReportComponent
  ],
  imports: [
    CommonModule,
    TabMenuModule, // For <p-tabMenu>
    TabViewModule,
    TableModule,
    FormsModule,
    DropdownModule,
    MenuModule,
    TreeTableModule,
    ButtonModule,
    ApexChartsModule,
    AccordionModule,
    [RouterModule.forChild(routes)],
  ]
})
export class AnalyzedBankReportModule { }
