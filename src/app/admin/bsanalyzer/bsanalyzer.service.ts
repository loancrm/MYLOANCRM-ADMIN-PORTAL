import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BsanalyzerService {

  constructor(private http: HttpClient) { }

  searchBanks(search: string) {
    return this.http.get<any[]>('api/banks?search=' + search);
  }

  extractBankDetails(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>('api/extract-bank-details', formData);
  }
}
