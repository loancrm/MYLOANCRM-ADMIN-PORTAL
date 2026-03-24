import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LogsComponent } from './logs.component';

const routes: Routes = [
  { path: '', component: LogsComponent }
];

@NgModule({
  declarations: [LogsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class LogsModule {}