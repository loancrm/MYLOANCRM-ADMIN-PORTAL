import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LeadProfileComponent } from "./lead-profile.component";
import { RouterModule, Routes } from "@angular/router";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { PreloaderModule } from "src/app/preloader/preloader.module";
import { CapitalizeFirstPipe } from "src/app/pipes/capitalize.pipe";
import { TimelineModule } from "primeng/timeline";
import { TableModule } from "primeng/table";
import { PanelModule } from "primeng/panel";
import { DialogModule } from "primeng/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
const routes: Routes = [{ path: "", component: LeadProfileComponent }];

@NgModule({
  declarations: [LeadProfileComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    PreloaderModule,
    TimelineModule,
    TableModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [LeadProfileComponent]
})
export class LeadProfileModule {}
