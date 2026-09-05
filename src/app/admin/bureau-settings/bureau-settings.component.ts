import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import {
  BureauProvider,
  BureauSettingsService,
} from './bureau-settings.service';

type SettingsMode = 'single' | 'all';

interface AccountOption {
  label: string;
  value: number;
}

interface BureauFieldConfig {
  /** Form control name for the provider dropdown, e.g. 'cibilProvider'. */
  providerControl: string;
  /** Checkbox control name used only in "All Accounts" mode to opt this
   * field into the bulk update — everything else stays untouched on every
   * account. */
  applyControl: string;
  label: string;
  /** Surepass has a real, working integration for this bureau today
   * (cibilController.js / creditReportsController.js's
   * fetchCrifSurepassReport). Experian/Equifax accept the setting so it can
   * be prepped ahead of time, but it has no live effect yet. */
  surepassIsLive: boolean;
}

/**
 * Super-admin page for managing what provider (Verifyal vs Surepass) each of
 * the 4 credit bureaus (CIBIL/TransUnion, CRIF, Experian, Equifax) uses per
 * account — either for one account at a time, or applied across every
 * account at once. This is the admin-portal counterpart to
 * accounts.cibilProvider / .crifProvider / .experianProvider /
 * .equifaxProvider, which the CRM app's Fetch Report page
 * (loancrm-frontend/.../fetch-report.component.ts) already reads to decide
 * which form/endpoint to use — this page is simply what was missing to
 * actually SET those columns instead of only via direct SQL. Report costs
 * (accounts.*ReportCost) are intentionally not editable here — provider
 * only, by request.
 */
@Component({
  selector: 'app-bureau-settings',
  templateUrl: './bureau-settings.component.html',
  styleUrl: './bureau-settings.component.scss',
})
export class BureauSettingsComponent implements OnInit, OnDestroy {
  mode: SettingsMode = 'single';

  providerOptions: { label: string; value: BureauProvider }[] = [
    { label: 'Verifyal', value: 'verifyal' },
    { label: 'Surepass', value: 'surepass' },
  ];

  bureaus: BureauFieldConfig[] = [
    {
      providerControl: 'cibilProvider',
      applyControl: 'applyCibil',
      label: 'CIBIL (TransUnion)',
      surepassIsLive: true,
    },
    {
      providerControl: 'crifProvider',
      applyControl: 'applyCrif',
      label: 'CRIF High Mark',
      surepassIsLive: true,
    },
    {
      providerControl: 'experianProvider',
      applyControl: 'applyExperian',
      label: 'Experian',
      surepassIsLive: false,
    },
    {
      providerControl: 'equifaxProvider',
      applyControl: 'applyEquifax',
      label: 'Equifax',
      surepassIsLive: false,
    },
  ];

  form: FormGroup;

