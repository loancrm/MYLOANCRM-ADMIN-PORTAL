import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarModule } from "primeng/sidebar";
import { FilterComponent } from "./filter.component";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { AccordionModule } from "primeng/accordion";
import { MultiSelectModule } from "primeng/multiselect";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";

@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    AccordionModule,
    MultiSelectModule,
    NgxIntlTelInputModule,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
