import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountLeadsBreakdownComponent } from './account-leads-breakdown.component';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'; 
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
const routes: Routes = [
  { path: '', component: AccountLeadsBreakdownComponent },
  

]
@NgModule({
  declarations: [
    AccountLeadsBreakdownComponent
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
    CapitalizeFirstPipe,
    [RouterModule.forChild([{ path: '', component: AccountLeadsBreakdownComponent }])],
  ]
})
export class AccountLeadsBreakdownModule { }
