import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';


import { TabMenuModule } from 'primeng/tabmenu';
import { BadgeModule } from 'primeng/badge';

import { LandingPageModule } from '../landing-page/landing-page.module';

@NgModule({
  declarations: [
    NavbarComponent

  ],
  imports: [
    CommonModule,
    TabMenuModule,
    BadgeModule,
    LandingPageModule,
    RouterModule

  ],
  exports:[
    NavbarComponent
  ]
})
export class NavbarModule { }
