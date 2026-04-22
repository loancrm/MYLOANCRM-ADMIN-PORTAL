import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
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
  { path: '', component: SubscriptionsComponent },]

@NgModule({
  declarations: [
    SubscriptionsComponent
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
export class SubscriptionsModule { }
