import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MasterDataService } from '../master-data.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-master-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  version = projectConstantsLocal.VERSION_DESKTOP;
  locations: any[] = [];
  totalRecords = 0;
  loading = false;
  searchText = '';
  currentPage = 1;
  pageSize = 20;

  showDialog  = false;
  editMode    = false;
  selectedLoc: any = null;
  form: any   = { locationName: '', state: '', status: 1 };
  saving      = false;

  constructor(
    private location: Location,
    private masterDataService: MasterDataService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void { this.loadLocations(); }

  loadLocations(page = 1) {
    this.loading = true;
    this.currentPage = page;
    this.masterDataService.getLocations({ page, limit: this.pageSize, search: this.searchText }).subscribe({
      next: (res: any) => {
        this.locations = res.locations || [];
        this.totalRecords = res.total || 0;
        this.loading = false;
      },
      error: (err) => { this.loading = false; this.toastService.showError(err?.error || 'Error'); },
    });
  }

  onSearch() { this.loadLocations(1); }

  onPageChange(event: any) {
    this.pageSize = event.rows;
    this.loadLocations(Math.floor(event.first / event.rows) + 1);
  }

  openCreate() {
    this.editMode = false;
    this.form = { locationName: '', state: '', status: 1 };
    this.showDialog = true;
  }

  openEdit(loc: any) {
    this.editMode = true;
    this.selectedLoc = loc;
    this.form = { locationName: loc.locationName, state: loc.state || '', status: loc.status };
    this.showDialog = true;
  }

  save() {
    if (!this.form.locationName?.trim()) { this.toastService.showError('Location name is required'); return; }
    this.saving = true;
    const obs = this.editMode
      ? this.masterDataService.updateLocation(this.selectedLoc.id, this.form)
      : this.masterDataService.createLocation(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.showDialog = false; this.toastService.showSuccess(this.editMode ? 'Location updated' : 'Location created'); this.loadLocations(this.currentPage); },
      error: (err) => { this.saving = false; this.toastService.showError(err?.error || 'Error saving'); },
    });
  }

  goBack() { this.location.back(); }
}
