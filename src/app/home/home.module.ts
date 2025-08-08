import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { AnimationsModule } from '../modules/animations/animations.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavbarModule } from './navbar/navbar.module';
import { FooterModule } from './footer/footer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactComponent } from './contact/contact.component';

import { AdminModule } from '../admin/admin.module';
import { ContactModule } from './contact/contact.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'home', component: LandingPageComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AnimationsModule,
    BrowserAnimationsModule,
    NavbarModule,
    FooterModule,
    RouterModule,
    AdminModule,
    ContactModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
