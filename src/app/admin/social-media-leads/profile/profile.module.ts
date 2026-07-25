import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { ProfileComponent } from './profile.component';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),

    DialogModule,
    DropdownModule,
    TooltipModule,
    ButtonModule,
    CalendarModule,
    CapitalizeFirstPipe
  ]
})
export class ProfileModule { }