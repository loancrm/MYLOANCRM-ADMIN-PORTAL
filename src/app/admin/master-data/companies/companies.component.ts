import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MasterDataService } from '../master-data.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-master-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  version = projectConstantsLocal.VERSION_DESKTOP;
  companies: any[] = [];
  banks: any[]     = [];
  locations: any[] = [];
  categories: any[]= [];
  totalRecords = 0;
  loading = false;

  selectedBankId: any     = null;
  selectedLocationId: any = null;
  selectedCategory        = '';
  searchText              = '';
  pageSize                = 50;
  currentPage             = 1;

  constructor(
    private location: Location,
    private masterDataService: MasterDataService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks() {
    this.masterDataService.getBanks({ status: 1, limit: 500 }).subscribe({
      next: (res: any) => { this.banks = res.banks || []; },
      error: () => {},
    });
  }

  loadLocations() {
    if (!this.selectedBankId) return;
    this.locations = [];
    // Only show locations that have actual company data for this bank
    this.masterDataService.getLocationsByBank(this.selectedBankId).subscribe({
      next: (res: any) => { this.locations = Array.isArray(res) ? res : []; },
      error: () => {},
    });
  }

  loadCategoriesByBank() {
    if (!this.selectedBankId) return;
    // Use the bank-specific endpoint so only categories with data are shown
    this.masterDataService.getCategoriesByBank(this.selectedBankId).subscribe({
      next: (res: any) => { this.categories = Array.isArray(res) ? res : []; },
      error: () => {},
    });
  }

  onBankChange() {
    this.selectedLocationId = null;
    this.selectedCategory = '';
    this.companies = [];
    this.totalRecords = 0;
    this.categories = [];
    this.loadLocations();
    this.loadCategoriesByBank();
  }

  loadCompanies(page = 1) {
    if (!this.selectedBankId) {
      this.toastService.showError('Please select a Bank first');
      return;
    }
    this.loading = true;
    this.currentPage = page;
    this.masterDataService.getCompanies({
      bankId:     this.selectedBankId,
      locationId: this.selectedLocationId,
      search:     this.searchText,
      category:   this.selectedCategory,
      page,
      limit:      this.pageSize,
    }).subscribe({
      next: (res: any) => {
        this.companies    = res.companies || [];
        this.totalRecords = res.total || 0;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError(err?.error || 'Error loading companies');
      },
    });
  }

  get categoryOptions() {
    return [
      { label: 'All Categories', value: '' },
      ...this.categories.map((c: any) => ({
        label: c.categoryName,
        value: c.categoryName,   // always name — backend filters by mc.categoryName
      })),
    ];
  }

  onSearch() { this.loadCompanies(1); }
  onPageChange(event: any) { this.pageSize = event.rows; this.loadCompanies(Math.floor(event.first / event.rows) + 1); }
  goBack() { this.location.back(); }
}
