import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SocialMediaLeadsComponent } from './social-media-leads.component';
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
// const routes: Routes = [
//   { path: '', component: SocialMediaLeadsComponent },

// ];
const routes: Routes = [
  { path: '', component: SocialMediaLeadsComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create-social-media-lead/create-social-media-lead.module').then((m) => m.CreateSocialMediaLeadModule),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./create-social-media-lead/create-social-media-lead.module').then((m) => m.CreateSocialMediaLeadModule),
  },
  { path: 'single-campaign',
    loadChildren: () =>
      import('./single-whatsapp-campaign/single-whatsapp-campaign.module').then((m) => m.SingleWhatsappCampaignModule),
  }
];
@NgModule({
  declarations: [SocialMediaLeadsComponent],
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
    InputSwitchModule,
    MatMenuModule,
    MatButtonModule,
    [RouterModule.forChild(routes)],
  ]
})
export class SocialMediaLeadsModule { }
