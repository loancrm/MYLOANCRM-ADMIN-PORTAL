import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsanalyzerComponent } from './bsanalyzer.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: BsanalyzerComponent },

];
@NgModule({
  declarations: [
    BsanalyzerComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    [RouterModule.forChild(routes)],
  ]
})
export class BsanalyzerModule { }
