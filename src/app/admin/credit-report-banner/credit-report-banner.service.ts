import { Injectable } from '@angular/core';
import { ServiceMeta } from 'src/app/services/service-meta';

/**
 * Formats a Date (or parses a date/ISO string) into a "YYYY-MM-DD" string
 * in India Standard Time — explicitly, via Intl's `timeZone` option, not
 * via `.getFullYear()/.getMonth()/.getDate()` (which read whatever
 * timezone the executing runtime itself happens to be set to) and never
 * via `.toISOString()` (which converts to UTC first).
 *
 * Why explicit IST rather than "local": the backend server runs in UTC,
 * and this feature's dates are meant as Indian business days regardless
 * of what timezone the server — or, in principle, a given admin's own
 * machine — is configured with. Relying on "whatever timezone this code
 * happens to execute in" would only work by coincidence; forcing
 * Asia/Kolkata makes it correct unconditionally. (India has no DST, so
 * this offset is always a flat +5:30 — no seasonal edge cases to worry
 * about here.)
 *
 * This fixes two symptoms of the same underlying issue: (1) saving a
 * p-calendar selection with `.toISOString().slice(0, 10)` rolled it back
 * a day before it ever reached the backend ("selected 25–26, saved as
 * 24–25"), and (2) startDate/endDate read back from the backend are UTC
 * ISO strings (MySQL DATE values round-tripped through the driver), so
 * naively slicing their first 10 characters read a day early too.
 */
export function toLocalDateString(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return null;
  // en-CA formats as YYYY-MM-DD directly (ISO field order).
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);
}

export type BannerTargetType = 'all' | 'accounts' | 'filter';

// These match subscriptions.status / subscriptions.plan_name exactly as
// used elsewhere in this admin portal (accounts.component.ts's
// statusOptions/planTypeOptions, accountController.js's latest_status /
// latest_plan_name filters) — confirmed against the live data rather than
// assumed from the subscriptions table's plan_type/status ENUM columns,
// which use different values ('Free'/'Enterprise' vs the real 'Free
// Trial'/'Professional' plan names actually stored).
export type SubscriptionStatus = 'Active' | 'Expired';
export type PlanType = 'Free Trial' | 'Basic' | 'Premium' | 'Professional';

export interface CreditReportBannerPayload {
  title?: string | null;
  message: string;
  targetType: BannerTargetType;
  /** Required when targetType is 'accounts' — one, two, or any number of
   * account IDs. Ignored (backend clears it) for the other target types. */
  accountIds?: number[];
  /** Only used when targetType is 'filter' — evaluated against each
   * account's CURRENT subscription at display time, not a frozen list.
   * At least one of the two must be set when targetType is 'filter'. */
  filterSubscriptionStatus?: SubscriptionStatus | null;
  filterPlanType?: PlanType | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
}

/**
 * Talks to the same tenant-side backend endpoints used by the Credit
 * Reports page in the CRM app (BACKEND/eloanspro-node/controllers/
 * creditReportsController.js — /credit-reports/banner...). No backend
 * change was needed to support this admin portal: those endpoints already
 * take accountId from the query/body rather than assuming the caller's own
 * JWT carries one, which is exactly what a cross-account admin tool needs.
 * Route-mounted with validateToken only, no subscription check — see
 * creditReportsRoutes.js.
 */
@Injectable({ providedIn: 'root' })
export class CreditReportBannerService {
  constructor(private serviceMeta: ServiceMeta) {}

  /** Omit accountId/title to see every banner regardless of target (full
   * audit list); accountId narrows to banners that would show for that
   * account (all-accounts, accounts-ones that include it, and filter-ones
   * its current subscription matches); title is a case-insensitive
   * substring search on the heading. Both are combinable (ANDed). */
  getBanners(accountId?: number | null, title?: string | null) {
    const params: any = {};
    if (accountId) params.accountId = accountId;
    if (title) params.title = title;
    return this.serviceMeta.httpGet('credit-reports/banner', null, params);
  }

  /** For the create/edit page loading directly off the :id route param —
   * works on refresh/direct link, unlike passing the row via router state. */
  getBannerById(id: number) {
    return this.serviceMeta.httpGet(`credit-reports/banner/${id}`);
  }

  createBanner(payload: CreditReportBannerPayload) {
    return this.serviceMeta.httpPost('credit-reports/banner', payload);
  }

  updateBanner(id: number, payload: Partial<CreditReportBannerPayload>) {
    return this.serviceMeta.httpPut(`credit-reports/banner/${id}`, payload);
  }

  deleteBanner(id: number) {
    return this.serviceMeta.httpDelete(`credit-reports/banner/${id}`);
  }
}
