import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MasterDataService } from '../master-data.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-master-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  version = projectConstantsLocal.VERSION_DESKTOP;
  categories: any[] = [];
  loading = false;
  showDialog = false;
  editMode = false;
  selectedCat: any = null;
  form: any = { categoryName: '', categoryCode: '', status: 1 };
  saving = false;

  constructor(
    private location: Location,
    private masterDataService: MasterDataService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.masterDataService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError(err?.error || 'Error');
      },
    });
  }

  openCreate() {
    this.editMode = false;
    this.form = { categoryName: '', categoryCode: '', status: 1 };
    this.showDialog = true;
  }
  openEdit(cat: any) {
    this.editMode = true;
    this.selectedCat = cat;
    this.form = {
      categoryName: cat.categoryName,
      categoryCode: cat.categoryCode || '',
      status: cat.status,
    };
    this.showDialog = true;
  }

  save() {
    if (!this.form.categoryName?.trim()) {
      this.toastService.showError('Category name is required');
      return;
    }
    this.saving = true;
    const obs = this.editMode
      ? this.masterDataService.updateCategory(this.selectedCat.id, this.form)
      : this.masterDataService.createCategory(this.form);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showDialog = false;
        this.toastService.showSuccess(
          this.editMode ? 'Category updated' : 'Category created',
        );
        this.loadCategories();
      },
      error: (err) => {
        this.saving = false;
        this.toastService.showError(err?.error || 'Error saving');
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
