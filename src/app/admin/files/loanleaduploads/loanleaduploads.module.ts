import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanleaduploadsComponent } from './loanleaduploads.component';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [{ path: '', component: LoanleaduploadsComponent }];

@NgModule({
  declarations: [LoanleaduploadsComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipe,
    BreadcrumbModule,
    TabMenuModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    [RouterModule.forChild(routes)],
  ],
})
export class LoanleaduploadsModule {}
