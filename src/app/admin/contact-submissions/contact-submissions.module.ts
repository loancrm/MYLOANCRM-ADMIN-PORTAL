import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSubmissionsComponent } from './contact-submissions.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


const routes: Routes = [
  { path: '', component: ContactSubmissionsComponent },

];
@NgModule({
  declarations: [ContactSubmissionsComponent],
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
export class ContactSubmissionsModule { }
