import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowupsComponent } from './followups.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
const routes: Routes = [{ path: '', component: FollowupsComponent }];

@NgModule({
  declarations: [FollowupsComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    BreadcrumbModule,
    MenuModule,
    CapitalizeFirstPipe,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class FollowupsModule {}
