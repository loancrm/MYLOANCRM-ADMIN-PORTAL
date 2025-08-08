import { Injectable } from '@angular/core';
import { ServiceMeta } from '../services/service-meta';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private serviceMeta: ServiceMeta) {}

  getEvents() {
    const url = 'events';
    return this.serviceMeta.httpGet(url);
  }

  getFaculty() {
    const url = 'faculty';
    return this.serviceMeta.httpGet(url);
  }

  createFaculty(data) {
    const url = 'faculty';
    return this.serviceMeta.httpPost(url, data);
  }

  updateFaculty(data, id, headers?) {
    const url = 'faculty/' + id;
    return this.serviceMeta.httpPut(url, data, headers);
  }

  deleteFaculty(id) {
    const url = 'faculty/' + id;
    return this.serviceMeta.httpDelete(url, null);
  }

  retrieveImageFromDatabase(imageData) {
    const binaryData = imageData;
    const blob = new Blob([binaryData], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }
}
