import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationsComponent } from './integrations.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: IntegrationsComponent },
 
];

@NgModule({
  declarations: [
    IntegrationsComponent
  ],
  imports: [
    CommonModule,
     [RouterModule.forChild(routes)],
  ]
})
export class IntegrationsModule { }
