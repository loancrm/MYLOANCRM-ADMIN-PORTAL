import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkAssignComponent } from './bulk-assign.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';


@NgModule({
  declarations: [
    BulkAssignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
  ButtonModule,
     RadioButtonModule
  ],
  exports: [
    BulkAssignComponent
  ]
})
export class BulkAssignModule { }
