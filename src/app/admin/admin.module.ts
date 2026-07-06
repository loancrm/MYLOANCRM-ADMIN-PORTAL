
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderModule } from './header/header.module';
import { SidebarMenuModule } from './sidebar-menu/sidebar-menu.module';
import { BulkAssignModule } from './bulk-assign/bulk-assign.module';
// import { WhatsappTemplatesComponent } from './whatsapp-templates/whatsapp-templates.component';
// import { CampaignComponent } from './campaign/campaign.component';
// import { LogsComponent } from './logs/logs.component';
// import { BulkWhatsappModalModule } from './bulk-whatsapp-modal/bulk-whatsapp-modal.module'; // ✅ ADD THIS


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    HeaderModule,
    SidebarMenuModule,
    BulkAssignModule,
  ],
  exports: [AdminComponent],
})
export class AdminModule {}
