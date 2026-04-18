import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
const routes: Routes = [
  { path: '', component: SettingsComponent }
]
@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    ButtonModule,
    DialogModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    TabViewModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    RouterModule.forChild(routes),
  ]
})
export class SettingsModule { }
