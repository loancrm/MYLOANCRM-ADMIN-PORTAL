import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LogsComponent } from './logs.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
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
import { TooltipModule } from 'primeng/tooltip';
import { LucideAngularModule,Search } from 'lucide-angular';
const routes: Routes = [
  { path: '', component: LogsComponent }
];

@NgModule({
  declarations: [LogsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
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
    TooltipModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      Search 
    })
  ]
})
export class LogsModule {}