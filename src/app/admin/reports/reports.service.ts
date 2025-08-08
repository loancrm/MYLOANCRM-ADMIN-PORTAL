import { Injectable } from '@angular/core';
import { ServiceMeta } from 'src/app/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private serviceMeta: ServiceMeta,) { }

  getExportedLeads(filter = {}) {
    const url = 'users/export';
    return this.serviceMeta.httpGet(url, null, filter);
  }
}
