import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import {
  CreditReportBannerService,
  BannerTargetType,
  SubscriptionStatus,
  PlanType,
  toLocalDateString,
} from '../credit-report-banner.service';

interface AccountOption {
  label: string;
  value: number;
}

/**
 * Create/edit page for a Credit Reports Announcement — its own route
 * (create, or edit/:id), not a toggled panel on the list page.
 *
 * Targeting is two-way: "All Accounts", or "Specific Account(s)" — the
 * latter has an optional subscription Status/Plan filter built in, used
 * purely to narrow which accounts show up in the search below (e.g. pick
 * Status=Expired to search only among expired accounts). The saved target
 * is always the concrete account list the admin actually picked — there's
 * no separate "dynamic, evaluated live" filter mode in this form anymore
 * (that combined confusingly with picking specific accounts). The backend
 * still fully supports targetType 'filter' for any pre-existing banners of
 * that kind (see creditReportsController.js / the list page's
 * targetLabel()) — this form just no longer creates new ones that way.
 */
@Component({
  selector: 'app-credit-report-banner-form',
  templateUrl: './credit-report-banner-form.component.html',
  styleUrl: './credit-report-banner-form.component.scss',
})
export class CreditReportBannerFormComponent implements OnInit, OnDestroy {
  loading = false;
  saving = false;
  editingId: number | null = null;

  targetOptions: { label: string; value: BannerTargetType }[] = [
    { label: 'All Accounts', value: 'all' },
    { label: 'Specific Account(s)', value: 'accounts' },
  ];

