import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { RoutingService } from 'src/app/services/routing-service';

@Component({
  selector: 'app-evaluate-credit',
  templateUrl: './evaluate-credit.component.html',
  styleUrl: './evaluate-credit.component.scss',
})
export class EvaluateCreditComponent implements OnInit {
  leadId: any;
  leadData: any;
  loading: any;
  createdOn: any;
  leadDocuments: any = {};
  dscrValues: any = {};
  breadCrumbItems: any = [];
  totalEmi: number;

  profitaftertaxAy1: number;
  depreciationAy1: number;
  interestonLoansAy2: number;
  interestonLoansAy1: number;
  proposedEmi: number;
  odCcInterestAy1: number;
  monthsAy1: number;
  partnerRemuAy1: number;
  partnerInterestAy1: number;

  turnoverAy1: number;
  purchasesAy1: number;
  sundryDebtorsAy1: number;
  sundryCreditorsAy1: number;

  turnoverAy2: number;
  purchasesAy2: number;
  sundryDebtorsAy2: number;
  sundryCreditorsAy2: number;
  creditSummary: string;
  partnerRemuAy2: number;
  partnerInterestAy2: number;
  profitaftertaxAy2: number;
  depreciationAy2: number;
  directorsRemuAy2: number;
  directorsRemuAy1: number;

  odCcInterestAy2: number;
  monthsAy2: number;

  gstTurnover: number;
  margin: number;
  months: number;
  gstValue: number;
  bankingTurnover: number;
  btoMargin: number;
  btoMonths: number;
  btoValue: number;
  resultFirstYear: number | null = null;

  debtor_daysFirstYear: number | null = null;
  creditor_daysFirstYear: number | null = null;

  debtor_daysSecondYear: number | null = null;
  creditor_daysSecondYear: number | null = null;

  isFirstYearSelected: boolean = true;
  isSecondYearSelected: boolean = false;
  totalGst3BSale: number = 0;

  isFirstYearBalanceSheet: boolean = true;
  isSecondYearBalanceSheet: boolean = false;
  currentTableEvent: any;
  leads: any = [];
  searchFilter: any = {};
  moment: any;
  displayedItems: any = [];
  activeTab: string = 'dscr'; // default tab
  version = projectConstantsLocal.VERSION_DESKTOP;
  documentTypes = [
    { key: 'gstCertificate', label: 'GST Certificate' },
    { key: 'labourTradeLicense', label: 'Labour / Trade License' },
    { key: 'vatTinTot', label: 'VAT / Tin / TOT' },
    { key: 'msmeUdyamCertificate', label: 'MSME / UDYAM Certificate' }
  ];
  businessFields = [
    { key: 'natureOfBusiness', label: 'Nature of Business' },
    { key: 'product', label: 'Product', pipe: 'capitalize' },
    { key: 'businessOperatingSince', label: 'Business Vintage' },
    { key: 'businessEntity', label: 'Business Entity' },
    { key: 'businessTurnover', label: 'Business TurnOver', pipe: 'capitalize' },
    { key: 'city', label: 'City', pipe: 'capitalize' },
    { key: 'createdOn', label: 'Created On', pipe: 'date' }
  ];
  remainingFirmDocuments = [
    { label: 'Firm Registration Certificate', key: 'firmRegistrationCertificate' },
    { label: 'Partnership Deed', key: 'partnershipDeed' },
    { label: 'GST Certificate', key: 'firmGstCertificate' },
    { label: 'MSME / UDYAM Certificate', key: 'firmmsmeUdyamCertificate' }
  ];
  llpFirmDocuments = [
    { label: 'Certificate of Incorporation ', key: 'llpCertificateofIncorporation' },
    { label: 'LLP Deed', key: 'llpDeed' },
    { label: 'GST Certificate', key: 'firmGstCertificate' },
    { label: 'MSME / UDYAM Certificate', key: 'firmmsmeUdyamCertificate' }
  ];
  companyDocuments = [
    { label: 'Incorporation Certificate', key: 'incorporationCertificate' },
    { label: 'MOA and AOA', key: 'moaandaoa' },
    { label: 'GST Certificate', key: 'companyGst' },
    { label: 'MSME / UDYAM Certificate', key: 'companyMSMEUdyamCertificate' },
    { label: 'Share Holding Pattern', key: 'shareHoldingPattern' }
  ];
  gstAccountFields = [
    { key: 'operatingState', label: 'State' },
    { key: 'filingPeriod', label: 'Filing Period' },
    { key: 'gst3BSale', label: 'GSTR-3B Sale' },
    { key: 'gstDetails', label: 'GSTR-3B Attachment' }
  ];
  existingLoanFields = [
    { key: 'bankName', label: 'Bank Name', pipe: 'capitalize' },
    { key: 'loanType', label: 'Loan Type', pipe: 'capitalize' },
    { key: 'emiAmount', label: 'Loan EMI' },
    { key: 'emiClosingDate', label: 'EMI Closing Date', pipe: 'date' }
  ];
  currentAccountFields = [
    { key: 'name', label: 'Bank Name', pipe: 'capitalize' },
    { key: 'from', label: 'Statement From', isDate: true },
    { key: 'to', label: 'Statement To', isDate: true },
    { key: 'currentAccountStatements', label: 'Statement Attachment' }
  ];

