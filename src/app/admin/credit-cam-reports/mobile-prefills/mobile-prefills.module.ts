import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MobilePrefillsComponent } from './mobile-prefills.component';

const routes: Routes = [{ path: '', component: MobilePrefillsComponent }];

@NgModule({
  declarations: [MobilePrefillsComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    RouterModule.forChild(routes),
  ],
})
export class MobilePrefillsModule {}
