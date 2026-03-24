import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
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
import { ButtonModule } from 'primeng/button';
import { CreateTemplateComponent } from './create-template.component';
@NgModule({
  declarations: [CreateTemplateComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
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
  ],
  exports: [
    CreateTemplateComponent  // ✅ exported for anyone to use
  ]
})
export class CreateTemplateModule { }
