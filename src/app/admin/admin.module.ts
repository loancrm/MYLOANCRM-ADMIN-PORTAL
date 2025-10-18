import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderModule } from './header/header.module';
import { SidebarMenuModule } from './sidebar-menu/sidebar-menu.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    HeaderModule,
    SidebarMenuModule,
  ],
  exports: [AdminComponent],
})
export class AdminModule {}
