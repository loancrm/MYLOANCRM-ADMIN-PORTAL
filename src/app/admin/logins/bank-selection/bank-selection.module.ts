import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankSelectionComponent } from './bank-selection.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
const routes: Routes = [{ path: '', component: BankSelectionComponent }];

@NgModule({
  declarations: [BankSelectionComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CheckboxModule,
    PreloaderModule,
    InputTextModule,
    RadioButtonModule,
    FormsModule,
    CapitalizeFirstPipe,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class BankSelectionModule {}
