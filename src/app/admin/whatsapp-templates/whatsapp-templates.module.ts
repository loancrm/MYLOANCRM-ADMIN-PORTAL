import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CreateTemplateComponent } from './create-template/create-template.component';
import { WhatsappTemplatesComponent } from './whatsapp-templates.component';
import { CreateTemplateModule } from './create-template/create-template.module'; // ✅

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
import { TooltipModule } from 'primeng/tooltip';
import { LucideAngularModule, RefreshCw, SquarePen, Trash2 } from 'lucide-angular';
const routes: Routes = [
  { path: '', component: WhatsappTemplatesComponent }
];


@NgModule({
  declarations: [
    WhatsappTemplatesComponent
  ],
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
    TooltipModule,
    CreateTemplateModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({ RefreshCw, SquarePen, Trash2 })
  ],
    exports: [
    WhatsappTemplatesComponent,  // ✅ Export so CampaignModule can use it
    // CreateTemplateComponent      // ✅ Export so CampaignModule can use it
    CreateTemplateModule
  ]
})
export class WhatsappTemplatesModule { }
