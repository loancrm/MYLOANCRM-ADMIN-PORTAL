import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoBookingsComponent } from './demo-bookings.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { AccordionModule } from 'primeng/accordion';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
const routes: Routes = [
  { path: '', component: DemoBookingsComponent },
]

@NgModule({
  declarations: [
    DemoBookingsComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    MenuModule,
    TableModule,
    TabMenuModule,
    FilterModule,
    CapitalizeFirstPipe,
    DialogModule,
    ProgressBarModule,
    AccordionModule,
    RippleModule,
    MultiSelectModule,
    FormsModule,
    InputSwitchModule,
    MatMenuModule,
    MatButtonModule,
    CalendarModule,
    [RouterModule.forChild(routes)],

  ]
})
export class DemoBookingsModule { }
