import { Component, OnInit } from "@angular/core";
import { ToastService } from "../../../services/toast.service";
import { ActivatedRoute } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { DateTimeProcessorService } from "src/app/services/date-time-processor.service";
import { FileUploadComponent } from "../../file-upload/file-upload.component";
import { LeadsService } from "../../leads/leads.service";
import { Location } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { projectConstantsLocal } from "src/app/constants/project-constants";
@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrl: "./upload.component.scss"
})
export class UploadComponent {
  // items: any;
  // activeItem: any;
  // leadId: any;
  // leadData: any;
  // loading: any;
  // capabilities: any;
  // leadDocuments: any = {};
  // applicantName: any;
  // applicantAadhaar: any;
  // applicantPan: any;
  // applicantEmail: any;
  // cibilScore: any;
  // coApplicantName: any;
  // applicantRelation: any;
  // breadCrumbItems: any = [];
  // selectedFiles: any = {
  //   cibilReport: { filesData: [], links: [], uploadedFiles: [] },
  //   panCard: { filesData: [], links: [], uploadedFiles: [] },
  //   currentAccountStatements: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   odAccountStatements: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   gstDetails: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   residenceProof: { filesData: [], links: [], uploadedFiles: [] },
  //   otherAttachments: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   gstCertificate: { filesData: [], links: [], uploadedFiles: [] },
  //   labourTradeLicense: { filesData: [], links: [], uploadedFiles: [] },
  //   vatTinTot: { filesData: [], links: [], uploadedFiles: [] },
  //   msmeUdyamCertificate: { filesData: [], links: [], uploadedFiles: [] },
  //   coApplicantCibilReport: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   firmPanCard: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   firmRegistrationCertificate: {
  //     filesData: [],
  //     links: [],
  //     uploadedFiles: [],
  //   },
  //   partnershipDeed: { filesData: [], links: [], uploadedFiles: [] },
  //   firmGstCertificate: { filesData: [], links: [], uploadedFiles: [] },
  //   firmmsmeUdyamCertificate: { filesData: [], links: [], uploadedFiles: [] },
  //   companyPan: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   incorporationCertificate: { filesData: [], links: [], uploadedFiles: [] },
  //   moaandaoa: { filesData: [], links: [], uploadedFiles: [] },
  //   companyGst: { filesData: [], links: [], uploadedFiles: [] },
  //   companyMSMEUdyamCertificate: {
  //     filesData: [],
  //     links: [],
  //     uploadedFiles: [],
  //   },
  //   shareHoldingPattern: { filesData: [], links: [], uploadedFiles: [] },
  //   aadharCard: { filesData: [], links: [], uploadedFiles: [] },
  //   applicantPhoto: { filesData: [], links: [], uploadedFiles: [] },
  //   voterId: { filesData: [], links: [], uploadedFiles: [] },
  //   kycOtherDocuments: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   coApplicantOtherDocuments: [
  //     { filesData: [], links: [], uploadedFiles: [] },
  //   ],
  //   coApplicantAadhaar: { filesData: [], links: [], uploadedFiles: [] },
  //   coApplicantPhoto: { filesData: [], links: [], uploadedFiles: [] },
  //   coApplicantVoterId: { filesData: [], links: [], uploadedFiles: [] },
  //   coApplicantPan: { filesData: [], links: [], uploadedFiles: [] },
  //   partnerpanCard: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   partneraadharCard: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   partnerPhoto: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   partnervoterId: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   partnerotherDocuments1: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   partnerotherDocuments2: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directorpanCard: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directoraadharCard: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directorPhoto: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directorvoterId: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directorotherDocuments1: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directorotherDocuments2: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   partnerCibilReport: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   directorCibilReport: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   pastIncomeReturns: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   pastSaralCopy: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   pastComputationOfIncome: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   pastBalanceSheet: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   presentIncomeReturns: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   presentSaralCopy: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   presentComputationOfIncome: [
  //     { filesData: [], links: [], uploadedFiles: [] },
  //   ],
  //   presentBalanceSheet: [{ filesData: [], links: [], uploadedFiles: [] }],
  //   odSactionLetter: [{ filesData: [], links: [], uploadedFiles: [] }],
  // };
  // financialReturns: any = [
  //   {
  //     pastIncomeTax: '',
  //     pastIncomeReturns: [],
  //     presentIncomeTax: '',
  //     presentIncomeReturns: [],
  //   },
  // ];
  // coApplicantCibil: any = [
  //   {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     cibilScore: '',
  //     coApplicantCibilReport: [],
  //   },
  // ];
  // directorCibil: any = [
  //   {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     cibilScore: '',
  //     directorCibilReport: [],
  //   },
  // ];
  // directorsKycs: any = [
  //   {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     directorpanCard: [],
  //     directoraadharCard: [],
  //     directorPhoto: [],
  //     directorvoterId: [],
  //     directordocName1: '',
  //     directorotherDocuments1: [],
  //     directordocName2: '',
  //     directorotherDocuments2: [],
  //   },
  // ];
  // partnerKycs: any = [
  //   {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     partnerpanCard: [],
  //     partneraadharCard: [],
  //     partnerPhoto: [],
  //     partnervoterId: [],
  //     partnerdocName1: '',
  //     partnerotherDocuments1: [],
  //     partnerdocName2: '',
  //     partnerotherDocuments2: [],
  //   },
  // ];
  // partnerCibil: any = [
  //   {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     cibilScore: '',
  //     partnerCibilReport: [],
  //   },
  // ];
  // currentAccountStatements: any = [
  //   {
  //     name: '',
  //     from: '',
  //     to: '',
  //     odlimit: '',
  //     odAccountStatements: [],
  //     odSactionLetter: [],
  //   },
  // ];
  // odAccountStatements: any = [
  //   {
  //     name: '',
  //     from: '',
  //     to: '',
  //     odAccountStatements: [],
  //   },
  // ];
  // gstDetails: any = [
  //   {
  //     operatingState: '',
  //     filingPeriod: '',
  //     gst3BSale: '',
  //     gst3BSaleAttachment: [],
  //   },
  // ];
  // existingLoans: any = [
  //   {
  //     bankName: '',
  //     loanType: '',
  //     emiAmount: '',
  //     emiClosingDate: '',
  //   },
  // ];
  // moment: any;
  // residenceProof: any = [];
  // otherAttachments: any = [
  //   {
  //     name: '',
  //     otherAttachments: [],
  //   },
  // ];
  // firmPanCard: any = [
  //   {
  //     firmPan: '',
  //     firmPanCard: [],
  //   },
  // ];
  // companyPan: any = [
  //   {
  //     panNumber: '',
  //     companyPan: [],
  //   },
  // ];
  // kycOtherDocuments: any = [
  //   {
  //     name: '',
  //     kycOtherDocuments: [],
  //   },
  // ];
  // coApplicantOtherDocuments: any = [
  //   {
  //     name: '',
  //     coApplicantOtherDocuments: [],
  //   },
  // ];
  // gstCertificate: any = [];
  // labourTradeLicense: any = [];
  // vatTinTot: any = [];
  // msmeUdyamCertificate: any = [];
  // totalEMIAmount: number | null = null;
  // totalGSTR3Bscale: number | null = null;
  // version = projectConstantsLocal.VERSION_DESKTOP;
  // constructor(
  //   private toastService: ToastService,
  //   private activatedRoute: ActivatedRoute,
  //   private leadsService: LeadsService,
  //   private dialogService: DialogService,
  //   private confirmationService: ConfirmationService,
  //   private dateTimeProcessor: DateTimeProcessorService,
  //   private location: Location
  // ) {
  //   this.moment = this.dateTimeProcessor.getMoment();
  //   //console.log(this.moment)
  //   this.activatedRoute.params.subscribe((params) => {
  //     //console.log(params);
  //     if (params && params['id']) {
  //       this.leadId = params['id'];
  //       this.getLeadById(this.leadId);
  //       this.getLeadDocumentsById(this.leadId).then((data) => {
  //         if (data) {
  //           this.setLeadDocumentsData();
  //         }
  //       });
  //     }
  //   });
  //   this.breadCrumbItems = [
  //     {
  //
  //       label: ' Home',
  //       routerLink: '/user/dashboard',
  //       queryParams: { v: this.version },
  //     },
  //     {
  //       label: 'Partial Files',
  //       routerLink: '/user/partial',
  //       queryParams: { v: this.version },
  //     },
  //     { label: 'Upload Documents' },
  //   ];
  // }
  // ngOnInit() {
  //   this.items = [
  //     { label: 'KYCs', name: 'kycs' },
  //     { label: 'Cibil', name: 'cibil' },
  //     { label: 'Business / Vintage Details', name: 'businessdetails' },
  //     { label: 'Bank Statements', name: 'bankStatements' },
  //     { label: 'Financials', name: 'financials' },
  //     { label: 'GST', name: 'gst' },
  //     { label: 'Existing Loans', name: 'existingLoans' },
  //     { label: 'Other Details', name: 'otherDetails' },
  //   ];
  //   this.activeItem = this.items[0];
  //   this.capabilities = this.leadsService.getUserRbac();
  //   console.log(this.capabilities);
  // }
  // calculateTotalEMIAmount(): void {
  //   this.totalEMIAmount = 0;
  //   for (const loan of this.existingLoans) {
  //     if (loan['emiAmount']) {
  //       this.totalEMIAmount += parseFloat(loan['emiAmount']);
  //     }
  //   }
  // }
  // calculateTotalGSTR3BSale(): void {
  //   this.totalGSTR3Bscale = 0;
  //   for (const gst of this.gstDetails) {
  //     if (gst['gst3BSale']) {
  //       this.totalGSTR3Bscale += parseFloat(gst['gst3BSale']);
  //     }
  //   }
  // }
  // getLeadById(leadId) {
  //   this.leadsService?.getLeadDetailsById(leadId)?.subscribe(
  //     (leadData: any) => {
  //       this.leadData = leadData;
  //       console.log('leadData', leadData);
  //     },
  //     (error) => {
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // setLeadDocumentsData() {
  //   this.applicantName = this.leadDocuments.applicantName || '';
  //   this.applicantAadhaar = this.leadDocuments.aadhaar || '';
  //   this.applicantEmail = this.leadDocuments.email || '';
  //   this.applicantPan = this.leadDocuments.pan || '';
  //   this.cibilScore = this.leadDocuments.cibilScore || '';
  //   this.coApplicantName = this.leadDocuments.coApplicantName || '';
  //   this.applicantRelation = this.leadDocuments.applicantRelation || '';
  //   if (this.leadDocuments.cibilReport) {
  //     this.selectedFiles['cibilReport']['uploadedFiles'] =
  //       this.leadDocuments.cibilReport;
  //   }
  //   if (
  //     this.leadDocuments.firmPanCard &&
  //     this.leadDocuments.firmPanCard.length > 0
  //   ) {
  //     this.firmPanCard = [];
  //     this.selectedFiles['firmPanCard'] = [];
  //     this.leadDocuments.firmPanCard.forEach((statement, index) => {
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['firmPanCard'],
  //       };
  //       this.selectedFiles['firmPanCard'].push(fileData);
  //       this.firmPanCard.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.coApplicantCibil &&
  //     this.leadDocuments.coApplicantCibil.length > 0
  //   ) {
  //     this.coApplicantCibil = [];
  //     this.selectedFiles['coApplicantCibilReport'] = [];
  //     this.leadDocuments.coApplicantCibil.forEach((statement, index) => {
  //       statement['name'] = statement['name'];
  //       statement['panNumber'] = statement['panNumber'];
  //       statement['aadharNumber'] = statement['aadharNumber'];
  //       statement['mobileNumber'] = statement['mobileNumber'];
  //       statement['cibilScore'] = statement['cibilScore'];
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['coApplicantCibilReport'],
  //       };
  //       this.selectedFiles['coApplicantCibilReport'].push(fileData);
  //       this.coApplicantCibil.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.companyPan &&
  //     this.leadDocuments.companyPan.length > 0
  //   ) {
  //     this.companyPan = [];
  //     this.selectedFiles['companyPan'] = [];
  //     this.leadDocuments.companyPan.forEach((statement, index) => {
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['companyPan'],
  //       };
  //       this.selectedFiles['companyPan'].push(fileData);
  //       this.companyPan.push(statement);
  //     });
  //   }
  //   if (this.leadDocuments.incorporationCertificate) {
  //     this.selectedFiles['incorporationCertificate']['uploadedFiles'] =
  //       this.leadDocuments.incorporationCertificate;
  //   }
  //   if (this.leadDocuments.moaandaoa) {
  //     this.selectedFiles['moaandaoa']['uploadedFiles'] =
  //       this.leadDocuments.moaandaoa;
  //   }
  //   if (this.leadDocuments.companyGst) {
  //     this.selectedFiles['companyGst']['uploadedFiles'] =
  //       this.leadDocuments.companyGst;
  //   }
  //   if (this.leadDocuments.companyMSMEUdyamCertificate) {
  //     this.selectedFiles['companyMSMEUdyamCertificate']['uploadedFiles'] =
  //       this.leadDocuments.companyMSMEUdyamCertificate;
  //   }
  //   if (this.leadDocuments.shareHoldingPattern) {
  //     this.selectedFiles['shareHoldingPattern']['uploadedFiles'] =
  //       this.leadDocuments.shareHoldingPattern;
  //   }
  //   if (this.leadDocuments.firmRegistrationCertificate) {
  //     this.selectedFiles['firmRegistrationCertificate']['uploadedFiles'] =
  //       this.leadDocuments.firmRegistrationCertificate;
  //   }
  //   if (this.leadDocuments.partnershipDeed) {
  //     this.selectedFiles['partnershipDeed']['uploadedFiles'] =
  //       this.leadDocuments.partnershipDeed;
  //   }
  //   if (this.leadDocuments.firmGstCertificate) {
  //     this.selectedFiles['firmGstCertificate']['uploadedFiles'] =
  //       this.leadDocuments.firmGstCertificate;
  //   }
  //   if (this.leadDocuments.firmmsmeUdyamCertificate) {
  //     this.selectedFiles['firmmsmeUdyamCertificate']['uploadedFiles'] =
  //       this.leadDocuments.firmmsmeUdyamCertificate;
  //   }
  //   if (
  //     this.leadDocuments.currentAccountStatements &&
  //     this.leadDocuments.currentAccountStatements.length > 0
  //   ) {
  //     this.currentAccountStatements = [];
  //     this.selectedFiles['currentAccountStatements'] = [];
  //     this.leadDocuments.currentAccountStatements.forEach(
  //       (statement, index) => {
  //         // statement['from'] = new Date(statement['from']);
  //         // statement['to'] = new Date(statement['to']);
  //         let fileData = {
  //           filesData: [],
  //           links: [],
  //           uploadedFiles: statement['currentAccountStatements'],
  //         };
  //         this.selectedFiles['currentAccountStatements'].push(fileData);
  //         this.currentAccountStatements.push(statement);
  //       }
  //     );
  //   }
  //   if (
  //     this.leadDocuments.odAccountStatements &&
  //     this.leadDocuments.odAccountStatements.length > 0
  //   ) {
  //     this.odAccountStatements = [];
  //     this.selectedFiles['odAccountStatements'] = [];
  //     this.selectedFiles['odSactionLetter'] = [];
  //     this.leadDocuments.odAccountStatements.forEach((statement, index) => {
  //       // statement['from'] = new Date(statement['from']);
  //       // statement['to'] = new Date(statement['to']);
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['odAccountStatements'],
  //       };
  //       let fileData1 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['odSactionLetter'],
  //       };
  //       this.selectedFiles['odAccountStatements'].push(fileData);
  //       this.selectedFiles['odSactionLetter'].push(fileData1);
  //       this.odAccountStatements.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.partnerKycs &&
  //     this.leadDocuments.partnerKycs.length > 0
  //   ) {
  //     this.partnerKycs = [];
  //     this.selectedFiles['partnerpanCard'] = [];
  //     this.selectedFiles['partneraadharCard'] = [];
  //     this.selectedFiles['partnerPhoto'] = [];
  //     this.selectedFiles['partnervoterId'] = [];
  //     this.selectedFiles['partnerotherDocuments1'] = [];
  //     this.selectedFiles['partnerotherDocuments2'] = [];
  //     this.leadDocuments.partnerKycs.forEach((statement, index) => {
  //       statement['name'] = statement['name'];
  //       statement['panNumber'] = statement['panNumber'];
  //       statement['aadharNumber'] = statement['aadharNumber'];
  //       statement['mobileNumber'] = statement['mobileNumber'];
  //       statement['partnerdocName1'] = statement['partnerdocName1'];
  //       statement['partnerdocName2'] = statement['partnerdocName2'];
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partnerpanCard'],
  //       };
  //       let fileData1 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partneraadharCard'],
  //       };
  //       let fileData2 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partnerPhoto'],
  //       };
  //       let fileData3 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partnervoterId'],
  //       };
  //       let fileData4 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partnerotherDocuments1'],
  //       };
  //       let fileData5 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partnerotherDocuments2'],
  //       };
  //       this.selectedFiles['partnerpanCard'].push(fileData);
  //       this.selectedFiles['partneraadharCard'].push(fileData1);
  //       this.selectedFiles['partnerPhoto'].push(fileData2);
  //       this.selectedFiles['partnervoterId'].push(fileData3);
  //       this.selectedFiles['partnerotherDocuments1'].push(fileData4);
  //       this.selectedFiles['partnerotherDocuments2'].push(fileData5);
  //       this.partnerKycs.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.partnerCibil &&
  //     this.leadDocuments.partnerCibil.length > 0
  //   ) {
  //     this.partnerCibil = [];
  //     this.selectedFiles['partnerCibilReport'] = [];
  //     this.leadDocuments.partnerCibil.forEach((statement, index) => {
  //       statement['name'] = statement['name'];
  //       statement['panNumber'] = statement['panNumber'];
  //       statement['aadharNumber'] = statement['aadharNumber'];
  //       statement['mobileNumber'] = statement['mobileNumber'];
  //       statement['cibilScore'] = statement['cibilScore'];
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['partnerCibilReport'],
  //       };
  //       this.selectedFiles['partnerCibilReport'].push(fileData);
  //       this.partnerCibil.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.directorCibil &&
  //     this.leadDocuments.directorCibil.length > 0
  //   ) {
  //     this.directorCibil = [];
  //     this.selectedFiles['directorCibilReport'] = [];
  //     this.leadDocuments.directorCibil.forEach((statement, index) => {
  //       statement['name'] = statement['name'];
  //       statement['panNumber'] = statement['panNumber'];
  //       statement['aadharNumber'] = statement['aadharNumber'];
  //       statement['mobileNumber'] = statement['mobileNumber'];
  //       statement['cibilScore'] = statement['cibilScore'];
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directorCibilReport'],
  //       };
  //       this.selectedFiles['directorCibilReport'].push(fileData);
  //       this.directorCibil.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.directorsKycs &&
  //     this.leadDocuments.directorsKycs.length > 0
  //   ) {
  //     this.directorsKycs = [];
  //     this.selectedFiles['directorpanCard'] = [];
  //     this.selectedFiles['directoraadharCard'] = [];
  //     this.selectedFiles['directorPhoto'] = [];
  //     this.selectedFiles['directorvoterId'] = [];
  //     this.selectedFiles['directorotherDocuments1'] = [];
  //     this.selectedFiles['directorotherDocuments2'] = [];
  //     this.leadDocuments.directorsKycs.forEach((statement, index) => {
  //       statement['name'] = statement['name'];
  //       statement['panNumber'] = statement['panNumber'];
  //       statement['aadharNumber'] = statement['aadharNumber'];
  //       statement['mobileNumber'] = statement['mobileNumber'];
  //       statement['directordocName1'] = statement['directordocName1'];
  //       statement['directordocName2'] = statement['directordocName2'];
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directorpanCard'],
  //       };
  //       let fileData1 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directoraadharCard'],
  //       };
  //       let fileData2 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directorPhoto'],
  //       };
  //       let fileData3 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directorvoterId'],
  //       };
  //       let fileData4 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directorotherDocuments1'],
  //       };
  //       let fileData5 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['directorotherDocuments2'],
  //       };
  //       this.selectedFiles['directorpanCard'].push(fileData);
  //       this.selectedFiles['directoraadharCard'].push(fileData1);
  //       this.selectedFiles['directorPhoto'].push(fileData2);
  //       this.selectedFiles['directorvoterId'].push(fileData3);
  //       this.selectedFiles['directorotherDocuments1'].push(fileData4);
  //       this.selectedFiles['directorotherDocuments2'].push(fileData5);
  //       this.directorsKycs.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.financialReturns &&
  //     this.leadDocuments.financialReturns.length > 0
  //   ) {
  //     this.financialReturns = [];
  //     this.selectedFiles['pastIncomeReturns'] = [];
  //     this.selectedFiles['presentIncomeReturns'] = [];
  //     this.leadDocuments.financialReturns.forEach((statement, index) => {
  //       statement['pastIncomeTax'] = statement['pastIncomeTax'];
  //       statement['presentIncomeTax'] = statement['presentIncomeTax'];
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['pastIncomeReturns'],
  //       };
  //       let fileData4 = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['presentIncomeReturns'],
  //       };
  //       this.selectedFiles['pastIncomeReturns'].push(fileData);
  //       this.selectedFiles['presentIncomeReturns'].push(fileData4);
  //       this.financialReturns.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.gstDetails &&
  //     this.leadDocuments.gstDetails.length > 0
  //   ) {
  //     this.gstDetails = [];
  //     this.selectedFiles['gstDetails'] = [];
  //     this.leadDocuments.gstDetails.forEach((gst, index) => {
  //       // gst['filingPeriod'] = new Date(gst['filingPeriod']);
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: gst['gstDetails'],
  //       };
  //       this.selectedFiles['gstDetails'].push(fileData);
  //       this.gstDetails.push(gst);
  //     });
  //     //console.log('gstDetails', this.gstDetails);
  //   }
  //   if (
  //     this.leadDocuments.existingLoans &&
  //     this.leadDocuments.existingLoans.length > 0
  //   ) {
  //     this.existingLoans = [];
  //     this.leadDocuments.existingLoans.forEach((loans, index) => {
  //       // loans['emiClosingDate'] = new Date(loans['emiClosingDate']);
  //       this.existingLoans.push(loans);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.otherDocuments &&
  //     this.leadDocuments.otherDocuments.length > 0
  //   ) {
  //     this.otherAttachments = [];
  //     this.selectedFiles['otherAttachments'] = [];
  //     this.leadDocuments.otherDocuments.forEach((statement, index) => {
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['otherAttachments'],
  //       };
  //       this.selectedFiles['otherAttachments'].push(fileData);
  //       this.otherAttachments.push(statement);
  //     });
  //   }
  //   if (this.leadDocuments.gstCertificate) {
  //     this.selectedFiles['gstCertificate']['uploadedFiles'] =
  //       this.leadDocuments.gstCertificate;
  //   }
  //   if (this.leadDocuments.labourTradeLicense) {
  //     this.selectedFiles['labourTradeLicense']['uploadedFiles'] =
  //       this.leadDocuments.labourTradeLicense;
  //   }
  //   if (this.leadDocuments.vatTinTot) {
  //     this.selectedFiles['vatTinTot']['uploadedFiles'] =
  //       this.leadDocuments.vatTinTot;
  //   }
  //   if (this.leadDocuments.msmeUdyamCertificate) {
  //     this.selectedFiles['msmeUdyamCertificate']['uploadedFiles'] =
  //       this.leadDocuments.msmeUdyamCertificate;
  //   }
  //   if (this.leadDocuments.panCard) {
  //     this.selectedFiles['panCard']['uploadedFiles'] =
  //       this.leadDocuments.panCard;
  //   }
  //   if (this.leadDocuments.aadharCard) {
  //     this.selectedFiles['aadharCard']['uploadedFiles'] =
  //       this.leadDocuments.aadharCard;
  //   }
  //   if (this.leadDocuments.applicantPhoto) {
  //     this.selectedFiles['applicantPhoto']['uploadedFiles'] =
  //       this.leadDocuments.applicantPhoto;
  //   }
  //   if (this.leadDocuments.voterId) {
  //     this.selectedFiles['voterId']['uploadedFiles'] =
  //       this.leadDocuments.voterId;
  //   }
  //   if (this.leadDocuments.coApplicantPhoto) {
  //     this.selectedFiles['coApplicantPhoto']['uploadedFiles'] =
  //       this.leadDocuments.coApplicantPhoto;
  //   }
  //   if (this.leadDocuments.coApplicantPan) {
  //     this.selectedFiles['coApplicantPan']['uploadedFiles'] =
  //       this.leadDocuments.coApplicantPan;
  //   }
  //   if (this.leadDocuments.coApplicantAadhaar) {
  //     this.selectedFiles['coApplicantAadhaar']['uploadedFiles'] =
  //       this.leadDocuments.coApplicantAadhaar;
  //   }
  //   if (this.leadDocuments.coApplicantVoterId) {
  //     this.selectedFiles['coApplicantVoterId']['uploadedFiles'] =
  //       this.leadDocuments.coApplicantVoterId;
  //   }
  //   if (this.leadDocuments.residenceProof) {
  //     this.selectedFiles['residenceProof']['uploadedFiles'] =
  //       this.leadDocuments.residenceProof;
  //   }
  //   if (
  //     this.leadDocuments.kycOtherDocuments &&
  //     this.leadDocuments.kycOtherDocuments.length > 0
  //   ) {
  //     this.kycOtherDocuments = [];
  //     this.selectedFiles['kycOtherDocuments'] = [];
  //     this.leadDocuments.kycOtherDocuments.forEach((statement, index) => {
  //       let fileData = {
  //         filesData: [],
  //         links: [],
  //         uploadedFiles: statement['kycOtherDocuments'],
  //       };
  //       this.selectedFiles['kycOtherDocuments'].push(fileData);
  //       this.kycOtherDocuments.push(statement);
  //     });
  //   }
  //   if (
  //     this.leadDocuments.coApplicantOtherDocuments &&
  //     this.leadDocuments.coApplicantOtherDocuments.length > 0
  //   ) {
  //     this.coApplicantOtherDocuments = [];
  //     this.selectedFiles['coApplicantOtherDocuments'] = [];
  //     this.leadDocuments.coApplicantOtherDocuments.forEach(
  //       (statement, index) => {
  //         let fileData = {
  //           filesData: [],
  //           links: [],
  //           uploadedFiles: statement['coApplicantOtherDocuments'],
  //         };
  //         this.selectedFiles['coApplicantOtherDocuments'].push(fileData);
  //         this.coApplicantOtherDocuments.push(statement);
  //       }
  //     );
  //   }
  // }
  // addDirectorsCibilRow() {
  //   let data = {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     cibilScore: '',
  //     directorCibilReport: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.directorCibil.push(data);
  //   this.selectedFiles.directorCibilReport.push(fileData);
  // }
  // deleteDirectorsCibilRow(index) {
  //   this.directorCibil.splice(index, 1);
  //   this.selectedFiles.directorCibilReport.splice(index, 1);
  // }
  // saveDirectorsCibil() {
  //   for (let index = 0; index < this.directorCibil.length; index++) {
  //     // this.partnerKycs[index]['name'] = this.partnerKycs[index]['name'];
  //     // this.partnerKycs[index]['panNumber'] = this.partnerKycs[index]['panNumber'];
  //     this.directorCibil[index]['directorCibilReport'] = [];
  //     if (
  //       this.selectedFiles['directorCibilReport'][index] &&
  //       this.selectedFiles['directorCibilReport'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['directorCibilReport'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorCibil[index]['directorCibilReport'].push(
  //           this.selectedFiles['directorCibilReport'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorCibilReport'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.directorCibil[index]['directorCibilReport'].push(
  //           this.selectedFiles['directorCibilReport'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     directorCibil: this.directorCibil,
  //   };
  //   console.log('formData', formData);
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Directors  cibil Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveKycsSection() {
  //   let formData = {
  //     applicantName: this.applicantName,
  //     pan: this.applicantPan,
  //     aadhaar: this.applicantAadhaar,
  //     coApplicantName: this.coApplicantName,
  //     applicantRelation: this.applicantRelation,
  //   };
  //   formData['panCard'] = [];
  //   if (
  //     this.selectedFiles['panCard'] &&
  //     this.selectedFiles['panCard']['links']
  //   ) {
  //     for (let i = 0; i < this.selectedFiles['panCard']['links'].length; i++) {
  //       formData['panCard'].push(this.selectedFiles['panCard']['links'][i]);
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['panCard']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['panCard'].push(
  //         this.selectedFiles['panCard']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['aadharCard'] = [];
  //   if (
  //     this.selectedFiles['aadharCard'] &&
  //     this.selectedFiles['aadharCard']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['aadharCard']['links'].length;
  //       i++
  //     ) {
  //       formData['aadharCard'].push(
  //         this.selectedFiles['aadharCard']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['aadharCard']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['aadharCard'].push(
  //         this.selectedFiles['aadharCard']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['applicantPhoto'] = [];
  //   if (
  //     this.selectedFiles['applicantPhoto'] &&
  //     this.selectedFiles['applicantPhoto']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['applicantPhoto']['links'].length;
  //       i++
  //     ) {
  //       formData['applicantPhoto'].push(
  //         this.selectedFiles['applicantPhoto']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['applicantPhoto']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['applicantPhoto'].push(
  //         this.selectedFiles['applicantPhoto']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['voterId'] = [];
  //   if (
  //     this.selectedFiles['voterId'] &&
  //     this.selectedFiles['voterId']['links']
  //   ) {
  //     for (let i = 0; i < this.selectedFiles['voterId']['links'].length; i++) {
  //       formData['voterId'].push(this.selectedFiles['voterId']['links'][i]);
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['voterId']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['voterId'].push(
  //         this.selectedFiles['voterId']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['coApplicantPhoto'] = [];
  //   if (
  //     this.selectedFiles['coApplicantPhoto'] &&
  //     this.selectedFiles['coApplicantPhoto']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantPhoto']['links'].length;
  //       i++
  //     ) {
  //       formData['coApplicantPhoto'].push(
  //         this.selectedFiles['coApplicantPhoto']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantPhoto']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['coApplicantPhoto'].push(
  //         this.selectedFiles['coApplicantPhoto']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['coApplicantPan'] = [];
  //   if (
  //     this.selectedFiles['coApplicantPan'] &&
  //     this.selectedFiles['coApplicantPan']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantPan']['links'].length;
  //       i++
  //     ) {
  //       formData['coApplicantPan'].push(
  //         this.selectedFiles['coApplicantPan']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantPan']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['coApplicantPan'].push(
  //         this.selectedFiles['coApplicantPan']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['coApplicantAadhaar'] = [];
  //   if (
  //     this.selectedFiles['coApplicantAadhaar'] &&
  //     this.selectedFiles['coApplicantAadhaar']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantAadhaar']['links'].length;
  //       i++
  //     ) {
  //       formData['coApplicantAadhaar'].push(
  //         this.selectedFiles['coApplicantAadhaar']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantAadhaar']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['coApplicantAadhaar'].push(
  //         this.selectedFiles['coApplicantAadhaar']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['coApplicantVoterId'] = [];
  //   if (
  //     this.selectedFiles['coApplicantVoterId'] &&
  //     this.selectedFiles['coApplicantVoterId']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantVoterId']['links'].length;
  //       i++
  //     ) {
  //       formData['coApplicantVoterId'].push(
  //         this.selectedFiles['coApplicantVoterId']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['coApplicantVoterId']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['coApplicantVoterId'].push(
  //         this.selectedFiles['coApplicantVoterId']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   for (let index = 0; index < this.kycOtherDocuments.length; index++) {
  //     this.kycOtherDocuments[index]['kycOtherDocuments'] = [];
  //     if (
  //       this.selectedFiles['kycOtherDocuments'][index] &&
  //       this.selectedFiles['kycOtherDocuments'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['kycOtherDocuments'][index]['links'].length;
  //         i++
  //       ) {
  //         this.kycOtherDocuments[index]['kycOtherDocuments'].push(
  //           this.selectedFiles['kycOtherDocuments'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['kycOtherDocuments'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.kycOtherDocuments[index]['kycOtherDocuments'].push(
  //           this.selectedFiles['kycOtherDocuments'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   formData['kycOtherDocuments'] = this.kycOtherDocuments;
  //   for (
  //     let index = 0;
  //     index < this.coApplicantOtherDocuments.length;
  //     index++
  //   ) {
  //     this.coApplicantOtherDocuments[index]['coApplicantOtherDocuments'] = [];
  //     if (
  //       this.selectedFiles['coApplicantOtherDocuments'][index] &&
  //       this.selectedFiles['coApplicantOtherDocuments'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['coApplicantOtherDocuments'][index]['links']
  //           .length;
  //         i++
  //       ) {
  //         this.coApplicantOtherDocuments[index][
  //           'coApplicantOtherDocuments'
  //         ].push(
  //           this.selectedFiles['coApplicantOtherDocuments'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['coApplicantOtherDocuments'][index][
  //           'uploadedFiles'
  //         ].length;
  //         i++
  //       ) {
  //         this.coApplicantOtherDocuments[index][
  //           'coApplicantOtherDocuments'
  //         ].push(
  //           this.selectedFiles['coApplicantOtherDocuments'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //   }
  //   formData['coApplicantOtherDocuments'] = this.coApplicantOtherDocuments;
  //   console.log(formData);
  //   console.log(this.leadId);
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       this.loading = false;
  //       this.toastService.showSuccess("Kyc's Saved Successfully");
  //       this.getLeadDocumentsById(this.leadId);
  //       console.log(this.getLeadDocumentsById(this.leadId));
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // savePartnersCibil() {
  //   for (let index = 0; index < this.partnerCibil.length; index++) {
  //     // this.partnerKycs[index]['name'] = this.partnerKycs[index]['name'];
  //     // this.partnerKycs[index]['panNumber'] = this.partnerKycs[index]['panNumber'];
  //     this.partnerCibil[index]['partnerCibilReport'] = [];
  //     if (
  //       this.selectedFiles['partnerCibilReport'][index] &&
  //       this.selectedFiles['partnerCibilReport'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['partnerCibilReport'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerCibil[index]['partnerCibilReport'].push(
  //           this.selectedFiles['partnerCibilReport'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnerCibilReport'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.partnerCibil[index]['partnerCibilReport'].push(
  //           this.selectedFiles['partnerCibilReport'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     partnerCibil: this.partnerCibil,
  //   };
  //   console.log('formData', formData);
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Partners cibil Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // savePrivateBusinessDetails() {
  //   let formData: any = {};
  //   for (let index = 0; index < this.companyPan.length; index++) {
  //     this.companyPan[index]['companyPan'] = [];
  //     if (
  //       this.selectedFiles['companyPan'][index] &&
  //       this.selectedFiles['companyPan'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['companyPan'][index]['links'].length;
  //         i++
  //       ) {
  //         this.companyPan[index]['companyPan'].push(
  //           this.selectedFiles['companyPan'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['companyPan'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.companyPan[index]['companyPan'].push(
  //           this.selectedFiles['companyPan'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   formData['companyPan'] = this.companyPan;
  //   formData['incorporationCertificate'] = [];
  //   if (
  //     this.selectedFiles['incorporationCertificate'] &&
  //     this.selectedFiles['incorporationCertificate']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['incorporationCertificate']['links'].length;
  //       i++
  //     ) {
  //       formData['incorporationCertificate'].push(
  //         this.selectedFiles['incorporationCertificate']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i <
  //       this.selectedFiles['incorporationCertificate']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['incorporationCertificate'].push(
  //         this.selectedFiles['incorporationCertificate']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['moaandaoa'] = [];
  //   if (
  //     this.selectedFiles['moaandaoa'] &&
  //     this.selectedFiles['moaandaoa']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['moaandaoa']['links'].length;
  //       i++
  //     ) {
  //       formData['moaandaoa'].push(this.selectedFiles['moaandaoa']['links'][i]);
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['moaandaoa']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['moaandaoa'].push(
  //         this.selectedFiles['moaandaoa']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['companyGst'] = [];
  //   if (
  //     this.selectedFiles['companyGst'] &&
  //     this.selectedFiles['companyGst']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['companyGst']['links'].length;
  //       i++
  //     ) {
  //       formData['companyGst'].push(
  //         this.selectedFiles['companyGst']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['companyGst']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['companyGst'].push(
  //         this.selectedFiles['companyGst']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['companyMSMEUdyamCertificate'] = [];
  //   if (
  //     this.selectedFiles['companyMSMEUdyamCertificate'] &&
  //     this.selectedFiles['companyMSMEUdyamCertificate']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['companyMSMEUdyamCertificate']['links'].length;
  //       i++
  //     ) {
  //       formData['companyMSMEUdyamCertificate'].push(
  //         this.selectedFiles['companyMSMEUdyamCertificate']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i <
  //       this.selectedFiles['companyMSMEUdyamCertificate']['uploadedFiles']
  //         .length;
  //       i++
  //     ) {
  //       formData['companyMSMEUdyamCertificate'].push(
  //         this.selectedFiles['companyMSMEUdyamCertificate']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['shareHoldingPattern'] = [];
  //   if (
  //     this.selectedFiles['shareHoldingPattern'] &&
  //     this.selectedFiles['shareHoldingPattern']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['shareHoldingPattern']['links'].length;
  //       i++
  //     ) {
  //       formData['shareHoldingPattern'].push(
  //         this.selectedFiles['shareHoldingPattern']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['shareHoldingPattern']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['shareHoldingPattern'].push(
  //         this.selectedFiles['shareHoldingPattern']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       this.loading = false;
  //       this.toastService.showSuccess(
  //         'Partnership Business Details Saved Successfully'
  //       );
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // savePartnershipBusinessDetails() {
  //   let formData: any = {};
  //   for (let index = 0; index < this.firmPanCard.length; index++) {
  //     this.firmPanCard[index]['firmPanCard'] = [];
  //     if (
  //       this.selectedFiles['firmPanCard'][index] &&
  //       this.selectedFiles['firmPanCard'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['firmPanCard'][index]['links'].length;
  //         i++
  //       ) {
  //         this.firmPanCard[index]['firmPanCard'].push(
  //           this.selectedFiles['firmPanCard'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['firmPanCard'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.firmPanCard[index]['firmPanCard'].push(
  //           this.selectedFiles['firmPanCard'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   formData['firmPanCard'] = this.firmPanCard;
  //   formData['firmRegistrationCertificate'] = [];
  //   if (
  //     this.selectedFiles['firmRegistrationCertificate'] &&
  //     this.selectedFiles['firmRegistrationCertificate']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['firmRegistrationCertificate']['links'].length;
  //       i++
  //     ) {
  //       formData['firmRegistrationCertificate'].push(
  //         this.selectedFiles['firmRegistrationCertificate']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i <
  //       this.selectedFiles['firmRegistrationCertificate']['uploadedFiles']
  //         .length;
  //       i++
  //     ) {
  //       formData['firmRegistrationCertificate'].push(
  //         this.selectedFiles['firmRegistrationCertificate']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['partnershipDeed'] = [];
  //   if (
  //     this.selectedFiles['partnershipDeed'] &&
  //     this.selectedFiles['partnershipDeed']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['partnershipDeed']['links'].length;
  //       i++
  //     ) {
  //       formData['partnershipDeed'].push(
  //         this.selectedFiles['partnershipDeed']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['partnershipDeed']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['partnershipDeed'].push(
  //         this.selectedFiles['partnershipDeed']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['firmGstCertificate'] = [];
  //   if (
  //     this.selectedFiles['firmGstCertificate'] &&
  //     this.selectedFiles['firmGstCertificate']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['firmGstCertificate']['links'].length;
  //       i++
  //     ) {
  //       formData['firmGstCertificate'].push(
  //         this.selectedFiles['firmGstCertificate']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['firmGstCertificate']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['firmGstCertificate'].push(
  //         this.selectedFiles['firmGstCertificate']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   formData['firmmsmeUdyamCertificate'] = [];
  //   if (
  //     this.selectedFiles['firmmsmeUdyamCertificate'] &&
  //     this.selectedFiles['firmmsmeUdyamCertificate']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['firmmsmeUdyamCertificate']['links'].length;
  //       i++
  //     ) {
  //       formData['firmmsmeUdyamCertificate'].push(
  //         this.selectedFiles['firmmsmeUdyamCertificate']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i <
  //       this.selectedFiles['firmmsmeUdyamCertificate']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['firmmsmeUdyamCertificate'].push(
  //         this.selectedFiles['firmmsmeUdyamCertificate']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       this.loading = false;
  //       this.toastService.showSuccess(
  //         'Partnership Business Details Saved Successfully'
  //       );
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveCibilSection() {
  //   for (let index = 0; index < this.coApplicantCibil.length; index++) {
  //     this.coApplicantCibil[index]['coApplicantCibilReport'] = [];
  //     if (
  //       this.selectedFiles['coApplicantCibilReport'][index] &&
  //       this.selectedFiles['coApplicantCibilReport'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['coApplicantCibilReport'][index]['links'].length;
  //         i++
  //       ) {
  //         this.coApplicantCibil[index]['coApplicantCibilReport'].push(
  //           this.selectedFiles['coApplicantCibilReport'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['coApplicantCibilReport'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.coApplicantCibil[index]['coApplicantCibilReport'].push(
  //           this.selectedFiles['coApplicantCibilReport'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     applicantName: this.applicantName,
  //     pan: this.applicantPan,
  //     aadhaar: this.applicantAadhaar,
  //     email: this.applicantEmail,
  //     cibilScore: this.cibilScore,
  //     coApplicantCibil: this.coApplicantCibil,
  //   };
  //   formData['cibilReport'] = [];
  //   if (
  //     this.selectedFiles['cibilReport'] &&
  //     this.selectedFiles['cibilReport']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['cibilReport']['links'].length;
  //       i++
  //     ) {
  //       formData['cibilReport'].push(
  //         this.selectedFiles['cibilReport']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['cibilReport']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['cibilReport'].push(
  //         this.selectedFiles['cibilReport']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   console.log(formData);
  //   console.log(this.leadId);
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       this.loading = false;
  //       this.toastService.showSuccess('Cibil Data Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //       console.log(this.getLeadDocumentsById(this.leadId));
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveBusinessDetails() {
  //   let formData: any = {};
  //   const fileTypes = [
  //     'gstCertificate',
  //     'labourTradeLicense',
  //     'vatTinTot',
  //     'msmeUdyamCertificate',
  //   ];
  //   fileTypes.forEach((fileType) => {
  //     formData[fileType] = [];
  //     if (
  //       this.selectedFiles[fileType] &&
  //       this.selectedFiles[fileType]['links']
  //     ) {
  //       formData[fileType] = formData[fileType].concat(
  //         this.selectedFiles[fileType]['links']
  //       );
  //     }
  //     if (
  //       this.selectedFiles[fileType] &&
  //       this.selectedFiles[fileType]['uploadedFiles']
  //     ) {
  //       formData[fileType] = formData[fileType].concat(
  //         this.selectedFiles[fileType]['uploadedFiles']
  //       );
  //     }
  //   });
  //   console.log(formData);
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       this.loading = false;
  //       this.toastService.showSuccess('Business Details Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // goToNext(activeItem) {}
  // addcurrentAccountStatementsRow() {
  //   let data = {
  //     name: '',
  //     from: '',
  //     to: '',
  //     currentAccountStatements: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.currentAccountStatements.push(data);
  //   this.selectedFiles.currentAccountStatements.push(fileData);
  // }
  // addodAccountStatementsRow() {
  //   let data = {
  //     name: '',
  //     from: '',
  //     to: '',
  //     odlimit: '',
  //     odAccountStatements: [],
  //     odSactionLetter: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData1 = { filesData: [], links: [], uploadedFiles: [] };
  //   this.odAccountStatements.push(data);
  //   this.selectedFiles.odAccountStatements.push(fileData);
  //   this.selectedFiles.odSactionLetter.push(fileData1);
  // }
  // addPartnersKycsRow() {
  //   let data = {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     partnerpanCard: [],
  //     partneraadharCard: [],
  //     partnerPhoto: [],
  //     partnervoterId: [],
  //     partnerdocName1: '',
  //     partnerotherDocuments1: [],
  //     partnerdocName2: '',
  //     partnerotherDocuments2: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData1 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData2 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData3 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData4 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData5 = { filesData: [], links: [], uploadedFiles: [] };
  //   this.partnerKycs.push(data);
  //   this.selectedFiles.partnerpanCard.push(fileData);
  //   this.selectedFiles.partneraadharCard.push(fileData1);
  //   this.selectedFiles.partnerPhoto.push(fileData2);
  //   this.selectedFiles.partnervoterId.push(fileData3);
  //   this.selectedFiles.partnerotherDocuments1.push(fileData4);
  //   this.selectedFiles.partnerotherDocuments2.push(fileData5);
  // }
  // addPartnersCibilRow() {
  //   let data = {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     cibilScore: '',
  //     partnerCibilReport: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.partnerCibil.push(data);
  //   this.selectedFiles.partnerCibilReport.push(fileData);
  // }
  // addDirectorsKycsRow() {
  //   let data = {
  //     name: '',
  //     panNumber: '',
  //     aadharNumber: '',
  //     mobileNumber: '',
  //     directorpanCard: [],
  //     directoraadharCard: [],
  //     directorPhoto: [],
  //     directorvoterId: [],
  //     directordocName1: '',
  //     directorotherDocuments1: [],
  //     directordocName2: '',
  //     directorotherDocuments2: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData1 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData2 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData3 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData4 = { filesData: [], links: [], uploadedFiles: [] };
  //   let fileData5 = { filesData: [], links: [], uploadedFiles: [] };
  //   this.directorsKycs.push(data);
  //   this.selectedFiles.directorpanCard.push(fileData);
  //   this.selectedFiles.directoraadharCard.push(fileData1);
  //   this.selectedFiles.directorPhoto.push(fileData2);
  //   this.selectedFiles.directorvoterId.push(fileData3);
  //   this.selectedFiles.directorotherDocuments1.push(fileData4);
  //   this.selectedFiles.directorotherDocuments2.push(fileData5);
  // }
  // addGstDetailsRow() {
  //   let data = {
  //     operatingState: '',
  //     filingPeriod: '',
  //     gst3BSale: '',
  //     gst3BSaleAttachment: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.gstDetails.push(data);
  //   this.selectedFiles.gstDetails.push(fileData);
  // }
  // addOtherAttachmentsRow() {
  //   let data = {
  //     name: '',
  //     otherAttachments: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.otherAttachments.push(data);
  //   this.selectedFiles.otherAttachments.push(fileData);
  // }
  // addkycOtherDocumentsRow() {
  //   let data = {
  //     name: '',
  //     kycOtherDocuments: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.kycOtherDocuments.push(data);
  //   this.selectedFiles.kycOtherDocuments.push(fileData);
  // }
  // addcoApplicantOtherDocumentsRow() {
  //   let data = {
  //     name: '',
  //     coApplicantOtherDocuments: [],
  //   };
  //   let fileData = { filesData: [], links: [], uploadedFiles: [] };
  //   this.coApplicantOtherDocuments.push(data);
  //   this.selectedFiles.coApplicantOtherDocuments.push(fileData);
  // }
  // addExistingLoansRow() {
  //   let data = {
  //     bankName: '',
  //     loanType: '',
  //     emiAmount: '',
  //     emiClosingDate: '',
  //   };
  //   this.existingLoans.push(data);
  // }
  // deletecurrentAccountStatementsRow(index) {
  //   this.currentAccountStatements.splice(index, 1);
  //   if (
  //     this.selectedFiles['currentAccountStatements'] &&
  //     this.selectedFiles['currentAccountStatements'][index]
  //   ) {
  //     this.selectedFiles['currentAccountStatements'].splice(index, 1);
  //   }
  // }
  // deleteodAccountStatementsRow(index) {
  //   this.odAccountStatements.splice(index, 1);
  //   if (
  //     this.selectedFiles['odAccountStatements'] &&
  //     this.selectedFiles['odAccountStatements'][index]
  //   ) {
  //     this.selectedFiles['odAccountStatements'].splice(index, 1);
  //   }
  //   if (
  //     this.selectedFiles['odSactionLetter'] &&
  //     this.selectedFiles['odSactionLetter'][index]
  //   ) {
  //     this.selectedFiles['odSactionLetter'].splice(index, 1);
  //   }
  // }
  // deleteGstDetailsRow(index) {
  //   this.gstDetails.splice(index, 1);
  //   if (
  //     this.selectedFiles['gstDetails'] &&
  //     this.selectedFiles['gstDetails'][index]
  //   ) {
  //     this.selectedFiles['gstDetails'].splice(index, 1);
  //   }
  //   this.calculateTotalGSTR3BSale();
  // }
  // deleteOtherAttachmentsRow(index) {
  //   this.otherAttachments.splice(index, 1);
  //   if (
  //     this.selectedFiles['otherAttachments'] &&
  //     this.selectedFiles['otherAttachments'][index]
  //   ) {
  //     this.selectedFiles['otherAttachments'].splice(index, 1);
  //   }
  // }
  // deletePartnersKycsRow(index) {
  //   this.partnerKycs.splice(index, 1);
  //   this.selectedFiles.partnerpanCard.splice(index, 1);
  //   this.selectedFiles.partneraadharCard.splice(index, 1);
  //   this.selectedFiles.partnerPhoto.splice(index, 1);
  //   this.selectedFiles.partnervoterId.splice(index, 1);
  //   this.selectedFiles.partnerotherDocuments1.splice(index, 1);
  //   this.selectedFiles.partnerotherDocuments2.splice(index, 1);
  // }
  // deletePartnersCibilRow(index) {
  //   this.partnerCibil.splice(index, 1);
  //   this.selectedFiles.partnerCibilReport.splice(index, 1);
  // }
  // deleteDirectorsKycsRow(index) {
  //   this.directorsKycs.splice(index, 1);
  //   this.selectedFiles.directorpanCard.splice(index, 1);
  //   this.selectedFiles.directoraadharCard.splice(index, 1);
  //   this.selectedFiles.directorPhoto.splice(index, 1);
  //   this.selectedFiles.directorvoterId.splice(index, 1);
  //   this.selectedFiles.directorotherDocuments1.splice(index, 1);
  //   this.selectedFiles.directorotherDocuments2.splice(index, 1);
  // }
  // deletecoApplicantOtherDocumentsRow(index) {
  //   this.coApplicantOtherDocuments.splice(index, 1);
  //   if (
  //     this.selectedFiles['coApplicantOtherDocuments'] &&
  //     this.selectedFiles['coApplicantOtherDocuments'][index]
  //   ) {
  //     this.selectedFiles['coApplicantOtherDocuments'].splice(index, 1);
  //   }
  // }
  // deletekycOtherDocumentsRow(index) {
  //   this.kycOtherDocuments.splice(index, 1);
  //   if (
  //     this.selectedFiles['kycOtherDocuments'] &&
  //     this.selectedFiles['kycOtherDocuments'][index]
  //   ) {
  //     this.selectedFiles['kycOtherDocuments'].splice(index, 1);
  //   }
  // }
  // deleteExistingLoansRow(index) {
  //   this.existingLoans.splice(index, 1);
  //   this.calculateTotalEMIAmount();
  // }
  // saveBankStatements() {
  //   for (let index = 0; index < this.currentAccountStatements.length; index++) {
  //     this.currentAccountStatements[index]['from'] = this.moment(
  //       this.currentAccountStatements[index]['from']
  //     ).format('MM/DD/YYYY');
  //     this.currentAccountStatements[index]['to'] = this.moment(
  //       this.currentAccountStatements[index]['to']
  //     ).format('MM/DD/YYYY');
  //     this.currentAccountStatements[index]['currentAccountStatements'] = [];
  //     if (
  //       this.selectedFiles['currentAccountStatements'][index] &&
  //       this.selectedFiles['currentAccountStatements'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['currentAccountStatements'][index]['links'].length;
  //         i++
  //       ) {
  //         this.currentAccountStatements[index]['currentAccountStatements'].push(
  //           this.selectedFiles['currentAccountStatements'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['currentAccountStatements'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.currentAccountStatements[index]['currentAccountStatements'].push(
  //           this.selectedFiles['currentAccountStatements'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //   }
  //   for (let index = 0; index < this.odAccountStatements.length; index++) {
  //     this.odAccountStatements[index]['from'] = this.moment(
  //       this.odAccountStatements[index]['from']
  //     ).format('MM/DD/YYYY');
  //     this.odAccountStatements[index]['to'] = this.moment(
  //       this.odAccountStatements[index]['to']
  //     ).format('MM/DD/YYYY');
  //     this.odAccountStatements[index]['odAccountStatements'] = [];
  //     this.odAccountStatements[index]['odSactionLetter'] = [];
  //     if (
  //       this.selectedFiles['odAccountStatements'][index] &&
  //       this.selectedFiles['odAccountStatements'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['odAccountStatements'][index]['links'].length;
  //         i++
  //       ) {
  //         this.odAccountStatements[index]['odAccountStatements'].push(
  //           this.selectedFiles['odAccountStatements'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['odAccountStatements'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.odAccountStatements[index]['odAccountStatements'].push(
  //           this.selectedFiles['odAccountStatements'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['odSactionLetter'][index] &&
  //       this.selectedFiles['odSactionLetter'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['odSactionLetter'][index]['links'].length;
  //         i++
  //       ) {
  //         this.odAccountStatements[index]['odSactionLetter'].push(
  //           this.selectedFiles['odSactionLetter'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['odSactionLetter'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.odAccountStatements[index]['odSactionLetter'].push(
  //           this.selectedFiles['odSactionLetter'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     currentAccountStatements: this.currentAccountStatements,
  //     odAccountStatements: this.odAccountStatements,
  //   };
  //   console.log(this.currentAccountStatements);
  //   console.log(formData);
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Bank Statements Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveFinancialReturns() {
  //   for (let index = 0; index < this.financialReturns.length; index++) {
  //     this.financialReturns[index]['pastIncomeReturns'] = [];
  //     this.financialReturns[index]['presentIncomeReturns'] = [];
  //     if (
  //       this.selectedFiles['pastIncomeReturns'][index] &&
  //       this.selectedFiles['pastIncomeReturns'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['pastIncomeReturns'][index]['links'].length;
  //         i++
  //       ) {
  //         this.financialReturns[index]['pastIncomeReturns'].push(
  //           this.selectedFiles['pastIncomeReturns'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['pastIncomeReturns'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.financialReturns[index]['pastIncomeReturns'].push(
  //           this.selectedFiles['pastIncomeReturns'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['presentIncomeReturns'][index] &&
  //       this.selectedFiles['presentIncomeReturns'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['presentIncomeReturns'][index]['links'].length;
  //         i++
  //       ) {
  //         this.financialReturns[index]['presentIncomeReturns'].push(
  //           this.selectedFiles['presentIncomeReturns'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['presentIncomeReturns'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.financialReturns[index]['presentIncomeReturns'].push(
  //           this.selectedFiles['presentIncomeReturns'][index]['uploadedFiles'][
  //             i
  //           ]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     financialReturns: this.financialReturns,
  //   };
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Financial Returns Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // savePartnersKycs() {
  //   for (let index = 0; index < this.partnerKycs.length; index++) {
  //     // this.partnerKycs[index]['name'] = this.partnerKycs[index]['name'];
  //     // this.partnerKycs[index]['panNumber'] = this.partnerKycs[index]['panNumber'];
  //     this.partnerKycs[index]['partnerpanCard'] = [];
  //     this.partnerKycs[index]['partneraadharCard'] = [];
  //     this.partnerKycs[index]['partnerPhoto'] = [];
  //     this.partnerKycs[index]['partnervoterId'] = [];
  //     this.partnerKycs[index]['partnerotherDocuments1'] = [];
  //     this.partnerKycs[index]['partnerotherDocuments2'] = [];
  //     if (
  //       this.selectedFiles['partnerpanCard'][index] &&
  //       this.selectedFiles['partnerpanCard'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['partnerpanCard'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerpanCard'].push(
  //           this.selectedFiles['partnerpanCard'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnerpanCard'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerpanCard'].push(
  //           this.selectedFiles['partnerpanCard'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['partneraadharCard'][index] &&
  //       this.selectedFiles['partneraadharCard'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['partneraadharCard'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partneraadharCard'].push(
  //           this.selectedFiles['partneraadharCard'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partneraadharCard'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partneraadharCard'].push(
  //           this.selectedFiles['partneraadharCard'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['partnerPhoto'][index] &&
  //       this.selectedFiles['partnerPhoto'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['partnerPhoto'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerPhoto'].push(
  //           this.selectedFiles['partnerPhoto'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['partnerPhoto'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerPhoto'].push(
  //           this.selectedFiles['partnerPhoto'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['partnervoterId'][index] &&
  //       this.selectedFiles['partnervoterId'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['partnervoterId'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnervoterId'].push(
  //           this.selectedFiles['partnervoterId'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnervoterId'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnervoterId'].push(
  //           this.selectedFiles['partnervoterId'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['partnerotherDocuments1'][index] &&
  //       this.selectedFiles['partnerotherDocuments1'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnerotherDocuments1'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerotherDocuments1'].push(
  //           this.selectedFiles['partnerotherDocuments1'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnerotherDocuments1'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerotherDocuments1'].push(
  //           this.selectedFiles['partnerotherDocuments1'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['partnerotherDocuments2'][index] &&
  //       this.selectedFiles['partnerotherDocuments2'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnerotherDocuments2'][index]['links'].length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerotherDocuments2'].push(
  //           this.selectedFiles['partnerotherDocuments2'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['partnerotherDocuments2'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.partnerKycs[index]['partnerotherDocuments2'].push(
  //           this.selectedFiles['partnerotherDocuments2'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     partnerKycs: this.partnerKycs,
  //   };
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Partners kycs Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveDirectorsKycs() {
  //   for (let index = 0; index < this.directorsKycs.length; index++) {
  //     // this.partnerKycs[index]['name'] = this.partnerKycs[index]['name'];
  //     // this.partnerKycs[index]['panNumber'] = this.partnerKycs[index]['panNumber'];
  //     this.directorsKycs[index]['directorpanCard'] = [];
  //     this.directorsKycs[index]['directoraadharCard'] = [];
  //     this.directorsKycs[index]['directorPhoto'] = [];
  //     this.directorsKycs[index]['directorvoterId'] = [];
  //     this.directorsKycs[index]['directorotherDocuments1'] = [];
  //     this.directorsKycs[index]['directorotherDocuments2'] = [];
  //     if (
  //       this.selectedFiles['directorpanCard'][index] &&
  //       this.selectedFiles['directorpanCard'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['directorpanCard'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorpanCard'].push(
  //           this.selectedFiles['directorpanCard'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorpanCard'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorpanCard'].push(
  //           this.selectedFiles['directorpanCard'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['directoraadharCard'][index] &&
  //       this.selectedFiles['directoraadharCard'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['directoraadharCard'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directoraadharCard'].push(
  //           this.selectedFiles['directoraadharCard'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directoraadharCard'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directoraadharCard'].push(
  //           this.selectedFiles['directoraadharCard'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['directorPhoto'][index] &&
  //       this.selectedFiles['directorPhoto'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['directorPhoto'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorPhoto'].push(
  //           this.selectedFiles['directorPhoto'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorPhoto'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorPhoto'].push(
  //           this.selectedFiles['directorPhoto'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['directorvoterId'][index] &&
  //       this.selectedFiles['directorvoterId'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['directorvoterId'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorvoterId'].push(
  //           this.selectedFiles['directorvoterId'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorvoterId'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorvoterId'].push(
  //           this.selectedFiles['directorvoterId'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['directorotherDocuments1'][index] &&
  //       this.selectedFiles['directorotherDocuments1'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorotherDocuments1'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorotherDocuments1'].push(
  //           this.selectedFiles['directorotherDocuments1'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorotherDocuments1'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorotherDocuments1'].push(
  //           this.selectedFiles['directorotherDocuments1'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //     if (
  //       this.selectedFiles['directorotherDocuments2'][index] &&
  //       this.selectedFiles['directorotherDocuments2'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorotherDocuments2'][index]['links'].length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorotherDocuments2'].push(
  //           this.selectedFiles['directorotherDocuments2'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['directorotherDocuments2'][index]['uploadedFiles']
  //           .length;
  //         i++
  //       ) {
  //         this.directorsKycs[index]['directorotherDocuments2'].push(
  //           this.selectedFiles['directorotherDocuments2'][index][
  //             'uploadedFiles'
  //           ][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     directorsKycs: this.directorsKycs,
  //   };
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Directors kycs Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveOtherAttachments() {
  //   let formData = {};
  //   formData['residenceProof'] = [];
  //   if (
  //     this.selectedFiles['residenceProof'] &&
  //     this.selectedFiles['residenceProof']['links']
  //   ) {
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['residenceProof']['links'].length;
  //       i++
  //     ) {
  //       formData['residenceProof'].push(
  //         this.selectedFiles['residenceProof']['links'][i]
  //       );
  //     }
  //     for (
  //       let i = 0;
  //       i < this.selectedFiles['residenceProof']['uploadedFiles'].length;
  //       i++
  //     ) {
  //       formData['residenceProof'].push(
  //         this.selectedFiles['residenceProof']['uploadedFiles'][i]
  //       );
  //     }
  //   }
  //   for (let index = 0; index < this.otherAttachments.length; index++) {
  //     this.otherAttachments[index]['otherAttachments'] = [];
  //     if (
  //       this.selectedFiles['otherAttachments'][index] &&
  //       this.selectedFiles['otherAttachments'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['otherAttachments'][index]['links'].length;
  //         i++
  //       ) {
  //         this.otherAttachments[index]['otherAttachments'].push(
  //           this.selectedFiles['otherAttachments'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i <
  //         this.selectedFiles['otherAttachments'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.otherAttachments[index]['otherAttachments'].push(
  //           this.selectedFiles['otherAttachments'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   formData['otherDocuments'] = this.otherAttachments;
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('Other Attachments Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveGstDetails() {
  //   for (let index = 0; index < this.gstDetails.length; index++) {
  //     this.gstDetails[index]['filingPeriod'] = this.moment(
  //       this.gstDetails[index]['filingPeriod']
  //     ).format('MM/DD/YYYY');
  //     this.gstDetails[index]['gstDetails'] = [];
  //     if (
  //       this.selectedFiles['gstDetails'][index] &&
  //       this.selectedFiles['gstDetails'][index]['links']
  //     ) {
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['gstDetails'][index]['links'].length;
  //         i++
  //       ) {
  //         this.gstDetails[index]['gstDetails'].push(
  //           this.selectedFiles['gstDetails'][index]['links'][i]
  //         );
  //       }
  //       for (
  //         let i = 0;
  //         i < this.selectedFiles['gstDetails'][index]['uploadedFiles'].length;
  //         i++
  //       ) {
  //         this.gstDetails[index]['gstDetails'].push(
  //           this.selectedFiles['gstDetails'][index]['uploadedFiles'][i]
  //         );
  //       }
  //     }
  //   }
  //   let formData = {
  //     gstDetails: this.gstDetails,
  //   };
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess('GST Details Saved Successfully');
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // saveExistingLoans() {
  //   for (let index = 0; index < this.existingLoans.length; index++) {
  //     this.existingLoans[index]['emiClosingDate'] = this.moment(
  //       this.existingLoans[index]['emiClosingDate']
  //     ).format('MM/DD/YYYY');
  //   }
  //   let formData = {
  //     existingLoans: this.existingLoans,
  //   };
  //   this.loading = true;
  //   this.leadsService.addLeadDocuments(this.leadId, formData).subscribe(
  //     (data: any) => {
  //       this.loading = false;
  //       this.toastService.showSuccess(
  //         'Existing Loan Details Saved Successfully'
  //       );
  //       this.getLeadDocumentsById(this.leadId);
  //     },
  //     (error) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // getLeadDocumentsById(leadId) {
  //   return new Promise((resolve, reject) => {
  //     this.leadsService.getLeadDocumentsById(leadId).subscribe(
  //       (leadDocuments: any) => {
  //         this.leadDocuments = leadDocuments;
  //         console.log(leadDocuments);
  //         resolve(true);
  //       },
  //       (error) => {
  //         resolve(false);
  //         this.toastService.showError(error);
  //       }
  //     );
  //   });
  // }
  // onActiveItemChange(event) {
  //   console.log(event);
  //   this.activeItem = event;
  // }
  // goToCibilScoreCheck() {
  //   window.open('https://consumer.experian.in/ECV-OLN/signIn', '_blank');
  // }
  // uploadFiles(fileType, acceptableTypes, index?) {
  //   let data = {
  //     acceptableTypes: acceptableTypes,
  //     files:
  //       index || index == 0
  //         ? this.selectedFiles[fileType][index]['filesData']
  //         : this.selectedFiles[fileType]['filesData'],
  //     uploadedFiles:
  //       index || index == 0
  //         ? this.selectedFiles[fileType][index]['uploadedFiles']
  //         : this.selectedFiles[fileType]['uploadedFiles'],
  //   };
  //   let fileUploadRef = this.dialogService.open(FileUploadComponent, {
  //     header: 'Select Files',
  //     width: '90%',
  //     contentStyle: { 'max-height': '500px', overflow: 'auto' },
  //     baseZIndex: 10000,
  //     data: data,
  //   });
  //   fileUploadRef.onClose.subscribe((files: any) => {
  //     if (files) {
  //       this.saveFiles(files, fileType, index);
  //     }
  //   });
  // }
  // saveFiles(files, fileType, index) {
  //   this.loading = true;
  //   if (files && files.length > 0) {
  //     const formData = new FormData();
  //     for (let file of files) {
  //       if (file && !file['fileuploaded']) {
  //         formData.append('files', file);
  //       }
  //     }
  //     console.log(formData);
  //     this.leadsService.uploadFiles(formData, this.leadId, fileType).subscribe(
  //       (response: any) => {
  //         if (response && response['links'] && response['links'].length > 0) {
  //           for (let i = 0; i < response['links'].length; i++) {
  //             index || index == 0
  //               ? this.selectedFiles[fileType][index]['links'].push(
  //                   response['links'][i]
  //                 )
  //               : this.selectedFiles[fileType]['links'].push(
  //                   response['links'][i]
  //                 );
  //           }
  //           for (let i = 0; i < files.length; i++) {
  //             files[i]['fileuploaded'] = true;
  //             index || index == 0
  //               ? this.selectedFiles[fileType][index]['filesData'].push(
  //                   files[i]
  //                 )
  //               : this.selectedFiles[fileType]['filesData'].push(files[i]);
  //           }
  //           console.log(
  //             'this.selectedFiles',
  //             this.selectedFiles[fileType],
  //             files
  //           );
  //           this.toastService.showSuccess('Files Uploaded Successfully');
  //         } else {
  //           this.toastService.showError({ error: 'Something went wrong' });
  //         }
  //         this.loading = false;
  //       },
  //       (error: any) => {
  //         this.loading = false;
  //         this.toastService.showError(error);
  //       }
  //     );
  //   }
  // }
  // confirmDelete(file, controlName, docIndex?, fileIndex?) {
  //   console.log('Before Deletion:', this.selectedFiles);
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this File?',
  //     header: 'Confirm Deletion',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.deleteFile(file, controlName, docIndex, fileIndex);
  //     },
  //   });
  // }
  // deleteFile(
  //   fileUrl: string,
  //   fileType: string,
  //   docIndex?: number,
  //   fileIndex?: number
  // ) {
  //   const relativePath = fileUrl.substring(fileUrl.indexOf('/uploads'));
  //   this.leadsService.deleteFile(relativePath).subscribe(
  //     (response: any) => {
  //       if (response.message === 'File deleted successfully.') {
  //         console.log('File deleted successfully.');
  //         if (this.selectedFiles[fileType]?.uploadedFiles) {
  //           this.selectedFiles[fileType].uploadedFiles = this.selectedFiles[
  //             fileType
  //           ].uploadedFiles.filter((f: string) => f !== fileUrl);
  //           console.log('After Deletion:', this.selectedFiles);
  //         } else if (Array.isArray(this.selectedFiles[fileType])) {
  //           if (docIndex !== undefined && fileIndex !== undefined) {
  //             const document = this.selectedFiles[fileType][docIndex];
  //             if (Array.isArray(document?.uploadedFiles)) {
  //               document.uploadedFiles.splice(fileIndex, 1);
  //               console.log(
  //                 `After Deletion from ${fileType}[${docIndex}]:`,
  //                 document.uploadedFiles
  //               );
  //             }
  //             console.log('After Deletion:', this.selectedFiles);
  //           } else {
  //             console.error('docIndex or fileIndex is missing.');
  //           }
  //         } else {
  //           console.error(
  //             'No uploaded files found for the specified file type.'
  //           );
  //         }
  //         this.toastService.showSuccess('File Deleted Successfully');
  //       } else {
  //         console.error('Error deleting file:', response.error);
  //         this.toastService.showError(response);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error deleting file:', error);
  //       this.toastService.showError(
  //         'Failed to delete file. Please try again later.'
  //       );
  //     }
  //   );
  // }
  // getFileIcon(fileType) {
  //   //console.log(fileType)
  //   return this.leadsService.getFileIcon(fileType);
  // }
  // goBack(): void {
  //   this.location.back();
  // }
}
