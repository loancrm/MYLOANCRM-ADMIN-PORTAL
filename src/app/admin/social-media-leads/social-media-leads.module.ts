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
const routes: Routes = [
  { path: '', component: SocialMediaLeadsComponent },

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
    [RouterModule.forChild(routes)],
  ]
})
export class SocialMediaLeadsModule { }
