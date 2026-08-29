import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG
import { TableModule }       from 'primeng/table';
import { DropdownModule }    from 'primeng/dropdown';
import { ButtonModule }      from 'primeng/button';
import { InputTextModule }   from 'primeng/inputtext';
import { DialogModule }      from 'primeng/dialog';
import { TooltipModule }     from 'primeng/tooltip';
import { TabViewModule }     from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';

// Components
import { MasterDataComponent }  from './master-data.component';
import { BanksComponent }       from './banks/banks.component';
import { LocationsComponent }   from './locations/locations.component';
import { CategoriesComponent }  from './categories/categories.component';
import { CompaniesComponent }   from './companies/companies.component';
import { UploadsComponent }     from './uploads/uploads.component';

// Service
import { MasterDataService }    from './master-data.service';

const routes: Routes = [
  { path: '',           component: MasterDataComponent },
  { path: 'banks',      component: BanksComponent      },
  { path: 'locations',  component: LocationsComponent  },
  { path: 'categories', component: CategoriesComponent },
  { path: 'companies',  component: CompaniesComponent  },
  { path: 'uploads',    component: UploadsComponent    },
];

@NgModule({
  declarations: [
    MasterDataComponent,
    BanksComponent,
    LocationsComponent,
    CategoriesComponent,
    CompaniesComponent,
    UploadsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    TabViewModule,
    ProgressBarModule,
  ],
  providers: [MasterDataService],
})
export class MasterDataModule {}
