import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankerProfileComponent } from './banker-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AccordionModule } from 'primeng/accordion';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: BankerProfileComponent }];

@NgModule({
  declarations: [BankerProfileComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    AccordionModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class BankerProfileModule {}
