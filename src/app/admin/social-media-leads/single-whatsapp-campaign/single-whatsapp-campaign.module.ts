import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleWhatsappCampaignComponent } from './single-whatsapp-campaign.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
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
const routes: Routes = [{ path: '', component: SingleWhatsappCampaignComponent }];

@NgModule({
  declarations: [
    SingleWhatsappCampaignComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
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
    [RouterModule.forChild(routes)],
  ]
})
export class SingleWhatsappCampaignModule { }
