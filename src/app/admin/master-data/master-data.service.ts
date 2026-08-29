import { Injectable } from '@angular/core';
import { ServiceMeta } from '../../services/service-meta';
import { HttpClient } from '@angular/common/http';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  private base = 'admin/master';

  constructor(
    private serviceMeta: ServiceMeta,
    private http: HttpClient,
  ) {}

  // ── Banks ───────────────────────────────────────────────────────────────
  getBanks(params: any = {}) {
    return this.serviceMeta.httpGet(`${this.base}/banks`, null, params);
  }
  getBankById(id: number) {
    return this.serviceMeta.httpGet(`${this.base}/banks/${id}`);
  }
  createBank(data: any) {
    return this.serviceMeta.httpPost(`${this.base}/banks`, data);
  }
  updateBank(id: number, data: any) {
    return this.serviceMeta.httpPut(`${this.base}/banks/${id}`, data);
  }

  // ── Locations ───────────────────────────────────────────────────────────
  getLocations(params: any = {}) {
    return this.serviceMeta.httpGet(`${this.base}/locations`, null, params);
  }
  createLocation(data: any) {
    return this.serviceMeta.httpPost(`${this.base}/locations`, data);
  }
  updateLocation(id: number, data: any) {
    return this.serviceMeta.httpPut(`${this.base}/locations/${id}`, data);
  }

  // Returns only locations that have actual company data for the given master bank
  getLocationsByBank(bankId: number) {
    return this.serviceMeta.httpGet(`${this.base}/banks/${bankId}/locations`);
  }

  // Returns only categories that have actual company data for the given master bank
  getCategoriesByBank(bankId: number) {
    return this.serviceMeta.httpGet(`${this.base}/banks/${bankId}/categories`);
  }

  // ── Categories ──────────────────────────────────────────────────────────
  getCategories(params: any = {}) {
    return this.serviceMeta.httpGet(`${this.base}/categories`, null, params);
  }
  createCategory(data: any) {
    return this.serviceMeta.httpPost(`${this.base}/categories`, data);
  }
  updateCategory(id: number, data: any) {
    return this.serviceMeta.httpPut(`${this.base}/categories/${id}`, data);
  }

  // ── Companies ───────────────────────────────────────────────────────────
  getCompanies(params: any) {
    return this.serviceMeta.httpGet(`${this.base}/companies`, null, params);
  }

  // ── Template ────────────────────────────────────────────────────────────
  downloadTemplate() {
    // Use HttpClient so the auth interceptor attaches the token; receive as blob
    const url = `${projectConstantsLocal.BASE_URL}${this.base}/template`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'MasterData_Template.xlsx';
        a.click();
        URL.revokeObjectURL(a.href);
      },
      error: () => {},
    });
  }

  // ── Uploads ─────────────────────────────────────────────────────────────
  uploadExcel(formData: FormData) {
    return this.http.post(
      `${projectConstantsLocal.BASE_URL}${this.base}/uploads`,
      formData,
    );
  }
  getUploadHistory(params: any = {}) {
    return this.serviceMeta.httpGet(`${this.base}/uploads`, null, params);
  }
  getUploadById(id: number) {
    return this.serviceMeta.httpGet(`${this.base}/uploads/${id}`);
  }
  downloadErrorReport(id: number) {
    const url = `${projectConstantsLocal.BASE_URL}${this.base}/uploads/${id}/errors`;
    window.open(url, '_blank');
  }
  downloadUploadedFile(id: number) {
    const url = `${projectConstantsLocal.BASE_URL}${this.base}/uploads/${id}/file`;
    window.open(url, '_blank');
  }

  // ── Lender mapping ──────────────────────────────────────────────────────
  suggestMasterBank(name: string) {
    return this.serviceMeta.httpGet(`${this.base}/suggest-bank`, null, {
      name,
    });
  }
  getLenderMapping(lenderId: number) {
    return this.serviceMeta.httpGet(`${this.base}/lender/${lenderId}/mapping`);
  }
  mapLender(lenderId: number, masterBankId: number | null) {
    return this.serviceMeta.httpPost(`${this.base}/lender/${lenderId}/map`, {
      masterBankId,
    });
  }

  // ── Eligibility ─────────────────────────────────────────────────────────
  checkEligibility(data: {
    companyName: string;
    location: string;
    lenderIds: number[];
  }) {
    return this.serviceMeta.httpPost(`${this.base}/eligibility-check`, data);
  }
}
