import { Injectable } from '@angular/core';
import { ServiceMeta } from '../services/service-meta';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private serviceMeta: ServiceMeta) {}
}
