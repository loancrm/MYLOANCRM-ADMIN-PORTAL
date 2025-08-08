import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';

import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { ReportsService } from '../reports.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  reportsListConfig: any = [];
  leadUsers: any = [];
  banks: any = [];
  files: any = [];
  breadCrumbItems: any = [];
  customerLabel: any;
  donationStatus: any;
  apptStatus: any;
  checkinStatus: any;
  crmStatus: any;
  cdlStatus: any;
  leadStatus: any;
  ivrStatus: any;
  orderStatus: any;
  memberStatus: any;
  showToken: any;
  activeUser: any;
  loading: any;
  reportType: any;
  selectedReportConfig: any;
  reportData: any = {};
  showDateRange: any = false;
  dateRangeFrom: any;
  dateRangeTo: any;
  moment: any;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusiness = projectConstantsLocal.NATURE_OF_BUSINESS;
  businessTurnover = projectConstantsLocal.BUSINESS_TURNOVER;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  leadStatusList = projectConstantsLocal.LEAD_INTERNAL_STATUS_REPORTS;
  productTypeList = projectConstantsLocal.PRODUCT_TYPES;
  processCodeList = projectConstantsLocal.PROCESS_CODES;
  callbacksStatusList = projectConstantsLocal.CALLBACK_STATUS_REPORTS;
  loginsStatus = projectConstantsLocal.BANKSSAVED_STATUS;
  approvalStatus = projectConstantsLocal.APPROVALS_STATUS;
  dateRange = [
    { field: 'date', title: 'Date From', type: 'date', filterType: 'ge' },
    { field: 'date', title: 'Date To', type: 'date', filterType: 'le' },
  ];
  labels: any;
  locations: any = [];
  responseType: any = 'INLINE';
  isQuestionaire: any = false;
  financeStatus: any;
  invoiceCategories: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService,
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Reports',
        routerLink: '/user/reports',
        queryParams: { v: this.version },
      },
      { label: 'Generate Report' },
    ];
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      if (queryParams && queryParams['reportType']) {
        this.reportType = queryParams['reportType'];
      } else {
        this.toastService.showError({ error: 'Invalid Url' });
        this.routingService.handleRoute('list', null);
      }
    });
  }
  ngOnInit() {
    Promise.all([this.getLeadUsers(), this.getBanks(), this.getDistinctLeads()])
      .then(() => {
        this.setReportsList();
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }
  updateBreadcrumb(): void {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Reports',
        routerLink: '/user/reports',
        queryParams: { v: this.version },
      },
      {
        label:
          this.selectedReportConfig?.reportName + ' Report' ||
          'Generate Report',
      },
    ];
  }
  goBack() {
    this.location.back();
  }
  setReportsList() {
    let reportsListConfig = [
      {
        reportName: 'Leads',
        reportType: 'LEADS',
        condition: true,
        fields: [
          {
            field: 'leadInternalStatus',
            title: 'Lead Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadStatusList,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'eq',
            options: this.natureofBusiness,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'businessTurnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessTurnover,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'eq',
            options: this.hadOwnHouse,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Callbacks',
        reportType: 'CALLBACKS',
        condition: true,
        fields: [
          {
            field: 'callbackInternalStatus',
            title: 'Callback Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.callbacksStatusList,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },

      {
        reportName: 'Files In Process',
        reportType: 'FILESINPROCESS',
        condition: true,
        fields: [
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'eq',
            options: this.natureofBusiness,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'businessTurnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessTurnover,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'eq',
            options: this.hadOwnHouse,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },

      {
        reportName: 'Sanction Files',
        reportType: 'SANCTIONFILES',
        condition: true,
        fields: [
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'eq',
            options: this.natureofBusiness,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'businessTurnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessTurnover,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'eq',
            options: this.hadOwnHouse,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },

      {
        reportName: 'Disbursed Files',
        reportType: 'DISBURSALFILES',
        condition: true,
        fields: [
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'eq',
            options: this.natureofBusiness,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'businessTurnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessTurnover,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'eq',
            options: this.hadOwnHouse,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Bank Rejected Files',
        reportType: 'BANKREJECTEDFILES',
        condition: true,
        fields: [
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'eq',
            options: this.natureofBusiness,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'businessTurnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessTurnover,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'eq',
            options: this.hadOwnHouse,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },

      {
        reportName: 'CNI Files',
        reportType: 'CNIFILES',
        condition: true,
        fields: [
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'eq',
            options: this.natureofBusiness,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'businessTurnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'eq',
            options: this.businessTurnover,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'eq',
            options: this.hadOwnHouse,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'CNI Details',
        reportType: 'CNIDETAILS',
        condition: true,
        fields: [],
      },
      {
        reportName: 'Sanction Details',
        reportType: 'SANCTIONDETAILS',
        condition: true,
        fields: [
          // {
          //   field: 'fipStatus',
          //   title: 'Login Status',
          //   type: 'dropdown',
          //   filterType: 'eq',
          //   options: this.loginsStatus,
          //   value: 'name',
          //   label: 'displayName',
          // },

          // {
          //   field: 'approvedStatus',
          //   title: 'Approval Status',
          //   type: 'dropdown',
          //   filterType: 'eq',
          //   options: this.approvalStatus,
          //   value: 'name',
          //   label: 'displayName',
          // },
          {
            field: 'productType',
            title: 'Product  Type',
            type: 'dropdown',
            filterType: 'eq',
            options: this.productTypeList,
            value: 'id',
            label: 'name',
          },
          {
            field: 'approvalDate',
            title: 'Approval From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'approvalDate',
            title: 'Approval To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Login Details',
        reportType: 'LOGINSDONEDETAILS',
        condition: true,
        fields: [
          {
            field: 'bankId',
            title: 'Bank Name',
            type: 'dropdown',
            filterType: 'eq',
            options: this.banks,
            value: 'id',
            label: 'name',
          },
          {
            field: 'loginDate',
            title: 'Login From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'loginDate',
            title: 'Login To Date',
            type: 'date',
            filterType: 'lte',
          },
          // {
          //   field: 'createdOn',
          //   title: 'From Date',
          //   type: 'date',
          //   filterType: 'gte',
          // },
          // {
          //   field: 'createdOn',
          //   title: 'To Date',
          //   type: 'date',
          //   filterType: 'lte',
          // },
        ],
      },
      {
        reportName: 'Disbursed Details',
        reportType: 'DISBURSALDETAILS',
        condition: true,
        fields: [
          {
            field: 'productType',
            title: 'Product  Type',
            type: 'dropdown',
            filterType: 'eq',
            options: this.productTypeList,
            value: 'id',
            label: 'name',
          },
          {
            field: 'disbursalDate',
            title: 'Disbursed From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'disbursalDate',
            title: 'Disbursed To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Login Files',
        reportType: 'LOGINFILES',
        condition: true,
        fields: [
          {
            field: 'leadId',
            title: 'Business Name',
            type: 'dropdown',
            filterType: 'eq',
            options: this.files,
            value: 'id',
            label: 'label',
          },
          {
            field: 'sourcedBy',
            title: 'Sourced By',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leadUsers,
            value: 'id',
            label: 'name',
          },
          {
            field: 'bankId',
            title: 'Bank Name',
            type: 'dropdown',
            filterType: 'eq',
            options: this.banks,
            value: 'id',
            label: 'name',
          },
          {
            field: 'productType',
            title: 'Product  Type',
            type: 'dropdown',
            filterType: 'eq',
            options: this.productTypeList,
            value: 'id',
            label: 'name',
          },
          {
            field: 'fipStatus',
            title: 'Login Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.loginsStatus,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'approvedStatus',
            title: 'Sanction Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.approvalStatus,
            value: 'name',
            label: 'displayName',
          },

          {
            field: 'loginDate',
            title: 'Login From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'loginDate',
            title: 'Login To Date',
            type: 'date',
            filterType: 'lte',
          },
          {
            field: 'approvalDate',
            title: 'Sanction From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'approvalDate',
            title: 'Sanction To Date',
            type: 'date',
            filterType: 'lte',
          },
          {
            field: 'disbursalDate',
            title: 'Disbursal From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'disbursalDate',
            title: 'Disbursal To Date',
            type: 'date',
            filterType: 'lte',
          },
          {
            field: 'processCode',
            title: 'Process Code',
            type: 'dropdown',
            filterType: 'eq',
            options: this.processCodeList,
            value: 'name',
            label: 'name',
          },
        ],
      },
    ];
    this.selectedReportConfig = reportsListConfig.filter(
      (report) => report.condition && report.reportType == this.reportType
    )[0];
    this.updateBreadcrumb();
    if (!this.isQuestionaire) {
      if (this.selectedReportConfig.addOnReports) {
        delete this.selectedReportConfig.addOnReports;
      }
    }
    if (
      this.selectedReportConfig &&
      this.selectedReportConfig.fields &&
      this.selectedReportConfig.fields.length > 0
    ) {
      this.selectedReportConfig.fields.forEach((element, index) => {
        this.reportData[element.field + '-' + element.filterType] =
          element.defaultValue ? element.defaultValue : '';
        element.field == 'timePeriod'
          ? element.defaultValue
            ? this.onTimePeriodChange(
              { value: element.defaultValue },
              element,
              index
            )
            : ''
          : '';
      });
    }
    if (!this.selectedReportConfig) {
      this.toastService.showError({
        error: 'You are not authorized to access this report',
      });
      this.routingService.handleRoute('list', null);
    }
  }
  onTimePeriodChange(event, field, index) {
    if (event.value && event.value == 'DATE_RANGE') {
      this.selectedReportConfig.fields.splice(index + 1, 0, ...this.dateRange);
      //   if (!field.disabled)
      //   {
      //     this.showDateRange = true;
      //   }
      // }
      // else
      // {
      //   this.showDateRange = false;
      //   this.dateRangeFrom = this.dateRangeTo = null;
    } else {
      this.selectedReportConfig.fields.splice(index + 1, this.dateRange.length);
    }
  }
  getJsonKeys(json) {
    return Object.keys(json);
  }
  routeTo() { }

  generateReport(reportType: string) {
    this.loading = true;
    const selectedReportData = {};
    for (const key in this.reportData) {
      if (this.reportData[key]) {
        selectedReportData[key] = this.reportData[key];
      }
    }
    const apiFilter = {};
    if (this.reportData['createdOn-gte']) {
      apiFilter['createdOn-gte'] = this.moment(
        this.reportData['createdOn-gte']
      ).format('YYYY-MM-DD');
    }
    if (this.reportData['createdOn-lte']) {
      apiFilter['createdOn-lte'] = this.moment(this.reportData['createdOn-lte'])
        .add(1, 'days')
        .format('YYYY-MM-DD');
    }
    if (this.reportData['approvalDate-gte']) {
      apiFilter['approvalDate-gte'] = this.moment(
        this.reportData['approvalDate-gte']
        // ).format('MM/DD/YYYY');
      ).format('YYYY-MM-DD');
    }
    if (this.reportData['approvalDate-lte']) {
      apiFilter['approvalDate-lte'] = this.moment(
        this.reportData['approvalDate-lte']
      ).format('YYYY-MM-DD');
    }

    if (this.reportData['disbursalDate-gte']) {
      apiFilter['disbursalDate-gte'] = this.moment(
        this.reportData['disbursalDate-gte']
      ).format('YYYY-MM-DD');
    }
    if (this.reportData['disbursalDate-lte']) {
      apiFilter['disbursalDate-lte'] = this.moment(
        this.reportData['disbursalDate-lte']
      ).format('YYYY-MM-DD');
    }
    if (this.reportData['loginDate-gte']) {
      apiFilter['loginDate-gte'] = this.moment(
        this.reportData['loginDate-gte']
      ).format('YYYY-MM-DD');
    }
    if (this.reportData['loginDate-lte']) {
      apiFilter['loginDate-lte'] = this.moment(
        this.reportData['loginDate-lte']
      ).format('YYYY-MM-DD');
    }
    Object.assign(selectedReportData, apiFilter);
    for (const key in selectedReportData) {
      if (Array.isArray(selectedReportData[key])) {
        const newKey = key.replace('-eq', '-or');
        selectedReportData[newKey] = selectedReportData[key].join(',');
        delete selectedReportData[key];
      }
    }
    // console.log(reportType);
    // console.log(selectedReportData);
    const reportServiceMap = {
      LEADS: () => this.leadsService.getExportedLeads(selectedReportData),
      CALLBACKS: () =>
        this.leadsService.getExportedCallbacks(selectedReportData),
      FILESINPROCESS: () =>
        this.leadsService.exportFilesInProcess(selectedReportData),
      SANCTIONFILES: () =>
        this.leadsService.exportApprovalLeads(selectedReportData),
      DISBURSALFILES: () =>
        this.leadsService.exportDisbursalLeads(selectedReportData),
      BANKREJECTEDFILES: () =>
        this.leadsService.exportBankRejectedLeads(selectedReportData),
      CNIFILES: () => this.leadsService.exportCNILeads(selectedReportData),
      SANCTIONDETAILS: () =>
        this.leadsService.exportSanctionDetails(selectedReportData),
      DISBURSALDETAILS: () =>
        this.leadsService.exportDisbursalDetails(selectedReportData),
      CNIDETAILS: () =>
        this.leadsService.exportCNILeadDetails(selectedReportData),
      LOGINSDONEDETAILS: () =>
        this.leadsService.exportloginsDoneDetails(selectedReportData),
      LOGINFILES: () => this.leadsService.exportloginFiles(selectedReportData),
    };
    const serviceCall = reportServiceMap[reportType];
    if (!serviceCall) {
      this.loading = false;
      this.toastService.showError('Invalid report type');
      return;
    }
    serviceCall().subscribe(
      (response: any) => {
        this.loading = false;
        if (response.success && response.fileUrl) {
          // window.open('//' + response.fileUrl, '_blank');
          this.toastService.showSuccess('Report Generated Successfully and sent via email.');
        } else {
          this.toastService.showError('Failed to download the report.');
        }
      },
      (error: any) => {
        this.toastService.showError(
          error
        );
        this.loading = false;
      }
    );
  }

  onNumberInputChange(event: any) {
    const allowedChars = /[0-9]/g;
    const key = event.key;
    if (!allowedChars.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  getLabelsFromData(field, data) {
    if (data != (field && field.defaultValue)) {
      let labels = data.map((option) => {
        let labelString = '';
        if (Array.isArray(field.label)) {
          for (let i = 0; i < field.label.length; i++) {
            labelString += option[field.label[i]] + ' ';
          }
        } else {
          labelString = option[field.label];
        }
        return labelString;
      });
      return labels && labels.length > 0 ? labels.toString() : '';
    }
    return field.defaultValue;
  }
  getLeadUsers(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getUsers(filter).subscribe(
        (leadUsers: any) => {
          // this.leadUsers = [{ name: 'All' }, ...leadUsers];
          this.leadUsers = [...leadUsers];
          // console.log(leadUsers);
          this.loading = false;
          resolve(true);
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
          resolve(false);
        }
      );
    });
  }

  getBanks(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getBanks(filter).subscribe(
        (response: any) => {
          // this.banks = [{ name: 'All' }, ...response];
          this.banks = [...response];
          // console.log(this.banks);
          this.loading = false;
          resolve(true);
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
          resolve(false);
        }
      );
    });
  }

  getDistinctLeads(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getDistinctLeads(filter).subscribe(
        (response: any) => {
          // this.files = [{ businessName: 'All', id: 1 }, ...response];
          this.files = [...response];
          this.files = this.files.map((file) => {
            const formattedBusinessName = file.businessName
              .split(' ')
              .map((word) => {
                if (word.includes('.')) {
                  return word
                    .split('.')
                    .map(
                      (part) =>
                        part.charAt(0).toUpperCase() +
                        part.slice(1).toLowerCase()
                    )
                    .join('.');
                }
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              })
              .join(' ');
            return {
              ...file,
              businessName: formattedBusinessName,
              label: `${formattedBusinessName} (${file.id})`,
            };
          });
          // console.log(this.files);
          this.loading = false;
          resolve(true);
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
          resolve(false);
        }
      );
    });
  }
}
