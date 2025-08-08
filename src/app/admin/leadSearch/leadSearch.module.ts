import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadSearchComponent } from './leadSearch.component';
import { DialogModule } from 'primeng/dialog';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [LeadSearchComponent],
  imports: [CommonModule, DialogModule, ButtonModule, CapitalizeFirstPipe, TableModule],
})
export class LeadSearchModule { }
