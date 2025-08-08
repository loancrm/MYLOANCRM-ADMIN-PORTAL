import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginsDoneComponent } from './logins-done.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { TableModule } from 'primeng/table';
import {
  CapitalizeFirstPipe,
  UppercasePipe,
} from 'src/app/pipes/capitalize.pipe';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: LoginsDoneComponent }];

@NgModule({
  declarations: [LoginsDoneComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    TableModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
    UppercasePipe,
  ],
})
export class LoginsDoneModule {}
