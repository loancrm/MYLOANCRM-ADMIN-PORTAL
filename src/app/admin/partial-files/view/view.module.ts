import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';


const routes: Routes = [{ path: '', component: ViewComponent }];

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)]
  ]
})
export class ViewModule { }