  selectedAccountId: number | null = null;
  accountOptions: AccountOption[] = [];
  accountSearchLoading = false;
  private accountSearch$ = new Subject<string>();
  private accountSearchSub?: Subscription;

  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private bureauSettingsService: BureauSettingsService,
    private leadsService: LeadsService,
  ) {
    this.form = this.fb.group({
      cibilProvider: ['verifyal'],
      crifProvider: ['verifyal'],
      experianProvider: ['verifyal'],
      equifaxProvider: ['verifyal'],
      applyCibil: [false],
      applyCrif: [false],
      applyExperian: [false],
      applyEquifax: [false],
    });
  }

  ngOnInit(): void {
    this.accountSearchSub = this.accountSearch$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.searchAccounts(term));
    this.searchAccounts('');

    // Deep link from Account Profile's "Manage Bureau Providers" link
    // (?accountId=123) — land straight on that account's settings instead
    // of an empty picker.
    const accountIdParam = this.route.snapshot.queryParamMap.get('accountId');
    const accountId = accountIdParam ? Number(accountIdParam) : null;
    if (accountId) {
      this.preselectAccount(accountId);
    }
  }

  /** Seeds accountOptions with just this one account (so the dropdown shows
   * its label immediately) and loads its current settings — used only for
   * the ?accountId= deep link above. */
  private preselectAccount(accountId: number): void {
    this.leadsService.getAccountById(accountId).subscribe({
      next: (row: any) => {
        if (row?.accountId != null) {
          this.accountOptions = [
            {
              value: Number(row.accountId),
              label: `${row.businessName || 'Unnamed'} (${row.accountId})`,
            },
            ...this.accountOptions.filter(
              (o) => o.value !== Number(row.accountId),
            ),
          ];
        }
        this.onAccountSelect(accountId);
      },
      error: () => this.onAccountSelect(accountId),
    });
  }

  ngOnDestroy(): void {
    this.accountSearchSub?.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  setMode(mode: SettingsMode): void {
    if (this.mode === mode) return;
    this.mode = mode;
    if (mode === 'all') {
      // Nothing "current" to show for every account at once — reset to
      // defaults and require the admin to explicitly opt each field in via
      // its checkbox before anything is sent.
      this.form.patchValue({
        cibilProvider: 'verifyal',
        crifProvider: 'verifyal',
        experianProvider: 'verifyal',
        equifaxProvider: 'verifyal',
        applyCibil: false,
        applyCrif: false,
        applyExperian: false,
        applyEquifax: false,
      });
    } else {
      this.selectedAccountId = null;
    }
  }

  onAccountFilter(event: { filter: string }): void {
    this.accountSearch$.next(event.filter || '');
  }

  private searchAccounts(term: string): void {
    this.accountSearchLoading = true;
    const trimmed = term.trim();
    const filter: any = { count: 25, sort: 'businessName,asc' };
    if (trimmed) {
      filter[/^\d+$/.test(trimmed) ? 'accountId-like' : 'businessName-like'] =
        trimmed;
    }
    this.leadsService.getAccounts(filter).subscribe({
      next: (rows: any) => {
        this.accountSearchLoading = false;
        const list = Array.isArray(rows) ? rows : [];
        this.accountOptions = list
          .filter((r: any) => r.accountId != null)
          .map((r: any) => ({
            value: Number(r.accountId),
            label: `${r.businessName || 'Unnamed'} (${r.accountId})`,
          }));
      },
      error: (err) => {
        this.accountSearchLoading = false;
        console.error('bureau-settings: account search failed', err);
      },
    });
  }

  onAccountSelect(accountId: number | null): void {
    this.selectedAccountId = accountId;
    if (accountId == null) return;
    this.loading = true;
    this.bureauSettingsService.getSettings(accountId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.form.patchValue({
          cibilProvider: res?.cibilProvider || 'verifyal',
          crifProvider: res?.crifProvider || 'verifyal',
          experianProvider: res?.experianProvider || 'verifyal',
          equifaxProvider: res?.equifaxProvider || 'verifyal',
        });
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError({
          error:
            err.error?.message ||
            "Failed to load this account's bureau settings.",
        });
      },
    });
  }

  save(): void {
    if (this.mode === 'single') {
      this.saveSingle();
    } else {
      this.confirmAndSaveAll();
    }
  }

  private saveSingle(): void {
    if (!this.selectedAccountId) {
      this.toastService.showError({ error: 'Pick an account first.' });
      return;
    }
    const raw = this.form.value;
    const payload = {
      cibilProvider: raw.cibilProvider,
      crifProvider: raw.crifProvider,
      experianProvider: raw.experianProvider,
      equifaxProvider: raw.equifaxProvider,
    };
    this.saving = true;
    this.bureauSettingsService
      .updateSettings(this.selectedAccountId, payload)
      .subscribe({
        next: () => {
          this.saving = false;
          this.toastService.showSuccess(
            'Bureau settings updated for this account.',
          );
        },
        error: (err) => {
          this.saving = false;
          this.toastService.showError({
            error: err.error?.message || 'Failed to update bureau settings.',
          });
        },
      });
  }

  /** Only fields whose "Apply to all accounts" checkbox is on are sent —
   * everything else is left exactly as-is on every account. */
  private buildBulkPayload(): Record<string, any> {
    const raw = this.form.value;
    const payload: Record<string, any> = {};
    if (raw.applyCibil) payload['cibilProvider'] = raw.cibilProvider;
    if (raw.applyCrif) payload['crifProvider'] = raw.crifProvider;
    if (raw.applyExperian) payload['experianProvider'] = raw.experianProvider;
    if (raw.applyEquifax) payload['equifaxProvider'] = raw.equifaxProvider;
    return payload;
  }

  get hasAnyFieldSelectedForBulk(): boolean {
    const raw = this.form.value;
    return !!(
      raw.applyCibil ||
      raw.applyCrif ||
      raw.applyExperian ||
      raw.applyEquifax
    );
  }

  private confirmAndSaveAll(): void {
    if (!this.hasAnyFieldSelectedForBulk) {
      this.toastService.showError({
        error:
          'Tick "Apply to all accounts" next to at least one bureau before saving.',
      });
      return;
    }
    this.confirmationService.confirm({
      message:
        'This will overwrite the ticked bureau(s) provider on EVERY account in the system. This cannot be undone. Continue?',
      header: 'Apply to All Accounts',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Apply to All',
      rejectLabel: 'Cancel',
      accept: () => this.saveAll(),
    });
  }

  private saveAll(): void {
    const payload = this.buildBulkPayload();
    this.saving = true;
    this.bureauSettingsService
      .bulkUpdateSettings({ ...payload, applyToAll: true })
      .subscribe({
        next: (res: any) => {
          this.saving = false;
          this.toastService.showSuccess(
            res?.message || 'Bureau settings applied to all accounts.',
          );
        },
        error: (err) => {
          this.saving = false;
          this.toastService.showError({
            error:
              err.error?.message ||
              'Failed to apply bureau settings to all accounts.',
          });
        },
      });
  }
}