  // Matches accounts.component.ts's own statusOptions/planTypeOptions
  // exactly (minus their 'All' entry) — the values this admin portal
  // actually filters accounts by, confirmed against live subscriptions
  // data rather than assumed from an ENUM column. See
  // credit-report-banner.service.ts for the full rationale. Used here only
  // to narrow the account search below, not sent to the backend as a
  // targeting criterion.
  subscriptionStatusOptions: { label: string; value: SubscriptionStatus | null }[] = [
    { label: 'Any Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
  ];

  planTypeOptions: { label: string; value: PlanType | null }[] = [
    { label: 'Any Plan', value: null },
    { label: 'Free Trial', value: 'Free Trial' },
    { label: 'Basic', value: 'Basic' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Professional', value: 'Professional' },
  ];

  /** Populated from live searches (and, when editing, from the banner's
   * own already-targeted accounts) — never the full accounts table at
   * once. Each new search/filter REPLACES the browsable portion of this
   * list (see replaceAccountSearchResults) so a broader earlier search
   * doesn't linger once a narrower filter is applied; whatever is
   * currently selected is always preserved regardless. */
  accountOptions: AccountOption[] = [];
  accountSearchLoading = false;
  private accountSearch$ = new Subject<string>();
  private accountSearchSub?: Subscription;
  /** Re-applied whenever the Status/Plan narrowing dropdowns change, so
   * the visible search results stay in sync without the admin needing to
   * retype their last search term. */
  private lastAccountSearchTerm = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private bannerService: CreditReportBannerService,
    private leadsService: LeadsService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.maxLength(150)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      targetType: ['all' as BannerTargetType, [Validators.required]],
      accountIds: [[] as number[]],
      filterSubscriptionStatus: [null as SubscriptionStatus | null],
      filterPlanType: [null as PlanType | null],
      startDate: [null as Date | null],
      endDate: [null as Date | null],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.accountSearchSub = this.accountSearch$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.searchAccounts(term));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editingId = Number(idParam);
      this.loadBanner(this.editingId);
    } else {
      // Nothing to preload for a brand-new announcement, but give the
      // account picker a starting set of options to browse before typing.
      this.searchAccounts('');
    }
  }

  ngOnDestroy(): void {
    this.accountSearchSub?.unsubscribe();
  }

  get isTargetingAccounts(): boolean {
    return this.form.get('targetType')?.value === 'accounts';
  }

  goBack(): void {
    this.location.back();
  }

  private loadBanner(id: number): void {
    this.loading = true;
    this.bannerService.getBannerById(id).subscribe({
      next: (row: any) => {
        // p-multiSelect resolves each selected value's label against
        // [options] at the moment its formControl value is written — if
        // accountIds is set before accountOptions actually contains those
        // ids, the selection can render blank even once options arrive
        // later. Populate the option labels for this banner's own
        // accountIds FIRST (an already-scoped, tiny lookup — see
        // fetchAccountsByIds), then only set the form value once that
        // settles, whether it found labels or not.
        const applyFormValue = () => {
          this.loading = false;
          this.form.setValue({
            title: row.title || '',
            message: row.message || '',
            // A legacy 'filter'-type banner (dynamic, no fixed account
            // list) has no equivalent selectable option anymore — land on
            // "Specific Account(s)" with its old status/plan values kept
            // as a search head start, so the admin just needs to pick
            // accounts to finish converting it.
            targetType: row.targetType === 'all' ? 'all' : 'accounts',
            accountIds: row.accountIds || [],
            filterSubscriptionStatus: row.filterSubscriptionStatus || null,
            filterPlanType: row.filterPlanType || null,
            startDate: row.startDate ? new Date(row.startDate) : null,
            endDate: row.endDate ? new Date(row.endDate) : null,
            isActive: !!row.isActive,
          });
          // Broaden the option list for further searching once the
          // pre-selected ones are already showing correctly.
          if (this.isTargetingAccounts) {
            this.searchAccounts('');
          }
        };

        if (row.accountIds?.length) {
          this.fetchAccountsByIds(row.accountIds, applyFormValue);
        } else {
          applyFormValue();
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError({
          error: err.error?.message || 'Failed to load announcement.',
        });
        this.goBack();
      },
    });
  }

  private toAccountOptions(rows: any[]): AccountOption[] {
    return rows
      .filter((r) => r.accountId != null)
      .map((r) => ({
        value: Number(r.accountId),
        label: `${r.businessName || 'Unnamed'} (${r.accountId})`,
      }));
  }

  /** Additive — used only for seeding labels of accounts we already know
   * are targeted (fetchAccountsByIds on edit-load). Never drops anything,
   * since those ids must stay selectable regardless of what gets searched
   * for afterwards. */
  private mergeAccountOptions(rows: any[]): void {
    const existingIds = new Set(this.accountOptions.map((o) => o.value));
    const additions = this.toAccountOptions(rows).filter((o) => !existingIds.has(o.value));
    this.accountOptions = [...this.accountOptions, ...additions];
  }

  /** Replaces the browsable option list with a fresh search/filter result
   * — unlike mergeAccountOptions, stale entries from a previous, broader
   * search do NOT linger (that was the bug: picking a Status/Plan filter
   * only ever added the narrower matches on top of the original unfiltered
   * 25, so "all accounts" kept showing regardless of the filter). The
   * form's currently-selected accountIds are preserved even if this
   * particular result set doesn't include them, so existing chips never
   * disappear out from under the admin mid-edit. */
  private replaceAccountSearchResults(rows: any[]): void {
    const selectedIds: number[] = this.form.get('accountIds')?.value || [];
    const preserved = this.accountOptions.filter((o) => selectedIds.includes(o.value));
    const preservedIds = new Set(preserved.map((o) => o.value));
    const fresh = this.toAccountOptions(rows).filter((o) => !preservedIds.has(o.value));
    this.accountOptions = [...preserved, ...fresh];
  }

  /** onDone always fires, success or failure — the caller (loadBanner)
   * still needs to apply the form value even if this lookup fails, or the
   * edit page would just hang on its loading spinner. */
  private fetchAccountsByIds(ids: number[], onDone: () => void): void {
    this.leadsService.getAccounts({ 'accountId-in': ids.join(',') }).subscribe({
      next: (rows: any) => {
        this.mergeAccountOptions(Array.isArray(rows) ? rows : []);
        onDone();
      },
      error: (err) => {
        console.error('credit-report-banner-form: failed to load targeted accounts', err);
        onDone();
      },
    });
  }

  /** Wired to p-multiSelect's (onFilter) — server-side search-as-you-type
   * instead of PrimeNG's default client-side filtering over whatever's
   * already loaded, since the full accounts list is never loaded at once. */
  onAccountFilter(event: { filter: string }): void {
    this.accountSearch$.next(event.filter || '');
  }

  /** Status/Plan dropdowns changed — re-run the last search under the new
   * narrowing so the multiselect's results reflect it immediately, rather
   * than only taking effect the next time the admin types. */
  onSubscriptionFilterChange(): void {
    this.searchAccounts(this.lastAccountSearchTerm);
  }

  private searchAccounts(term: string): void {
    this.lastAccountSearchTerm = term;
    this.accountSearchLoading = true;
    const trimmed = term.trim();
    const filter: any = { count: 25, sort: 'businessName,asc' };
    if (trimmed) {
      if (/^\d+$/.test(trimmed)) {
        filter['accountId-like'] = trimmed;
      } else {
        filter['businessName-like'] = trimmed;
      }
    }
    const status = this.form.get('filterSubscriptionStatus')?.value;
    const plan = this.form.get('filterPlanType')?.value;
    if (status) filter['latest_status-eq'] = status;
    if (plan) filter['latest_plan_name-eq'] = plan;

    this.leadsService.getAccounts(filter).subscribe({
      next: (rows: any) => {
        this.accountSearchLoading = false;
        this.replaceAccountSearchResults(Array.isArray(rows) ? rows : []);
      },
      error: (err) => {
        this.accountSearchLoading = false;
        console.error('credit-report-banner-form: account search failed', err);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.showError({ error: 'Please fill in the required fields.' });
      return;
    }

    const raw = this.form.value;
    const targetType: BannerTargetType = raw.targetType;
    const accountIds: number[] = raw.accountIds || [];

    if (targetType === 'accounts' && accountIds.length === 0) {
      this.toastService.showError({
        error: 'Pick at least one account, or switch to "All Accounts".',
      });
      return;
    }

    // filterSubscriptionStatus/filterPlanType narrow the account search
    // above, but they're not just throwaway UI state — when targeting
    // specific accounts, whatever was selected there is saved alongside
    // the accountIds too (informational: "these accounts were picked
    // while narrowed to Status=Expired, Plan=Basic"), so reopening this
    // banner for edit shows the same narrowing again. The backend never
    // uses these for live matching on an 'accounts' banner — that's
    // accountIds alone; only a 'filter'-type banner (not creatable from
    // this form) reads them as matching criteria.
    const payload = {
      title: raw.title?.trim() || null,
      message: raw.message,
      targetType,
      accountIds: targetType === 'accounts' ? accountIds : undefined,
      filterSubscriptionStatus: targetType === 'accounts' ? raw.filterSubscriptionStatus : undefined,
      filterPlanType: targetType === 'accounts' ? raw.filterPlanType : undefined,
      startDate: toLocalDateString(raw.startDate),
      endDate: toLocalDateString(raw.endDate),
      isActive: !!raw.isActive,
    };

    this.saving = true;

    const done = (successMessage: string) => {
      this.saving = false;
      this.toastService.showSuccess(successMessage);
      this.router.navigate(['/admin/credit-report-banner']);
    };
    const fail = (err: any, fallback: string) => {
      this.saving = false;
      this.toastService.showError({ error: err.error?.message || fallback });
    };

    if (this.editingId) {
      this.bannerService.updateBanner(this.editingId, payload).subscribe({
        next: () => done('Announcement updated successfully.'),
        error: (err) => fail(err, 'Failed to update announcement.'),
      });
    } else {
      this.bannerService.createBanner(payload as any).subscribe({
        next: () => done('Announcement created successfully.'),
        error: (err) => fail(err, 'Failed to create announcement.'),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/credit-report-banner']);
  }
}
