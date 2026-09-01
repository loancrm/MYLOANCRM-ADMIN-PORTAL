import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaymentsComponent } from './payments.component';

const routes: Routes = [{ path: '', component: PaymentsComponent }];

@NgModule({
  declarations: [PaymentsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    TabViewModule,
    PreloaderModule,
    InputSwitchModule,
    InputTextModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    RouterModule.forChild(routes),
  ],
})
export class PaymentsModule {}
