import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribersComponent } from './subscribers.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';


const routes: Routes = [
  { path: '', component: SubscribersComponent },

];
@NgModule({
  declarations: [
    SubscribersComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipe,
    TableModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    MenuModule,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ]
})
export class SubscribersModule { }