  odAccountFields = [
    { key: 'name', label: 'Bank Name', pipe: 'capitalize' }, // Optional: capitalize
    { key: 'from', label: 'Statement From', isDate: true },
    { key: 'to', label: 'Statement To', isDate: true },
    { key: 'odAccountStatements', label: 'Statement Attachment', isFile: true },
    { key: 'odlimit', label: 'OD Limit' },
    { key: 'odSactionLetter', label: 'OD Sanction Letter', isFile: true }
  ];

  constructor(
    private location: Location,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    // this.activatedRoute.params.subscribe((params) => {
    //   if (params && params['id']) {
    //     this.leadId = params['id'];
    //     this.getLeadById(this.leadId);
    //     this.getDscrValuesById(this.leadId).then((data) => {
    //       if (data) {
    //         this.setDscrValuesData();
    //       }
    //     });
    //   }
    // });
    this.leadId = this.activatedRoute.snapshot.paramMap.get('id');
    const status = this.activatedRoute.snapshot.paramMap.get('status');
    if (this.leadId) {
      if (!status) {
        this.getLeadById(this.leadId);
      } else {
        const validStatuses = ['personalLoan', 'homeLoan', 'lap'];
        if (validStatuses.includes(status)) {
          this.getLoanLeadById(this.leadId);
        } else {
          console.warn('Unknown status:', status);
          this.getLeadById(this.leadId);
        }
      }
      this.getLeadDocumentsById(this.leadId).then((data) => {
        if (data) {
          // console.log('Lead documents loaded');
          if (this.leadDocuments?.gstDetails?.length > 0) {
            this.totalGst3BSale = this.leadDocuments.gstDetails.reduce((sum, item) => {
              return sum + (parseFloat(item.gst3BSale) || 0);
            }, 0);
          }
        }
      });
      this.getDscrValuesById(this.leadId).then((data) => {
        if (data) {
          this.setDscrValuesData();
        }
      });
    }
  }

