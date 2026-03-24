import { Injectable } from '@angular/core';
import { ServiceMeta } from './service-meta';

@Injectable({ providedIn: 'root' })
export class CampaignService {

  constructor(private serviceMeta: ServiceMeta) {}

  getContacts(): any {
    const url = 'campaign/contacts';
    return this.serviceMeta.httpGet(url);
  }

  getTemplates(): any {
    const url = 'campaign/templates';
    return this.serviceMeta.httpGet(url);
  }

  sendCampaign(payload: any): any {
    const url = 'campaign/send';
    return this.serviceMeta.httpPost(url, payload);
  }

  getLogs(filter = {}): any {
    const url = 'campaign/logs';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getLastInteraction(mobileNumber: string): any {
    const url = 'campaign/last-interaction';
    return this.serviceMeta.httpGet(url, null, { mobileNumber });
  }
}