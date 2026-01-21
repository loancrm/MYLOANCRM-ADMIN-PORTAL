import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUsersComponent } from './create-users.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
const routes: Routes = [{ path: '', component: CreateUsersComponent }];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    [RouterModule.forChild(routes)],
  ]
})
export class CreateUsersModule { }
