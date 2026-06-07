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
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';   // ← ADD THIS
import { TooltipModule } from 'primeng/tooltip';     // ← ADD THIS (for pTooltip on action buttons
import { LucideAngularModule,
        Home,
        User,
        Users,
        Logs,
        LayoutTemplate,
        Link,BookUser,
        WalletCards,
        Phone,
        ScrollText,
        FileText,
        UserRoundSearch,
        LogOut,
        ChartNoAxesCombined,
        Settings,
        Copy,
        Send,
        Eye,
        CircleX
        } from 'lucide-angular';
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
    CalendarModule,
    CheckboxModule,   
    TooltipModule,
    LucideAngularModule.pick({
          Home,
          User,
          Users,
          Send,
          Logs,
          LayoutTemplate,
          Link,
          BookUser,
          WalletCards,
          Phone,
          ScrollText,
          FileText,
          UserRoundSearch,
          LogOut,
          ChartNoAxesCombined,
          Settings,
          Copy,
          Eye,
          CircleX 
        }),
    RouterModule.forChild(routes),
  ]
})
export class SettingsModule { }
