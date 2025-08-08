import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PreloaderModule } from "src/app/preloader/preloader.module";



@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PreloaderModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    SubscriptionComponent
  ]
})
export class SubscriptionModule { }
