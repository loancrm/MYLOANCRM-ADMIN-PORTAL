import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { CreditReportBannerService, toLocalDateString } from './credit-report-banner.service';

/**
 * List page for the Credit Reports Announcement feature — shows what's
 * already there, same as Cibil Reports / Accounts. Creating or editing an
 * announcement navigates to its own page (credit-report-banner-form/),
 * rather than toggling a form in place here.
 */
@Component({
  selector: 'app-credit-report-banner',
  templateUrl: './credit-report-banner.component.html',
  styleUrl: './credit-report-banner.component.scss',
})
export class CreditReportBannerComponent {
  loading = false;
  banners: any[] = [];

  /** Optional — case-insensitive substring search on the heading. */
  filterTitle: string | null = null;

  constructor(
    private location: Location,
    private router: Router,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private bannerService: CreditReportBannerService,
  ) {
    this.loadBanners();
  }

  goBack(): void {
    this.location.back();
  }

  goToCreate(): void {
    this.router.navigate(['/admin/credit-report-banner/create']);
  }

  goToEdit(row: any): void {
    this.router.navigate(['/admin/credit-report-banner/edit', row.id]);
  }

  applyFilter(): void {
    this.loadBanners();
  }

  clearFilter(): void {
    this.filterTitle = null;
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.bannerService.getBanners(null, this.filterTitle).subscribe({
      next: (res: any) => {
        this.banners = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError({
          error: err.error?.message || 'Failed to load banners.',
        });
      },
    });
  }

  toggleActive(row: any): void {
    this.bannerService.updateBanner(row.id, { isActive: !row.isActive }).subscribe({
      next: () => {
        this.toastService.showSuccess(row.isActive ? 'Banner deactivated.' : 'Banner activated.');
        this.loadBanners();
      },
      error: (err) => {
        this.toastService.showError({
          error: err.error?.message || 'Failed to update banner.',
        });
      },
    });
  }

  confirmDelete(row: any): void {
    this.confirmationService.confirm({
      message: 'Delete this banner? This cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteBanner(row),
    });
  }

  private deleteBanner(row: any): void {
    this.bannerService.deleteBanner(row.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Banner deleted.');
        this.loadBanners();
      },
      error: (err) => {
        this.toastService.showError({
          error: err.error?.message || 'Failed to delete banner.',
        });
      },
    });
  }

  targetLabel(row: any): string {
    if (row.targetType === 'all') return 'All Accounts';
    if (row.targetType === 'filter') {
      const parts: string[] = [];
      if (row.filterSubscriptionStatus) parts.push(`Status: ${row.filterSubscriptionStatus}`);
      if (row.filterPlanType) parts.push(`Plan: ${row.filterPlanType}`);
      return parts.length ? `Filter — ${parts.join(', ')}` : 'Filter';
    }
    const ids: number[] = row.accountIds || [];
    const base = ids.length ? `Accounts: ${ids.join(', ')}` : 'Accounts: (none)';
    // Informational only for this targetType — what the admin was
    // narrowing the account search by when they picked the list above,
    // not a live matching rule (see normalizeBannerTarget in
    // creditReportsController.js).
    const narrowedBy: string[] = [];
    if (row.filterSubscriptionStatus) narrowedBy.push(`Status: ${row.filterSubscriptionStatus}`);
    if (row.filterPlanType) narrowedBy.push(`Plan: ${row.filterPlanType}`);
    return narrowedBy.length ? `${base} (narrowed by ${narrowedBy.join(', ')})` : base;
  }

  isCurrentlyLive(row: any): boolean {
    if (!row.isActive) return false;
    // toLocalDateString, not raw ISO-string slicing — startDate/endDate
    // arrive as UTC instants (MySQL DATE values round-tripped through the
    // driver's local-timezone interpretation), so slicing the first 10
    // characters straight off that string reads a day early. See
    // credit-report-banner.service.ts for the full explanation; this is
    // the same bug that hit the create/edit form's date fields.
    const today = toLocalDateString(new Date());
    const startDate = toLocalDateString(row.startDate);
    const endDate = toLocalDateString(row.endDate);
    if (startDate && startDate > today!) return false;
    if (endDate && endDate < today!) return false;
    return true;
  }
}
