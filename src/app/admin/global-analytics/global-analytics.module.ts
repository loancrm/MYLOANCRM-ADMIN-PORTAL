import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalAnalyticsComponent } from './global-analytics.component';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'; 
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
const routes: Routes = [
  { path: '', component: GlobalAnalyticsComponent },
  {
    path: 'leads-breakdown/:accountId',  // ← ADD THIS
    loadChildren: () =>
      import('./account-leads-breakdown/account-leads-breakdown.module').then(
        (m) => m.AccountLeadsBreakdownModule
      ),
  },
]


@NgModule({
  declarations: [
    GlobalAnalyticsComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    TabViewModule,
    PreloaderModule,
    InputSwitchModule,
    InputTextModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    [RouterModule.forChild(routes)],
  ]
})
export class GlobalAnalyticsModule { }
