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
  deleteAccount(accountId, filter = {}) {
    const url = 'accounts/' + accountId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  deleteLead(leadId, filter = {}) {
    const url = 'leads/' + leadId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  deleteLoanLead(leadId, filter = {}) {
    const url = 'loanleads/' + leadId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  deleteLogin(leadId, filter = {}) {
    const url = 'logins/' + leadId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  createLeadFromCallback(data) {
    const url = 'leads/callbacktolead';
    return this.serviceMeta.httpPost(url, data);
  }
  createLoanLeadFromCallback(data) {
    const url = 'loanleads/callbacktoloanlead';
    return this.serviceMeta.httpPost(url, data);
  }

  createLoanLead(data) {
    const url = 'loanleads';
    return this.serviceMeta.httpPost(url, data);
  }

  createIpAddress(data) {
    const url = 'ipAddress';
    return this.serviceMeta.httpPost(url, data);
  }

  updateLead(leadId, data) {
    const url = 'leads/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateLeadFileRemarks(leadId, data) {
    const url = 'leads/file-remarks/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateFipRemark(leadId, data) {
    const url = 'leads/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }

  updateLoanLead(leadId, data) {
    const url = 'loanleads/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateFIPDetails(leadId, data) {
    const url = 'logins/fipDetails/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateplFIPDetails(leadId, data) {
    const url = 'logins/plfipDetails/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateRevenueDetails(leadId, data) {
    const url = 'logins/revenueDetails/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateApprovalsDetails(leadId, data) {
    const url = 'logins/approved/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateplApprovalsDetails(leadId, data) {
    const url = 'logins/plapproved/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  updateDisbursalDetails(leadId, data) {
    const url = 'logins/disbursed/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  getLeads(filter = {}) {
    const url = 'leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getFiles(filter = {}) {
    const url = 'leads/files';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getInhouseRejectedLeads(filter = {}) {
    const url = 'leads/inHouseRejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getAllLeadData(leadId, filter = {}) {
    const url = 'leads/lead-data/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getAllLoanLeadData(leadId, filter = {}) {
    const url = 'loanleads/getallloandata/' + leadId;
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
  getTotalSanctionedAmountSum(filter = {}) {
    const url = 'logins/totalsancsum';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getTotalDisbursedAmountSum(filter = {}) {
    const url = 'logins/totaldisbsum';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getApprovalsLeads(filter = {}) {
    const url = 'logins/approvals';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getplApprovalsLeads(filter = {}) {
    const url = 'logins/plapprovals';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getDisbursalLeads(filter = {}) {
    const url = 'logins/disbursals';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getplDisbursalLeads(filter = {}) {
    const url = 'logins/pldisbursals';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getBankRejectsLeads(filter = {}) {
    const url = 'logins/bankRejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getplBankRejectsLeads(filter = {}) {
    const url = 'logins/plbankRejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCNIRejectsLeads(filter = {}) {
    const url = 'logins/cniRejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getplCNIRejectsLeads(filter = {}) {
    const url = 'logins/plcniRejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getDistinctLeads(filter = {}) {
    const url = 'logins';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getFIPProcessDistinctLeads(filter = {}) {
    const url = 'logins/fipDistinctLeads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getplFIPDistinctLeads(filter = {}) {
    const url = 'logins/plfipDistinctLeads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getExportedLeads(filter = {}) {
    const url = 'reports/exportLeads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportFilesInProcess(filter = {}) {
    const url = 'reports/exportFip';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportApprovalLeads(filter = {}) {
    const url = 'reports/exportApprovals';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportDisbursalLeads(filter = {}) {
    const url = 'reports/exportDisbursals';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportBankRejectedLeads(filter = {}) {
    const url = 'reports/exportBankRejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportCNILeads(filter = {}) {
    const url = 'reports/exportCNIS';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportCNILeadDetails(filter = {}) {
    const url = 'reports/exportCNIdetails';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportSanctionDetails(filter = {}) {
    const url = 'reports/exportSanctionDetails';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportDisbursalDetails(filter = {}) {
    const url = 'reports/exportDisbursalDetails';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportloginsDoneDetails(filter = {}) {
    const url = 'reports/exportloginsDoneDetails';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  exportloginFiles(filter = {}) {
    const url = 'reports/exportloginfiles';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getExportedCallbacks(filter = {}) {
    const url = 'reports/exportCallbacks';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  createUsers(data) {
    const url = 'users';
    return this.serviceMeta.httpPost(url, data);
  }
  createSubscription(data) {
    const url = 'subscriptions';
    return this.serviceMeta.httpPost(url, data);
  }
  createRazorpayOrder(amount: number) {
    const url = 'subscriptions/razorpay/order';
    return this.serviceMeta.httpPost(url, { amount });
  }

  verifyAndStoreSubscription(data: any) {
    const url = 'subscriptions/razorpay/verify';
    return this.serviceMeta.httpPost(url, data);
  }
  deleteUsers(userId, filter = {}) {
    const url = 'users/' + userId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  updateUsers(userId, data) {
    const url = 'users/' + userId;
    return this.serviceMeta.httpPut(url, data);
  }
  getUsers(filter = {}) {
    const url = 'users';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getReports(filter = {}) {
    const url = 'reports/reportsdata';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getActiveUsers(filter = {}) {
    const url = 'users/active';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getUsersDetailsById(userId, filter = {}) {
    const url = 'users/' + userId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getSubscriptionById(accountId, filter = {}) {
    const url = 'subscriptions/' + accountId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getUserRbac() {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    let user = userDetails?.user || {};
    // console.log(user);
    let rbac = user.rbac.split(',');
    let capabilities = {
      leads: rbac.includes('leads'),
      callbacks: rbac.includes('callbacks'),
      files: rbac.includes('files'),
      // partial: rbac.includes('partial'),
      credit: rbac.includes('credit'),
      logins: rbac.includes('logins'),
      filesinprocess: rbac.includes('filesinprocess'),
      approvals: rbac.includes('approvals'),
      disbursals: rbac.includes('disbursals'),
      rejects: rbac.includes('rejects'),
      team: rbac.includes('team'),
      bankers: rbac.includes('bankers'),
      reports: rbac.includes('reports'),
      ipAddress: rbac.includes('ipAddress'),
      integrations: rbac.includes('integrations'),
      followups: rbac.includes('followups'),
      delete: rbac.includes('delete'),
    };
    return capabilities;
  }
  getUsersCount(filter = {}) {
    const url = 'users/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getActiveUsersCount(filter = {}) {
    const url = 'users/activeCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getReportsCount(filter = {}) {
    const url = 'reports/reportsCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  changeLeadStatus(leadId, statusId) {
    const url = `leads/${leadId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }

  changeLoanLeadStatus(leadId, statusId) {
    const url = `loanleads/${leadId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }
  updateUserStatus(userId: number, status: string) {
    const url = `users/${userId}/status`;
    const body = { status };
    return this.serviceMeta.httpPut(url, body);
  }
  changeCallBackStatus(callbackId, statusId) {
    const url = `callbacks/${callbackId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }
  deleteCallBack(callBackId, filter = {}) {
    const url = 'callbacks/' + callBackId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }

  changeBankersStatus(bankersId, statusId) {
    const url = `bankers/${bankersId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }

  deleteBanker(bankerId, filter = {}) {
    const url = 'bankers/' + bankerId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getLeadDetailsById(leadId, filter = {}) {
    const url = 'leads/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getLoanLeadById(leadId, filter = {}) {
    const url = 'loanleads/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCreditSummary(leadId, filter = {}) {
    const url = 'leads/creditSummary/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getFIPDetailsById(leadId, filter = {}) {
    const url = 'logins/fipDetails/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getBankRejectsDetailsById(leadId, filter = {}) {
    const url = 'logins/bankRejected/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCNIRejectsDetailsById(leadId, filter = {}) {
    const url = 'logins/cniRejected/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getApprovalsDetailsById(leadId, filter = {}) {
    const url = 'logins/approved/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getDisbursalsDetailsById(leadId, filter = {}) {
    const url = 'logins/disbursed/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLoginsDoneById(filter = {}) {
    const url = 'logins/loginsDone';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getLeadDocumentsById(leadId, filter = {}) {
    const url = 'leads/documents/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getDscrValuesById(leadId, filter = {}) {
    const url = 'leads/dscr_ratio/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  addLeadDocuments(leadId, data) {
    const url = 'leads/documents/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  addLoanLeadsDocumentData(leadId, data) {
    const url = 'loanleads/loanleadsdocuments/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  addDscrValuesData(leadId, data) {
    const url = 'leads/dscr_ratio/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  calculateGstProgram(leadId, data) {
    const url = 'leads/calulategstprogram/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  calculateEligibleEmi(leadId, data) {
    const url = 'loanleads/eligibleemi/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  calculateBTOProgram(leadId, data) {
    const url = 'leads/btoprogram/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  calculateBalanceSheet(leadId, data) {
    const url = 'leads/balancesheet/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  calculateDscrRatio(leadId, data) {
    const url = 'leads/dscrratio/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }
  getLeadsCount(filter = {}) {
    const url = 'leads/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getFilesCount(filter = {}) {
    const url = 'leads/files-count';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLoginsDoneCount(filter = {}) {
    const url = 'logins/loginsDoneCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getloanLeadsCount(filter = {}) {
    const url = 'loanleads/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getTotalLeadsCountArray(filter = {}) {
    const url = 'loanleads/arraycount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getStatusLeadsCountArray(filter = {}) {
    const url = 'loanleads/statuscount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getTotalCallbacksCountArray(filter = {}) {
    const url = 'callbacks/arraycount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getStatusCallbacksCountArray(filter = {}) {
    const url = 'callbacks/statuscount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getDistinctLeadCount(filter = {}) {
    const url = 'logins/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getFIPProcessDistinctLeadsCount(filter = {}) {
    const url = 'logins/fipcount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getplFIPDistinctLeadsCount(filter = {}) {
    const url = 'logins/plfipcount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getApprovedLeadCount(filter = {}) {
    const url = 'logins/approvalCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getplApprovedLeadCount(filter = {}) {
    const url = 'logins/plapprovalCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getBankRejectedLeadCount(filter = {}) {
    const url = 'logins/rejectedCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getplBankRejectedLeadCount(filter = {}) {
    const url = 'logins/plrejectedCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCNIRejectedLeadCount(filter = {}) {
    const url = 'logins/cniCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getplCNIRejectedLeadCount(filter = {}) {
    const url = 'logins/plcniCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getDisbursalLeadCount(filter = {}) {
    const url = 'logins/disbursalCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getplDisbursalLeadCount(filter = {}) {
    const url = 'logins/pldisbursalCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLeadCountStatus(filter = {}) {
    const url = 'counts/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getRejectsCountStatus(filter = {}) {
    const url = 'counts/rejects';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLoginsCountStatus(filter = {}) {
    const url = 'counts/logins';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCallbackCountStatus(filter = {}) {
    const url = 'counts/callback';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getFilesCountStatus(filter = {}) {
    const url = 'counts/files';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  // getPartialCountStatus(filter = {}) {
  //   const url = 'counts/partial';
  //   return this.serviceMeta.httpGet(url, null, filter);
  // }
  getCreditEvaluationCountStatus(filter = {}) {
    const url = 'counts/credit';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getMonthWiseLeadCountStatus(filter = {}) {
    const url = 'counts/monthleads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getMonthWiseCallBacksCount(filter = {}) {
    const url = 'counts/monthcallbacks';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getPast7DaysLeadCountStatus(filter = {}) {
    const url = 'counts/week/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getPast7DaysCallBacksCountStatus(filter = {}) {
    const url = 'counts/week/callback';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLastMonthLeadCountStatus(filter = {}) {
    const url = 'counts/lastmonth/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getThisMonthLeadCountStatus(filter = {}) {
    const url = 'counts/thismonth/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getThisMonthCallBacksCount(filter = {}) {
    const url = 'counts/thismonth/callbacks';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getLastBeforeMonthLeadCountStatus(filter = {}) {
    const url = 'counts/lastbeforemonth/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getTwoMonthsAgoCallBacksCount(filter = {}) {
    const url = 'counts/lastbeforemonth/callbacks';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLastMonthCallBacksCountStatus(filter = {}) {
    const url = 'counts/lastmonth/callback';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getDisbursedAmount(filter = {}) {
    const url = 'counts/lastmonth/disbursed';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getuserLastMonthSanctionedAmount(filter = {}) {
    const url = 'counts/lastmonth/sancamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getuserLastMonthDisbursedAmount(filter = {}) {
    const url = 'counts/lastmonth/disbamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getuserLastLastMonthSanctionedAmount(filter = {}) {
    const url = 'counts/lastlastmonth/sancamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getuserTwoMonthsAgoSanctionedAmount(filter = {}) {
    const url = 'counts/twomonthsago/sancamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getuserLastLastMonthDisbursedAmount(filter = {}) {
    const url = 'counts/lastlastmonth/disbamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getuserTwoMonthsAgoDisbursedAmount(filter = {}) {
    const url = 'counts/twomonthsago/disbamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getuserCurrentMonthDisbursedAmount(filter = {}) {
    const url = 'counts/thismonth/disbamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getuserCurrentMonthSanctionedAmount(filter = {}) {
    const url = 'counts/thismonth/sancamount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getSanctionedAmount(filter = {}) {
    const url = 'counts/firstmonth/approved';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLast6MonthsLeadCountStatus(filter = {}) {
    const url = 'counts/last6months/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLast6MonthsCallBacksCountStatus(filter = {}) {
    const url = 'counts/last6months/callback';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLastYearLeadCountStatus(filter = {}) {
    const url = 'counts/lastyear/leads';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLastYearCallBacksCountStatus(filter = {}) {
    const url = 'counts/lastyear/callback';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getUserRoles(filter = {}) {
    const url = 'users/userroles';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getLeadSources(filter = {}) {
    const url = 'leads/sources';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  createCallBack(data) {
    const url = 'callbacks';
    return this.serviceMeta.httpPost(url, data);
  }
  createLogin(data) {
    const url = 'logins';
    return this.serviceMeta.httpPost(url, data);
  }
  createDscrTable(leadId) {
    const url = 'createTable/insertidDscrTable';
    return this.serviceMeta.httpPost(url, leadId);
  }
  createleadDocumentsTable(leadId) {
    const url = 'createTable/insertidleaddocumentsTable';
    return this.serviceMeta.httpPost(url, leadId);
  }
  updateCallBack(leadId, data) {
    const url = 'callbacks/' + leadId;
    return this.serviceMeta.httpPut(url, data);
  }

  updateIpAddress(ipAddressId, data) {
    const url = 'ipAddress/' + ipAddressId;
    return this.serviceMeta.httpPut(url, data);
  }
  getCallBacks(filter = {}) {
    const url = 'callbacks';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCallBackDetailsById(leadId, filter = {}) {
    const url = 'callbacks/' + leadId;
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getIpAddressById(ipAddressId, filter = {}) {
    const url = 'ipAddress/' + ipAddressId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getCallBacksCount(filter = {}) {
    const url = 'callbacks/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getIpAddressCount(filter = {}) {
    const url = 'ipAddress/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  createBanker(data) {
    const url = 'bankers';
    return this.serviceMeta.httpPost(url, data);
  }
  updateBanker(bankersId, data) {
    const url = 'bankers/' + bankersId;
    return this.serviceMeta.httpPut(url, data);
  }
  getBankers(filter = {}) {
    const url = 'bankers';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getSubscriptionPlans(filter = {}) {
    const url = 'subscriptionPlans';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getBanks(filter = {}) {
    const url = 'bankers/banks';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getBankersDetailsById(bankersId, filter = {}) {
    const url = 'bankers/' + bankersId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  getBankersCount(filter = {}) {
    const url = 'bankers/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getNewBankersCount(filter = {}) {
    const url = 'bankers/newBankerscount';
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
