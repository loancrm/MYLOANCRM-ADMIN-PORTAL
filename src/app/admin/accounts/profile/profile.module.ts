import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FilterModule } from 'src/app/filter/filter.module';
import { CalendarModule } from 'primeng/calendar';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TabViewModule } from 'primeng/tabview';
import { PreloaderModule } from 'src/app/preloader/preloader.module';


const routes: Routes = [{ path: "", component: ProfileComponent }];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    // PrimeNG
    TableModule,
    FormsModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    TooltipModule,
    CalendarModule,
    FilterModule,
    CapitalizeFirstPipe,
    DialogModule,
    TabViewModule,
    PreloaderModule,
    ProgressSpinnerModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
