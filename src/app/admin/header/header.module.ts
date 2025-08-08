import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LeadSearchModule } from '../leadSearch/leadSearch.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    SidebarModule,
    CapitalizeFirstPipe,
    InputTextModule,
    LeadSearchModule,
    OverlayPanelModule
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