  ngOnInit(): void {
    // this.activatedRoute.params.subscribe((params) => {
    //   if (params && params['id']) {
    //     this.leadId = params['id'];
    //     this.getLeadById(this.leadId);
    //     this.getLeadDocumentsById(this.leadId).then((data) => {
    //       if (data) {
    //         // console.log('Lead documents loaded');
    //         if (this.leadDocuments?.gstDetails?.length > 0) {
    //           this.totalGst3BSale = this.leadDocuments.gstDetails.reduce((sum, item) => {
    //             return sum + (parseFloat(item.gst3BSale) || 0);
    //           }, 0);
    //         }
    //       }
    //     });
    //   }
    // });

    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Credit Evaluation',
        routerLink: '/user/credit',
        queryParams: { v: this.version },
      },
      { label: 'Lead Details' },
    ];
  }

  getLoanLeadById(leadId: any): void {
    this.leadsService.getLoanLeadById(leadId).subscribe(
      (data: any) => {
        this.leadData = data;
        this.updateDisplayedItems();
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.leadData && this.leadData[0].employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      // { data: this.leadData[0], displayProperty: 'businessName' },
      { data: this.leadData[0], displayProperty: loanDisplayProperty },
    ];
  }
  changeLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 5;
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.getTotalLeads(api_filter);
    }
  }

  getTotalLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  // sendLeadToReject(lead) {
  //   this.changeLeadStatus(lead[0].id, 10);
  //   const targetUrl = `user/rejects`;
  //   this.router.navigateByUrl(targetUrl);
  // }
  sendLeadToReject(lead) {
    console.log('Row clicked:', lead);
    const loanType = lead[0].loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.changeLoanLeadStatus(lead[0].leadId, 10);
      this.routingService.handleRoute(`rejects`, null);
    } else {
      // If no known loanType, omit status from the route
      this.changeLeadStatus(lead[0].id, 10);
      this.routingService.handleRoute(`rejects`, null);
    }
  }

  // sendLeadToReadyToLogin(lead) {
  //   this.changeLeadStatus(lead[0].id, 11);

  //   const id = lead[0].id;
  //   const targetUrl = `user/logins/bankSelection/${id}`;
  //   this.router.navigateByUrl(targetUrl);
  // }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  sendLeadToReadyToLogin(lead) {

    console.log('Row clicked:', lead);
    const loanType = lead[0].loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.changeLoanLeadStatus(lead[0].leadId, 11);
      this.routingService.handleRoute(`logins/bankSelection/${loanType}/${lead[0].leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.changeLeadStatus(lead[0].id, 11);
      this.routingService.handleRoute(`logins/bankSelection/${lead[0].id}`, null);
    }
  }

  changeLoanLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        // this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  setDscrValuesData() {
    this.turnoverAy1 = this.dscrValues.turnoverAy1 || '';
    this.purchasesAy1 = this.dscrValues.purchasesAy1 || '';
    this.profitaftertaxAy1 = this.dscrValues.profitaftertaxAy1 || '';
    this.depreciationAy1 = this.dscrValues.depreciationAy1 || '';
    this.interestonLoansAy2 = this.dscrValues.interestonLoansAy2 || '';
    this.interestonLoansAy1 = this.dscrValues.interestonLoansAy1 || '';
    this.monthsAy1 = this.dscrValues.monthsAy1 || '';
    this.turnoverAy2 = this.dscrValues.turnoverAy2 || '';
    this.purchasesAy2 = this.dscrValues.purchasesAy2 || '';
    this.profitaftertaxAy2 = this.dscrValues.profitaftertaxAy2 || '';
    this.depreciationAy2 = this.dscrValues.depreciationAy2 || '';
    this.totalEmi = this.dscrValues.totalEmi || '';
    this.proposedEmi = this.dscrValues.proposedEmi || '';
    this.odCcInterestAy1 = this.dscrValues.odCcInterestAy1 || '';
    this.directorsRemuAy1 = this.dscrValues.directorsRemuAy1 || '';
    this.directorsRemuAy2 = this.dscrValues.directorsRemuAy2 || '';
    this.partnerRemuAy1 = this.dscrValues.partnerRemuAy1 || '';
    this.partnerRemuAy2 = this.dscrValues.partnerRemuAy2 || '';
    this.partnerInterestAy2 = this.dscrValues.partnerInterestAy2 || '';
    this.partnerInterestAy1 = this.dscrValues.partnerInterestAy1 || '';
    this.resultFirstYear = this.dscrValues.resultFirstYear || '';
    this.sundryDebtorsAy2 = this.dscrValues.sundryDebtorsAy2 || '';
    this.sundryDebtorsAy1 = this.dscrValues.sundryDebtorsAy1 || '';
    this.sundryCreditorsAy2 = this.dscrValues.sundryCreditorsAy2 || '';
    this.sundryCreditorsAy1 = this.dscrValues.sundryCreditorsAy1 || '';
    this.creditor_daysFirstYear = this.dscrValues.creditor_daysFirstYear || '';
    this.debtor_daysFirstYear = this.dscrValues.debtor_daysFirstYear || '';
    this.gstValue = this.dscrValues.gstValue || '';
    this.months = this.dscrValues.months || '';
    this.margin = this.dscrValues.margin || '';
    this.gstTurnover = this.dscrValues.gstTurnover || '';
    this.btoValue = this.dscrValues.btoValue || '';
    this.btoMonths = this.dscrValues.btoMonths || '';
    this.btoMargin = this.dscrValues.btoMargin || '';
    this.bankingTurnover = this.dscrValues.bankingTurnover || '';
    this.creditSummary = this.dscrValues.creditSummary || '';
  }
  onCreditSummaryChange() {
    let formData = {
      creditSummary: this.creditSummary,
    };
    this.leadsService.addDscrValuesData(this.leadId, formData).subscribe(
      (data: any) => {
        this.toastService.showSuccess(
          ' credit summary  values  Saved Successfully'
        );
        this.getDscrValuesById(this.leadId);
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  getDscrValuesById(leadId) {
    return new Promise((resolve, reject) => {
      this.leadsService.getDscrValuesById(leadId).subscribe(
        (dscrValues: any) => {
          this.dscrValues = dscrValues;
          // console.log('dscrValues,', dscrValues);
          resolve(true);
        },
        (error) => {
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }

  calculateDscrRatio() {
    let formData = {
      turnoverAy1: this.turnoverAy1,
      purchasesAy1: this.purchasesAy1,
      profitaftertaxAy1: this.profitaftertaxAy1,
      depreciationAy1: this.depreciationAy1,
      interestonLoansAy2: this.interestonLoansAy2,
      interestonLoansAy1: this.interestonLoansAy1,
      monthsAy1: this.monthsAy1,
      turnoverAy2: this.turnoverAy2,
      purchasesAy2: this.purchasesAy2,
      profitaftertaxAy2: this.profitaftertaxAy2,
      depreciationAy2: this.depreciationAy2,
      totalEmi: this.totalEmi,
      proposedEmi: this.proposedEmi,
      odCcInterestAy1: this.odCcInterestAy1,
      resultFirstYear: this.resultFirstYear,
      directorsRemuAy1: this.directorsRemuAy1,
      directorsRemuAy2: this.directorsRemuAy2,
      partnerRemuAy1: this.partnerRemuAy1,
      partnerRemuAy2: this.partnerRemuAy2,
      partnerInterestAy2: this.partnerInterestAy2,
      partnerInterestAy1: this.partnerInterestAy1,
    };
    this.leadsService.calculateDscrRatio(this.leadId, formData).subscribe(
      (data: any) => {
        if (data) {
          this.resultFirstYear = data.resultFirstYear;
          this.loading = false;
          this.toastService.showSuccess('Calculated and saved Successfully');
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  calculateBalanceSheet() {
    let formData = {
      sundryDebtorsAy1: this.sundryDebtorsAy1,
      sundryCreditorsAy1: this.sundryCreditorsAy1,
      turnoverAy1: this.turnoverAy1,
      purchasesAy1: this.purchasesAy1,
      sundryDebtorsAy2: this.sundryDebtorsAy2,
      sundryCreditorsAy2: this.sundryCreditorsAy2,
      turnoverAy2: this.turnoverAy2,
      purchasesAy2: this.purchasesAy2,
    };
    this.leadsService.calculateBalanceSheet(this.leadId, formData).subscribe(
      (data: any) => {
        if (data) {
          this.debtor_daysFirstYear = data.debtor_daysFirstYear;
          this.creditor_daysFirstYear = data.creditor_daysFirstYear;
          this.loading = false;
          this.toastService.showSuccess('Calculated Successfully');
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  calculateGstProgram() {
    let formData = {
      totalEmi: this.totalEmi,
      odCcInterestAy1: this.odCcInterestAy1,
      gstTurnover: this.gstTurnover,
      margin: this.margin,
      months: this.months,
    };
    this.leadsService.calculateGstProgram(this.leadId, formData).subscribe(
      (data: any) => {
        if (data) {
          this.gstValue = data.gstValue;
          this.loading = false;
          this.toastService.showSuccess('Calculated and saved Successfully');
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  calculateBTOProgram() {
    let formData = {
      totalEmi: this.totalEmi,
      odCcInterestAy1: this.odCcInterestAy1,
      bankingTurnover: this.bankingTurnover,
      btoMargin: this.btoMargin,
      btoMonths: this.btoMonths,
    };
    this.leadsService.calculateBTOProgram(this.leadId, formData).subscribe(
      (data: any) => {
        if (data) {
          this.btoValue = data.btoValue;
          this.loading = false;
          this.toastService.showSuccess('Calculated and saved Successfully');
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  calculateTotalEmi() {
    const checkboxes = document.querySelectorAll(
      '.business-details input[type="checkbox"]'
    );
    let totalEmi = 0;
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.checked) {
        totalEmi += parseFloat(checkbox.value);
      }
    });
    this.totalEmi = totalEmi;
  }

  getLeadById(leadId: any): void {
    this.leadsService.getLeadDetailsById(leadId).subscribe(
      (leadData: any) => {
        this.leadData = leadData;
        console.log('leadData', leadData);
        this.updateDisplayedItems();
        this.updateBreadcrumb();
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  getLeadDocumentsById(leadId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.leadsService.getLeadDocumentsById(leadId).subscribe(
        (leadDocuments: any) => {
          this.leadDocuments = leadDocuments;
          console.log('lead documents:', leadDocuments);
          resolve(true);
        },
        (error) => {
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }
  isValidDate(date: any): boolean {
    return date && !isNaN(new Date(date).getTime());
  }

  updateBreadcrumb(): void {
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Credit Evaluation',
        routerLink: '/user/credit',
        queryParams: { v: this.version },
      },
      { label: this.leadData?.businessName || 'Lead Details' },
    ];
  }

  getFinancialYear(yearsAgo: number = 0): string {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - yearsAgo - 1;
    const endYear = startYear + 1;
    return `AY ${startYear}-${endYear}`;
  }

  goBack(): void {
    this.location.back();
  }
}
