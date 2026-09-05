import { Injectable } from '@angular/core';
import { ServiceMeta } from 'src/app/services/service-meta';

export type BureauProvider = 'verifyal' | 'surepass';

// Provider only — report costs (accounts.*ReportCost) are managed
// elsewhere and intentionally not sent from this admin portal page.
export interface BureauProviderSettings {
  cibilProvider?: BureauProvider;
  crifProvider?: BureauProvider;
  experianProvider?: BureauProvider;
  equifaxProvider?: BureauProvider;
}

export interface BulkBureauProviderSettings extends BureauProviderSettings {
  /** true = every account in the system. Omit/false with accountIds to
   * target a specific set instead — the backend requires one or the other,
   * so a missing/empty body can never silently touch every tenant. */
  applyToAll?: boolean;
  accountIds?: number[];
}

/**
 * Talks to BACKEND/eloanspro-node's accounts/:accountId/bureau-settings and
 * accounts/bureau-settings/bulk-update endpoints (accountController.js) —
 * the per-account CIBIL/CRIF/Experian/Equifax provider (Verifyal vs
 * Surepass) that the CRM app's Fetch Report page
 * (FRONTEND/loancrm-frontend, fetch-report.component.ts) reads via
 * leadsService.getAccountById() to decide which form/endpoint to call.
 * Those same backend endpoints also accept report-cost fields
 * (cibilReportCost etc.) — this portal just never sends them, by request.
 * Super-admin only on the backend (role === 1, this portal's own login) —
 * see accountController.js's isSuperAdminRequest.
 */
@Injectable({ providedIn: 'root' })
export class BureauSettingsService {
  constructor(private serviceMeta: ServiceMeta) {}

  getSettings(accountId: number) {
    return this.serviceMeta.httpGet(`accounts/${accountId}/bureau-settings`);
  }

  updateSettings(accountId: number, payload: BureauProviderSettings) {
    return this.serviceMeta.httpPut(
      `accounts/${accountId}/bureau-settings`,
      payload,
    );
  }

  bulkUpdateSettings(payload: BulkBureauProviderSettings) {
    return this.serviceMeta.httpPut(
      'accounts/bureau-settings/bulk-update',
      payload,
    );
  }
}
