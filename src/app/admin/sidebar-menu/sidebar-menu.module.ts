import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidebarMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    TooltipModule,
    ButtonModule,
    CapitalizeFirstPipe,
    MatExpansionModule,
    FormsModule
  ],
  exports: [SidebarMenuComponent],
})
export class SidebarMenuModule {}
