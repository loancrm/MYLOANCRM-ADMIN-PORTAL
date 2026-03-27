import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickLinksComponent } from './quick-links.component';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
const routes: Routes = [
  { path: '', component: QuickLinksComponent }
];


@NgModule({
  declarations: [
    QuickLinksComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    RouterModule.forChild(routes)
  ]
})
export class QuickLinksModule { }
