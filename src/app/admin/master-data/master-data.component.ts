import { Component } from '@angular/core';
import { RoutingService } from 'src/app/services/routing-service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss'],
})
export class MasterDataComponent {
  version = projectConstantsLocal.VERSION_DESKTOP;

  sections = [
    { label: 'Banks',            icon: 'pi pi-building',    route: 'banks',      desc: 'Manage master bank list' },
    { label: 'Locations',        icon: 'pi pi-map-marker',  route: 'locations',  desc: 'Manage cities & locations' },
    { label: 'Categories',       icon: 'pi pi-tag',         route: 'categories', desc: 'Manage company categories' },
    { label: 'Companies',        icon: 'pi pi-list',        route: 'companies',  desc: 'View companies by bank & location' },
    { label: 'Upload Data',      icon: 'pi pi-upload',      route: 'uploads',    desc: 'Bulk upload company Excel files' },
  ];

  constructor(private routingService: RoutingService) {}

  navigate(route: string) {
    this.routingService.handleRoute('master-data/' + route, null);
  }
}
