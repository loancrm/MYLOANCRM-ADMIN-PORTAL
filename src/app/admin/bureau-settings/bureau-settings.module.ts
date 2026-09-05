import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { BureauSettingsComponent } from './bureau-settings.component';

const routes: Routes = [{ path: '', component: BureauSettingsComponent }];

@NgModule({
  declarations: [BureauSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    SelectButtonModule,
    TooltipModule,
    RouterModule.forChild(routes),
  ],
})
export class BureauSettingsModule {}
