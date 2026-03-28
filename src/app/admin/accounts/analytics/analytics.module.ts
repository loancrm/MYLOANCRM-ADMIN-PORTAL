import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// const routes: Routes = [
//   { path: '', component: AnalyticsComponent }
// ];


@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
    exports: [
      AnalyticsComponent  // ✅ exported for anyone to use
    ]
})
export class AnalyticsModule { }
