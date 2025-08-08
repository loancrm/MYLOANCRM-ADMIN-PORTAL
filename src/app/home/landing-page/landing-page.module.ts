import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ContactModule } from '../contact/contact.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


const routes: Routes = [
  {
    path: '', component: LandingPageComponent
  }
];

@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    CarouselModule,
    ContactModule,
    BrowserAnimationsModule,
    BrowserModule,

    [RouterModule.forChild(routes)]
  ],
  exports: [
    LandingPageComponent
  ]
})
export class LandingPageModule { }
