import { Injectable } from '@angular/core';
import { DateTimeProcessorService } from '../../services/date-time-processor.service';
import { ServiceMeta } from '../../services/service-meta';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  moment: any;
  status: any;
  private sidebarVisible = new BehaviorSubject<boolean>(true);
  sidebarVisible$ = this.sidebarVisible.asObservable();

  // private socket: Socket;
  private readonly IP_CACHE_DURATION = 5 * 60 * 1000;
  constructor(
    private dateTimeProcessor: DateTimeProcessorService,
    private serviceMeta: ServiceMeta,
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }

  // getClientIp(): Promise<string> {
  //   return axios.get('https://api.ipify.org?format=json')
  //     .then(response => response.data.ip)
  //     .catch(error => {
  //       console.error('Error fetching IP address:', error);
  //       return '';
  //     });
  // }



  toggleSidebar() {
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }

  setSidebarVisibility(visible: boolean) {
    this.sidebarVisible.next(visible);
  }

  getSidebarVisibility(): boolean {
    return this.sidebarVisible.getValue();
  }
  async getClientIp(): Promise<string> {
    // console.log('Fetching client IP...');
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return '';
    }
  }

  async fetchAndStoreClientIp(): Promise<void> {
    const lastFetchedTime = parseInt(
      this.localStorageService.getItemFromLocalStorage('clientIpTime') || '0',
      10
    );
    const currentTime = Date.now();

    if (
      !lastFetchedTime ||
      currentTime - lastFetchedTime > this.IP_CACHE_DURATION
    ) {
      const newIp = await this.getClientIp();
      if (newIp) {
        const storedIp =
          this.localStorageService.getItemFromLocalStorage('clientIp');
        if (storedIp !== newIp) {
          this.localStorageService.setItemOnLocalStorage('clientIp', newIp);
          this.localStorageService.setItemOnLocalStorage(
            'clientIpTime',
            currentTime.toString()
          );
          // console.log('Client IP updated:', newIp);
        }
      }
    }
  }
  startIpUpdateInterval(): void {
    this.fetchAndStoreClientIp(); // Fetch immediately on app load
    setInterval(() => {
      this.fetchAndStoreClientIp();
    }, this.IP_CACHE_DURATION);
  }
  // connect(userId: string, userType: any) {
  //   this.socket = io(projectConstantsLocal.BASE_URL, { query: { userId, userType } });
  // }
  // connect(userId: number, userType: number) {
  //   this.socket = io(projectConstantsLocal.BASE_URL, {
  //     query: { userId, userType },
  //     reconnection: true,
  //     reconnectionAttempts: 5,
  //     reconnectionDelay: 1000
  //   });
  //   this.socket.on('connect', () => {
  //     console.log('✅ Connected to socket server');
  //   });
  //   this.socket.on('disconnect', () => {
  //     console.log('❌ Disconnected from socket server');
  //   });
  // }

  // onDocumentAdded(callback: (data: any) => void) {
  //   this.socket.on('documentAdded', callback);
  // }

  maskPhoneNumber(phoneNumber: any): string {
    if (!phoneNumber) {
      return '';
    }
    const phoneStr = String(phoneNumber); // Ensure it's a string
    if (phoneStr.length < 4) {
      return phoneStr;
    }
    return phoneStr.replace(/^(\d{6})(\d{4})$/, '******$2');
  }
  checkPhoneNumberExists(phone: string) {
    return this.http.get<{ exists: boolean }>(`/api/leads/check-phone?phone=${phone}`);
  }
  createLead(data) {
    const url = 'leads';
    return this.serviceMeta.httpPost(url, data);
  }
  sendOtp(data: { mobile: string }) {
    const url = 'otp/send-otp';
    return this.serviceMeta.httpPost(url, data);
  }

  verifyOtp(data: { mobile: string; otp: string }) {
    const url = 'otp/verify-otp';
    return this.serviceMeta.httpPost(url, data);
  }

  createAccount(data) {
    // console.log(data)
    const url = 'accounts';
    return this.serviceMeta.httpPost(url, data);
  }
  getAccountById(accountId, filter = {}) {
    const url = 'accounts/' + accountId;
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getAccountsCount(filter = {}) {
    const url = 'accounts/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getContactsCount(filter = {}) {
    const url = 'contactus/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getSubscibersCount(filter = {}) {
    const url = 'contactus/subsciberstotal';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getPlansCount(filter = {}) {
    const url = 'subscriptionPlans/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getloanLeads(filter = {}) {
    const url = 'loanleads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  searchLeads(filter = {}) {
    const url = 'leads/search';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getIpAddress(filter = {}) {
    const url = 'ipAddress';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteIpAddress(ipAddressId, filter = {}) {
    const url = 'ipAddress/' + ipAddressId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }


  getAccounts(filter = {}) {
    const url = 'accounts';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getContacts(filter = {}) {
    const url = 'contactus';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getsubscribers(filter = {}) {
    const url = 'contactus/subscribe';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getReports(filter = {}) {
    const url = 'reports/reportsdata';
    return this.serviceMeta.httpGet(url, null, filter);
  }


  getPlanById(leadId, filter = {}) {
    const url = 'subscriptionPlans/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }




  getReportsCount(filter = {}) {
    const url = 'reports/reportsCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  createPlan(data) {
    const url = 'subscriptionPlans';
    return this.serviceMeta.httpPost(url, data);
  }
  updatePlan(bankersId, data) {
    const url = 'subscriptionPlans/' + bankersId;
    return this.serviceMeta.httpPut(url, data);
  }

  getSubscriptionPlans(filter = {}) {
    const url = 'subscriptionPlans/plans';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //bankers documents
  // uploadFiles(data: FormData, type = "default") {
  //   const url = "files/upload?type=" + type;
  //   return this.serviceMeta.httpPost(url, data);
  // }
  // uploadFiles(data: FormData, leadId, type = "default") {
  //   const url = `files/upload?type=${type}&leadId=${leadId}`;
  //   return this.serviceMeta.httpPost(url, data);
  // }
  uploadFiles(data: FormData, leadId, type = 'default', accountId: string,) {
    // console.log(FormData);
    // console.log(data);
    // const url = `http://localhost/files?type=${type}&leadId=${leadId}&accountId=${accountId}`
    const url = `https://files.loancrm.org/files?type=${type}&leadId=${leadId}&accountId=${accountId}`;
    return this.serviceMeta.httpPost(url, data);
  }
  // downloadZip(leadId: string, accountId: string) {
  //   const url = `https://files.loancrm.org/files?accountId=${accountId}&leadId=${leadId}&downloadZip=true`;
  //   return this.serviceMeta.httpGet(url, { responseType: 'blob' });
  // }
  downloadZip(leadId: string, accountId: string) {
    const url = `hrttps://files.loancrm.org/files?accountId=${accountId}&leadId=${leadId}&downloadZip=true`;
    // const url = `hrttps://files.myloancrm.com/files?accountId=${accountId}&leadId=${leadId}&downloadZip=true`;
    return this.http.get(url, { responseType: 'blob' }); // bypassing ServiceMeta
  }
  deleteFile(filePath: string) {
    // console.log(filePath);
    // const url = `https://files.thefintalk.in/files?file_path=${encodeURIComponent(
    //   filePath
    // )}`;
    const url = `https://files.loancrm.org/files?file_path=${encodeURIComponent(
      filePath
    )}`;
    // console.log(url);
    return this.serviceMeta.httpDelete(url);
  }

  getFileIcon(fileType: string): string {
    const fileTypeLowerCase = fileType.toLowerCase();
    const iconMap: { [key: string]: string } = {
      jpg: 'fa fa-file-image',
      jpeg: 'fa fa-file-image',
      png: 'fa fa-file-image',
      gif: 'fa fa-file-image',
      bmp: 'fa fa-file-image',
      svg: 'fa fa-file-image',
      pdf: 'fa fa-file-pdf',
      doc: 'fa fa-file-word',
      docx: 'fa fa-file-word',
      xls: 'fa fa-file-excel',
      xlsx: 'fa fa-file-excel',
      ppt: 'fa fa-file-powerpoint',
      pptx: 'fa fa-file-powerpoint',
      odt: 'fa fa-file-alt',
      ods: 'fa fa-file-alt',
      odp: 'fa fa-file-alt',
      txt: 'fa fa-file-alt',
      rtf: 'fa fa-file-alt',
      // Audio Files
      mp3: 'fa fa-file-audio',
      wav: 'fa fa-file-audio',
      ogg: 'fa fa-file-audio',
      aac: 'fa fa-file-audio',
      flac: 'fa fa-file-audio',
      m4a: 'fa fa-file-audio',
      // Video Files
      mp4: 'fa fa-file-video',
      avi: 'fa fa-file-video',
      mov: 'fa fa-file-video',
      wmv: 'fa fa-file-video',
      flv: 'fa fa-file-video',
      webm: 'fa fa-file-video',
      // Archive Files
      zip: 'fa fa-file-archive',
      rar: 'fa fa-file-archive',
      '7z': 'fa fa-file-archive',
      tar: 'fa fa-file-archive',
      gz: 'fa fa-file-archive',
      gzip: 'fa fa-file-archive',

      // Miscellaneous Files
      csv: 'fa fa-file-csv',
      xml: 'fa fa-file-code',
      json: 'fa fa-file-code',
      html: 'fa fa-file-code',
      htm: 'fa fa-file-code',
      md: 'fa fa-file-alt',
      ini: 'fa fa-file-alt',
      cfg: 'fa fa-file-alt',
      config: 'fa fa-file-alt',
    };
    const icon = iconMap[fileTypeLowerCase];
    return icon ? icon : 'fa fa-file';
  }
  setFiltersFromPrimeTable(event) {
    let api_filter = {};
    if ((event && event.first) || (event && event.first == 0)) {
      api_filter['from'] = event.first;
    }
    if (event && event.rows) {
      api_filter['count'] = event.rows;
    }
    if (event && event.filters) {
      let filters = event.filters;
      Object.entries(filters).forEach(([key, value]) => {
        if (filters[key]['value'] != null) {
          let filterSuffix = '';
          if (filters[key]['matchMode'] == 'startsWith') {
            filterSuffix = 'startWith';
          } else if (filters[key]['matchMode'] == 'contains') {
            filterSuffix = 'like';
          } else if (filters[key]['matchMode'] == 'endsWith') {
            filterSuffix = 'endWith';
          } else if (filters[key]['matchMode'] == 'equals') {
            filterSuffix = 'eq';
          } else if (filters[key]['matchMode'] == 'notEquals') {
            filterSuffix = 'neq';
          } else if (filters[key]['matchMode'] == 'dateIs') {
            filterSuffix = 'eq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] =
              this.dateTimeProcessor.getStringFromDate_YYYYMMDD(dateValue);
            filters[key]['value'] = this.moment(dateValue).format('YYYY-MM-DD');
          } else if (filters[key]['matchMode'] == 'dateIsNot') {
            filterSuffix = 'neq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] =
              this.dateTimeProcessor.getStringFromDate_YYYYMMDD(dateValue);
            filters[key]['value'] = this.moment(dateValue).format('YYYY-MM-DD');
          }
          if (filterSuffix != '') {
            api_filter[key + '-' + filterSuffix] = filters[key]['value'];
          }
        }
      });
    }
    if (event && event.sortField) {
      let filterValue;
      if (event.sortOrder && event.sortOrder == 1) {
        filterValue = 'asc';
      } else if (event.sortOrder && event.sortOrder == -1) {
        filterValue = 'dsc';
      }
      if (filterValue) {
        api_filter['sort_' + event.sortField] = filterValue;
      }
    }
    return api_filter;
  }
}
