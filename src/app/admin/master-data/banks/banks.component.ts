import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MasterDataService } from '../master-data.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-master-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss'],
})
export class BanksComponent implements OnInit {
  version = projectConstantsLocal.VERSION_DESKTOP;
  banks: any[] = [];
  totalRecords = 0;
  loading = false;
  searchText = '';
  currentPage = 1;
  pageSize = 20;

  // Dialog
  showDialog = false;
  editMode = false;
  selectedBank: any = null;
  form: any = { bankName: '', bankCode: '', status: 1 };
  saving = false;

  constructor(
    private location: Location,
    private masterDataService: MasterDataService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(page = 1) {
    this.loading = true;
    this.currentPage = page;
    this.masterDataService
      .getBanks({ page, limit: this.pageSize, search: this.searchText })
      .subscribe({
        next: (res: any) => {
          this.banks = res.banks || [];
          this.totalRecords = res.total || 0;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.toastService.showError(err?.error || 'Error loading banks');
        },
      });
  }

  onSearch() {
    this.loadBanks(1);
  }

  onPageChange(event: any) {
    const page = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadBanks(page);
  }

  openCreate() {
    this.editMode = false;
    this.form = { bankName: '', bankCode: '', status: 1 };
    this.showDialog = true;
  }

  openEdit(bank: any) {
    this.editMode = true;
    this.selectedBank = bank;
    this.form = {
      bankName: bank.bankName,
      bankCode: bank.bankCode || '',
      status: bank.status,
    };
    this.showDialog = true;
  }

  save() {
    if (!this.form.bankName?.trim()) {
      this.toastService.showError('Bank name is required');
      return;
    }
    this.saving = true;
    const obs = this.editMode
      ? this.masterDataService.updateBank(this.selectedBank.id, this.form)
      : this.masterDataService.createBank(this.form);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showDialog = false;
        this.toastService.showSuccess(
          this.editMode ? 'Bank updated' : 'Bank created',
        );
        this.loadBanks(this.currentPage);
      },
      error: (err) => {
        this.saving = false;
        this.toastService.showError(err?.error || 'Error saving bank');
      },
    });
  }

  toggleStatus(bank: any) {
    const newStatus = bank.status === 1 ? 0 : 1;
    this.masterDataService
      .updateBank(bank.id, { ...bank, status: newStatus })
      .subscribe({
        next: () => {
          this.toastService.showSuccess(
            `Bank ${newStatus === 1 ? 'enabled' : 'disabled'}`,
          );
          this.loadBanks(this.currentPage);
        },
        error: (err) =>
          this.toastService.showError(err?.error || 'Error updating status'),
      });
  }

  goBack() {
    this.location.back();
  }
}
