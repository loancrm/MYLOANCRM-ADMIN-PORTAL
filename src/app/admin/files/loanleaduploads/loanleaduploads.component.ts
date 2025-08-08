import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-loanleaduploads',
  templateUrl: './loanleaduploads.component.html',
  styleUrl: './loanleaduploads.component.scss',
})
export class LoanleaduploadsComponent implements OnInit {
  moment: any;
  leadId: any;
  displayedItems: any = [];
  items: any;
  loading: any;
  activeItem: any;
  contactPerson: any;
  aadharNumber: any;
  coApplicantRelation: any;
  coApplicantName: any;
  capabilities: any;
  cibilScore: any;
  companyName: any;
  panNumber: any;
  loanleads: any;
  userDetails: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  breadCrumbItems: any = [];
  selectedFiles: any = {
    panCard: { filesData: [], links: [], uploadedFiles: [] },
    gstCertificate: { filesData: [], links: [], uploadedFiles: [] },
    aadharCard: { filesData: [], links: [], uploadedFiles: [] },
    photo: { filesData: [], links: [], uploadedFiles: [] },
    voterId: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantPancard: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantAadharcard: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantPhoto: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantVoterId: { filesData: [], links: [], uploadedFiles: [] },
    cibilReport: { filesData: [], links: [], uploadedFiles: [] },
    companyId: { filesData: [], links: [], uploadedFiles: [] },
    paySlips: [{ filesData: [], links: [], uploadedFiles: [] }],
    bankStatements: [{ filesData: [], links: [], uploadedFiles: [] }],
    residenceProof: { filesData: [], links: [], uploadedFiles: [] },
    otherDocuments: [{ filesData: [], links: [], uploadedFiles: [] }],
    saleDeed: { filesData: [], links: [], uploadedFiles: [] },
    saleAgreement: { filesData: [], links: [], uploadedFiles: [] },
    presentIncomeReturns: [{ filesData: [], links: [], uploadedFiles: [] }],
    pastIncomeReturns: [{ filesData: [], links: [], uploadedFiles: [] }],
    gstDetails: [{ filesData: [], links: [], uploadedFiles: [] }],
    coApplicantCibilReport: [{ filesData: [], links: [], uploadedFiles: [] }],
    partnerpanCard: [{ filesData: [], links: [], uploadedFiles: [] }],
    partneraadharCard: [{ filesData: [], links: [], uploadedFiles: [] }],
    partnerPhoto: [{ filesData: [], links: [], uploadedFiles: [] }],
    partnervoterId: [{ filesData: [], links: [], uploadedFiles: [] }],
    partnerCibilReport: [{ filesData: [], links: [], uploadedFiles: [] }],
    directorCibilReport: [{ filesData: [], links: [], uploadedFiles: [] }],
    directorpanCard: [{ filesData: [], links: [], uploadedFiles: [] }],
    directoraadharCard: [{ filesData: [], links: [], uploadedFiles: [] }],
    directorPhoto: [{ filesData: [], links: [], uploadedFiles: [] }],
    directorvoterId: [{ filesData: [], links: [], uploadedFiles: [] }],
  };
  paySlips: any = [
    {
      date: '',
      salary: '',
      paySlips: [],
    },
  ];
  existingLoans: any = [
    {
      bankName: '',
      loanType: '',
      emiAmount: '',
      emiClosingDate: '',
    },
  ];
  bankStatements: any = [
    {
      name: '',
      accountType: '',
      from: '',
      to: '',
      bankStatements: [],
    },
  ];
  otherDocuments: any = [
    {
      name: '',
      otherDocuments: [],
    },
  ];
  partnerCibil: any = [
    {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      cibilScore: '',
      partnerCibilReport: [],
    },
  ];
  financialReturns: any = [
    {
      pastIncomeTax: '',
      pastIncomeReturns: [],
      presentIncomeTax: '',
      presentIncomeReturns: [],
    },
  ];
  partnerKycs: any = [
    {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      partnerpanCard: [],
      partneraadharCard: [],
      partnerPhoto: [],
      partnervoterId: [],
      // partnerdocName1: '',
      // partnerotherDocuments1: [],
      // partnerdocName2: '',
      // partnerotherDocuments2: [],
    },
  ];
  gstDetails: any = [
    {
      operatingState: '',
      filingPeriod: '',
      gst3BSale: '',
      gstDetails: [],
    },
  ];
  directorsKycs: any = [
    {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      directorpanCard: [],
      directoraadharCard: [],
      directorPhoto: [],
      directorvoterId: [],
      // directordocName1: '',
      // directorotherDocuments1: [],
      // directordocName2: '',
      // directorotherDocuments2: [],
    },
  ];
  coApplicantCibil: any = [
    {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      cibilScore: '',
      coApplicantCibilReport: [],
    },
  ];
  directorCibil: any = [
    {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      cibilScore: '',
      directorCibilReport: [],
    },
  ];
  constructor(
    private location: Location,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.leadId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLoanLeadById(this.leadId).then((data) => {
        if (data) {
          this.setLeadDocumentsData();
          this.updateItemsBasedOnCondition();
        }
      });
    }
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Files',
        routerLink: '/user/files',
        queryParams: { v: this.version },
      },
      { label: 'Upload Documents' },
    ];
  }
  ngOnInit() {
    this.capabilities = this.leadsService.getUserRbac();
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
  }
  updateItemsBasedOnCondition() {
    const currentActiveName = this.activeItem?.name;
    const { loanType, employmentStatus } = this.loanleads[0];
    this.items = [
      { label: 'KYCs', name: 'kycs' },
      { label: 'Cibil', name: 'cibil' },
      { label: 'Bank Statements', name: 'bankStatements' },
      { label: 'Existing Loans', name: 'existingLoans' },
      { label: 'Other Details', name: 'otherDetails' },
    ];
    const isEmployed = employmentStatus === 'employed';
    const isSelfEmployed = employmentStatus === 'self-employed';
    const isHomeOrLap = loanType === 'homeLoan' || loanType === 'lap';
    if (isEmployed && (loanType === 'homeLoan' || loanType === 'lap')) {
      this.items.push({ label: 'Sale Details', name: 'saledetails' });
    }
    if (isEmployed && (loanType === 'personalLoan' || isHomeOrLap)) {
      this.items.push({ label: 'Company Details', name: 'companydetails' });
    }
    if (isSelfEmployed && isHomeOrLap) {
      this.items.push(
        { label: 'Financials', name: 'financials' },
        { label: 'GST', name: 'gst' },
        { label: 'Sale Details', name: 'saledetails' }
      );
    }
    // this.activeItem = this.items[0];

    // Try to restore previously active tab if still exists
    const matchedTab = this.items.find(item => item.name === currentActiveName);
    this.activeItem = matchedTab || this.items[0];
  }
  onActiveItemChange(event) {
    // console.log(event);
    this.activeItem = event;
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.loanleads && this.loanleads[0]?.employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      { data: this.loanleads, displayProperty: loanDisplayProperty },
    ];
  }
  addDirectorsCibilRow() {
    let data = {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      cibilScore: '',
      directorCibilReport: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };

    this.directorCibil.push(data);
    this.selectedFiles.directorCibilReport.push(fileData);
  }
  deleteDirectorsCibilRow(index) {
    this.directorCibil.splice(index, 1);
    this.selectedFiles.directorCibilReport.splice(index, 1);
  }

  saveDirectorsCibil() {
    for (let index = 0; index < this.directorCibil.length; index++) {
      this.directorCibil[index]['directorCibilReport'] = [];
      if (
        this.selectedFiles['directorCibilReport'][index] &&
        this.selectedFiles['directorCibilReport'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['directorCibilReport'][index]['links'].length;
          i++
        ) {
          this.directorCibil[index]['directorCibilReport'].push(
            this.selectedFiles['directorCibilReport'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['directorCibilReport'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.directorCibil[index]['directorCibilReport'].push(
            this.selectedFiles['directorCibilReport'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      directorCibil: this.directorCibil,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Directors  cibil Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveDirectorsKycs() {
    for (let index = 0; index < this.directorsKycs.length; index++) {
      this.directorsKycs[index]['directorpanCard'] = [];
      this.directorsKycs[index]['directoraadharCard'] = [];
      this.directorsKycs[index]['directorPhoto'] = [];
      this.directorsKycs[index]['directorvoterId'] = [];
      // this.directorsKycs[index]['directorotherDocuments1'] = [];
      // this.directorsKycs[index]['directorotherDocuments2'] = [];
      if (
        this.selectedFiles['directorpanCard'][index] &&
        this.selectedFiles['directorpanCard'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['directorpanCard'][index]['links'].length;
          i++
        ) {
          this.directorsKycs[index]['directorpanCard'].push(
            this.selectedFiles['directorpanCard'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['directorpanCard'][index]['uploadedFiles'].length;
          i++
        ) {
          this.directorsKycs[index]['directorpanCard'].push(
            this.selectedFiles['directorpanCard'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['directoraadharCard'][index] &&
        this.selectedFiles['directoraadharCard'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['directoraadharCard'][index]['links'].length;
          i++
        ) {
          this.directorsKycs[index]['directoraadharCard'].push(
            this.selectedFiles['directoraadharCard'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['directoraadharCard'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.directorsKycs[index]['directoraadharCard'].push(
            this.selectedFiles['directoraadharCard'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['directorPhoto'][index] &&
        this.selectedFiles['directorPhoto'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['directorPhoto'][index]['links'].length;
          i++
        ) {
          this.directorsKycs[index]['directorPhoto'].push(
            this.selectedFiles['directorPhoto'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['directorPhoto'][index]['uploadedFiles'].length;
          i++
        ) {
          this.directorsKycs[index]['directorPhoto'].push(
            this.selectedFiles['directorPhoto'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['directorvoterId'][index] &&
        this.selectedFiles['directorvoterId'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['directorvoterId'][index]['links'].length;
          i++
        ) {
          this.directorsKycs[index]['directorvoterId'].push(
            this.selectedFiles['directorvoterId'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['directorvoterId'][index]['uploadedFiles'].length;
          i++
        ) {
          this.directorsKycs[index]['directorvoterId'].push(
            this.selectedFiles['directorvoterId'][index]['uploadedFiles'][i]
          );
        }
      }
      // if (
      //   this.selectedFiles['directorotherDocuments1'][index] &&
      //   this.selectedFiles['directorotherDocuments1'][index]['links']
      // ) {
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['directorotherDocuments1'][index]['links'].length;
      //     i++
      //   ) {
      //     this.directorsKycs[index]['directorotherDocuments1'].push(
      //       this.selectedFiles['directorotherDocuments1'][index]['links'][i]
      //     );
      //   }
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['directorotherDocuments1'][index]['uploadedFiles']
      //       .length;
      //     i++
      //   ) {
      //     this.directorsKycs[index]['directorotherDocuments1'].push(
      //       this.selectedFiles['directorotherDocuments1'][index][
      //       'uploadedFiles'
      //       ][i]
      //     );
      //   }
      // }
      // if (
      //   this.selectedFiles['directorotherDocuments2'][index] &&
      //   this.selectedFiles['directorotherDocuments2'][index]['links']
      // ) {
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['directorotherDocuments2'][index]['links'].length;
      //     i++
      //   ) {
      //     this.directorsKycs[index]['directorotherDocuments2'].push(
      //       this.selectedFiles['directorotherDocuments2'][index]['links'][i]
      //     );
      //   }
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['directorotherDocuments2'][index]['uploadedFiles']
      //       .length;
      //     i++
      //   ) {
      //     this.directorsKycs[index]['directorotherDocuments2'].push(
      //       this.selectedFiles['directorotherDocuments2'][index][
      //       'uploadedFiles'
      //       ][i]
      //     );
      //   }
      // }
    }
    let formData = {
      directorsKycs: this.directorsKycs,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Directors kycs Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  deleteDirectorsKycsRow(index) {
    this.directorsKycs.splice(index, 1);
    this.selectedFiles.directorpanCard.splice(index, 1);
    this.selectedFiles.directoraadharCard.splice(index, 1);
    this.selectedFiles.directorPhoto.splice(index, 1);
    this.selectedFiles.directorvoterId.splice(index, 1);
    // this.selectedFiles.directorotherDocuments1.splice(index, 1);
    // this.selectedFiles.directorotherDocuments2.splice(index, 1);
  }
  addDirectorsKycsRow() {
    let data = {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      directorpanCard: [],
      directoraadharCard: [],
      directorPhoto: [],
      directorvoterId: [],
      // directordocName1: '',
      // directorotherDocuments1: [],
      // directordocName2: '',
      // directorotherDocuments2: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    let fileData1 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData2 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData3 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData4 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData5 = { filesData: [], links: [], uploadedFiles: [] };
    this.directorsKycs.push(data);
    this.selectedFiles.directorpanCard.push(fileData);
    this.selectedFiles.directoraadharCard.push(fileData1);
    this.selectedFiles.directorPhoto.push(fileData2);
    this.selectedFiles.directorvoterId.push(fileData3);
    // this.selectedFiles.directorotherDocuments1.push(fileData4);
    // this.selectedFiles.directorotherDocuments2.push(fileData5);
  }
  getLoanLeadById(leadId) {
    return new Promise((resolve, reject) => {
      this.leadsService.getLoanLeadById(leadId).subscribe(
        (response: any) => {
          this.loanleads = response;
          console.log(this.loanleads);
          this.updateItemsBasedOnCondition();
          this.updateDisplayedItems();
          resolve(true);
        },
        (error) => {
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }
  addPartnersCibilRow() {
    let data = {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      cibilScore: '',
      partnerCibilReport: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };

    this.partnerCibil.push(data);
    this.selectedFiles.partnerCibilReport.push(fileData);
  }
  goToCibilScoreCheck() {
    window.open('https://consumer.experian.in/ECV-OLN/signIn', '_blank');
  }
  confirmDelete(file, controlName, docIndex?, fileIndex?) {
    // console.log('Before Deletion:', this.selectedFiles);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this File?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFile(file, controlName, docIndex, fileIndex);
      },
    });
  }
  deleteFile(
    fileUrl: string,
    fileType: string,
    docIndex?: number,
    fileIndex?: number
  ) {
    const relativePath = fileUrl.substring(fileUrl.indexOf('/uploads'));
    this.leadsService.deleteFile(relativePath).subscribe(
      (response: any) => {
        if (response.message === 'File deleted successfully.') {
          // console.log('File deleted successfully.');
          if (this.selectedFiles[fileType]?.uploadedFiles) {
            this.selectedFiles[fileType].uploadedFiles = this.selectedFiles[
              fileType
            ].uploadedFiles.filter((f: string) => f !== fileUrl);
            // console.log('After Deletion:', this.selectedFiles);
          } else if (Array.isArray(this.selectedFiles[fileType])) {
            if (docIndex !== undefined && fileIndex !== undefined) {
              const document = this.selectedFiles[fileType][docIndex];
              if (Array.isArray(document?.uploadedFiles)) {
                document.uploadedFiles.splice(fileIndex, 1);
                // console.log(
                //   `After Deletion from ${fileType}[${docIndex}]:`,
                //   document.uploadedFiles
                // );
              }
              // console.log('After Deletion:', this.selectedFiles);
            } else {
              console.error('docIndex or fileIndex is missing.');
            }
          } else {
            console.error(
              'No uploaded files found for the specified file type.'
            );
          }
          this.toastService.showSuccess('File Deleted Successfully');
        } else {
          console.error('Error deleting file:', response.error);
          this.toastService.showError(response);
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
        this.toastService.showError(
          'Failed to delete file. Please try again later.'
        );
      }
    );
  }
  setLeadDocumentsData() {
    this.contactPerson = this.loanleads[0].contactPerson || '';
    this.aadharNumber = this.loanleads[0].aadharNumber || '';
    this.coApplicantName = this.loanleads[0].coApplicantName || '';
    this.coApplicantRelation = this.loanleads[0].coApplicantRelation || '';
    this.panNumber = this.loanleads[0].panNumber || '';
    this.cibilScore = this.loanleads[0].cibilScore || '';
    this.companyName = this.loanleads[0].companyName || '';
    if (this.loanleads[0].panCard) {
      this.selectedFiles['panCard']['uploadedFiles'] =
        this.loanleads[0].panCard;
    }
    if (this.loanleads[0].aadharCard) {
      this.selectedFiles['aadharCard']['uploadedFiles'] =
        this.loanleads[0].aadharCard;
    }
    if (this.loanleads[0].photo) {
      this.selectedFiles['photo']['uploadedFiles'] = this.loanleads[0].photo;
    }
    if (this.loanleads[0].voterId) {
      this.selectedFiles['voterId']['uploadedFiles'] =
        this.loanleads[0].voterId;
    }
    if (this.loanleads[0].coApplicantPancard) {
      this.selectedFiles['coApplicantPancard']['uploadedFiles'] =
        this.loanleads[0].coApplicantPancard;
    }
    if (this.loanleads[0].coApplicantAadharcard) {
      this.selectedFiles['coApplicantAadharcard']['uploadedFiles'] =
        this.loanleads[0].coApplicantAadharcard;
    }
    if (this.loanleads[0].coApplicantPhoto) {
      this.selectedFiles['coApplicantPhoto']['uploadedFiles'] =
        this.loanleads[0].coApplicantPhoto;
    }
    if (this.loanleads[0].coApplicantVoterId) {
      this.selectedFiles['coApplicantVoterId']['uploadedFiles'] =
        this.loanleads[0].coApplicantVoterId;
    }
    if (this.loanleads[0].cibilReport) {
      this.selectedFiles['cibilReport']['uploadedFiles'] =
        this.loanleads[0].cibilReport;
    }
    if (this.loanleads[0].companyId) {
      this.selectedFiles['companyId']['uploadedFiles'] =
        this.loanleads[0].companyId;
    }
    if (this.loanleads[0].gstCertificate) {
      this.selectedFiles['gstCertificate']['uploadedFiles'] =
        this.loanleads[0].gstCertificate;
    }
    if (this.loanleads[0].paySlips && this.loanleads[0].paySlips.length > 0) {
      this.paySlips = [];
      this.selectedFiles['paySlips'] = [];
      this.loanleads[0].paySlips.forEach((statement, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['paySlips'],
        };
        this.selectedFiles['paySlips'].push(fileData);
        this.paySlips.push(statement);
      });
    }
    if (
      this.loanleads[0].coApplicantCibil &&
      this.loanleads[0].coApplicantCibil.length > 0
    ) {
      this.coApplicantCibil = [];
      this.selectedFiles['coApplicantCibilReport'] = [];
      this.loanleads[0].coApplicantCibil.forEach((statement, index) => {
        statement['name'] = statement['name'];
        statement['panNumber'] = statement['panNumber'];
        statement['aadharNumber'] = statement['aadharNumber'];
        statement['mobileNumber'] = statement['mobileNumber'];
        statement['cibilScore'] = statement['cibilScore'];

        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['coApplicantCibilReport'],
        };

        this.selectedFiles['coApplicantCibilReport'].push(fileData);
        this.coApplicantCibil.push(statement);
      });
    }
    if (
      this.loanleads[0].bankStatements &&
      this.loanleads[0].bankStatements.length > 0
    ) {
      this.bankStatements = [];
      this.selectedFiles['bankStatements'] = [];
      this.loanleads[0].bankStatements.forEach((statement, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['bankStatements'],
        };
        this.selectedFiles['bankStatements'].push(fileData);
        this.bankStatements.push(statement);
      });
    }
    if (
      this.loanleads[0].partnerCibil &&
      this.loanleads[0].partnerCibil.length > 0
    ) {
      this.partnerCibil = [];
      this.selectedFiles['partnerCibilReport'] = [];
      this.loanleads[0].partnerCibil.forEach((statement, index) => {
        statement['name'] = statement['name'];
        statement['panNumber'] = statement['panNumber'];
        statement['aadharNumber'] = statement['aadharNumber'];
        statement['mobileNumber'] = statement['mobileNumber'];
        statement['cibilScore'] = statement['cibilScore'];

        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['partnerCibilReport'],
        };

        this.selectedFiles['partnerCibilReport'].push(fileData);
        this.partnerCibil.push(statement);
      });
    }
    if (
      this.loanleads[0].directorsKycs &&
      this.loanleads[0].directorsKycs.length > 0
    ) {
      this.directorsKycs = [];
      this.selectedFiles['directorpanCard'] = [];
      this.selectedFiles['directoraadharCard'] = [];
      this.selectedFiles['directorPhoto'] = [];
      this.selectedFiles['directorvoterId'] = [];
      // this.selectedFiles['directorotherDocuments1'] = [];
      // this.selectedFiles['directorotherDocuments2'] = [];

      this.loanleads[0].directorsKycs.forEach((statement, index) => {
        statement['name'] = statement['name'];
        statement['panNumber'] = statement['panNumber'];
        statement['aadharNumber'] = statement['aadharNumber'];
        statement['mobileNumber'] = statement['mobileNumber'];
        // statement['directordocName1'] = statement['directordocName1'];
        // statement['directordocName2'] = statement['directordocName2'];

        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['directorpanCard'],
        };
        let fileData1 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['directoraadharCard'],
        };
        let fileData2 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['directorPhoto'],
        };
        let fileData3 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['directorvoterId'],
        };
        // let fileData4 = {
        //   filesData: [],
        //   links: [],
        //   uploadedFiles: statement['directorotherDocuments1'],
        // };
        // let fileData5 = {
        //   filesData: [],
        //   links: [],
        //   uploadedFiles: statement['directorotherDocuments2'],
        // };

        this.selectedFiles['directorpanCard'].push(fileData);
        this.selectedFiles['directoraadharCard'].push(fileData1);
        this.selectedFiles['directorPhoto'].push(fileData2);
        this.selectedFiles['directorvoterId'].push(fileData3);
        // this.selectedFiles['directorotherDocuments1'].push(fileData4);
        // this.selectedFiles['directorotherDocuments2'].push(fileData5);
        this.directorsKycs.push(statement);
      });
    }
    if (
      this.loanleads[0].directorCibil &&
      this.loanleads[0].directorCibil.length > 0
    ) {
      this.directorCibil = [];
      this.selectedFiles['directorCibilReport'] = [];

      this.loanleads[0].directorCibil.forEach((statement, index) => {
        statement['name'] = statement['name'];
        statement['panNumdirectorCibilReportber'] = statement['panNumber'];
        statement['aadharNumber'] = statement['aadharNumber'];
        statement['mobileNumber'] = statement['mobileNumber'];
        statement['cibilScore'] = statement['cibilScore'];

        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['directorCibilReport'],
        };

        this.selectedFiles['directorCibilReport'].push(fileData);
        this.directorCibil.push(statement);
      });
    }
    if (
      this.loanleads[0].partnerKycs &&
      this.loanleads[0].partnerKycs.length > 0
    ) {
      this.partnerKycs = [];
      this.selectedFiles['partnerpanCard'] = [];
      this.selectedFiles['partneraadharCard'] = [];
      this.selectedFiles['partnerPhoto'] = [];
      this.selectedFiles['partnervoterId'] = [];
      // this.selectedFiles['partnerotherDocuments1'] = [];
      // this.selectedFiles['partnerotherDocuments2'] = [];

      this.loanleads[0].partnerKycs.forEach((statement, index) => {
        statement['name'] = statement['name'];
        statement['panNumber'] = statement['panNumber'];
        statement['aadharNumber'] = statement['aadharNumber'];
        statement['mobileNumber'] = statement['mobileNumber'];
        // statement['partnerdocName1'] = statement['partnerdocName1'];
        // statement['partnerdocName2'] = statement['partnerdocName2'];

        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['partnerpanCard'],
        };
        let fileData1 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['partneraadharCard'],
        };
        let fileData2 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['partnerPhoto'],
        };
        let fileData3 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['partnervoterId'],
        };
        // let fileData4 = {
        //   filesData: [],
        //   links: [],
        //   uploadedFiles: statement['partnerotherDocuments1'],
        // };
        // let fileData5 = {
        //   filesData: [],
        //   links: [],
        //   uploadedFiles: statement['partnerotherDocuments2'],
        // };
        this.selectedFiles['partnerpanCard'].push(fileData);
        this.selectedFiles['partneraadharCard'].push(fileData1);
        this.selectedFiles['partnerPhoto'].push(fileData2);
        this.selectedFiles['partnervoterId'].push(fileData3);
        // this.selectedFiles['partnerotherDocuments1'].push(fileData4);
        // this.selectedFiles['partnerotherDocuments2'].push(fileData5);
        this.partnerKycs.push(statement);
      });
    }

    if (
      this.loanleads[0].existingLoans &&
      this.loanleads[0].existingLoans.length > 0
    ) {
      this.existingLoans = [];
      this.loanleads[0].existingLoans.forEach((loans, index) => {
        this.existingLoans.push(loans);
      });
    }
    if (this.loanleads[0].residenceProof) {
      this.selectedFiles['residenceProof']['uploadedFiles'] =
        this.loanleads[0].residenceProof;
    }
    if (
      this.loanleads[0].otherDocuments &&
      this.loanleads[0].otherDocuments.length > 0
    ) {
      this.otherDocuments = [];
      this.selectedFiles['otherDocuments'] = [];
      this.loanleads[0].otherDocuments.forEach((statement, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['otherDocuments'],
        };
        this.selectedFiles['otherDocuments'].push(fileData);
        this.otherDocuments.push(statement);
      });
    }
    if (this.loanleads[0].saleDeed) {
      this.selectedFiles['saleDeed']['uploadedFiles'] =
        this.loanleads[0].saleDeed;
    }
    if (this.loanleads[0].saleAgreement) {
      this.selectedFiles['saleAgreement']['uploadedFiles'] =
        this.loanleads[0].saleAgreement;
    }
    if (
      this.loanleads[0].financialReturns &&
      this.loanleads[0].financialReturns.length > 0
    ) {
      this.financialReturns = [];
      this.selectedFiles['pastIncomeReturns'] = [];
      this.selectedFiles['presentIncomeReturns'] = [];
      this.loanleads[0].financialReturns.forEach((statement, index) => {
        statement['pastIncomeTax'] = statement['pastIncomeTax'];
        statement['presentIncomeTax'] = statement['presentIncomeTax'];
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['pastIncomeReturns'],
        };
        let fileData4 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['presentIncomeReturns'],
        };
        this.selectedFiles['pastIncomeReturns'].push(fileData);
        this.selectedFiles['presentIncomeReturns'].push(fileData4);
        this.financialReturns.push(statement);
      });
    }
    if (
      this.loanleads[0].gstDetails &&
      this.loanleads[0].gstDetails.length > 0
    ) {
      this.gstDetails = [];
      this.selectedFiles['gstDetails'] = [];
      this.loanleads[0].gstDetails.forEach((gst, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: gst['gstDetails'],
        };
        this.selectedFiles['gstDetails'].push(fileData);
        this.gstDetails.push(gst);
      });
    }
  }

  addPartnersKycsRow() {
    let data = {
      name: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      partnerpanCard: [],
      partneraadharCard: [],
      partnerPhoto: [],
      partnervoterId: [],
      // partnerdocName1: '',
      // partnerotherDocuments1: [],
      // partnerdocName2: '',
      // partnerotherDocuments2: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    let fileData1 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData2 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData3 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData4 = { filesData: [], links: [], uploadedFiles: [] };
    let fileData5 = { filesData: [], links: [], uploadedFiles: [] };
    this.partnerKycs.push(data);
    this.selectedFiles.partnerpanCard.push(fileData);
    this.selectedFiles.partneraadharCard.push(fileData1);
    this.selectedFiles.partnerPhoto.push(fileData2);
    this.selectedFiles.partnervoterId.push(fileData3);
    // this.selectedFiles.partnerotherDocuments1.push(fileData4);
    // this.selectedFiles.partnerotherDocuments2.push(fileData5);
  }
  addPayslipsRow() {
    let data = {
      date: '',
      salary: '',
      paySlips: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.paySlips.push(data);
    this.selectedFiles.paySlips.push(fileData);
  }
  savePartnersKycs() {
    for (let index = 0; index < this.partnerKycs.length; index++) {
      this.partnerKycs[index]['partnerpanCard'] = [];
      this.partnerKycs[index]['partneraadharCard'] = [];
      this.partnerKycs[index]['partnerPhoto'] = [];
      this.partnerKycs[index]['partnervoterId'] = [];
      // this.partnerKycs[index]['partnerotherDocuments1'] = [];
      // this.partnerKycs[index]['partnerotherDocuments2'] = [];
      if (
        this.selectedFiles['partnerpanCard'][index] &&
        this.selectedFiles['partnerpanCard'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['partnerpanCard'][index]['links'].length;
          i++
        ) {
          this.partnerKycs[index]['partnerpanCard'].push(
            this.selectedFiles['partnerpanCard'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['partnerpanCard'][index]['uploadedFiles'].length;
          i++
        ) {
          this.partnerKycs[index]['partnerpanCard'].push(
            this.selectedFiles['partnerpanCard'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['partneraadharCard'][index] &&
        this.selectedFiles['partneraadharCard'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['partneraadharCard'][index]['links'].length;
          i++
        ) {
          this.partnerKycs[index]['partneraadharCard'].push(
            this.selectedFiles['partneraadharCard'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['partneraadharCard'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.partnerKycs[index]['partneraadharCard'].push(
            this.selectedFiles['partneraadharCard'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['partnerPhoto'][index] &&
        this.selectedFiles['partnerPhoto'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['partnerPhoto'][index]['links'].length;
          i++
        ) {
          this.partnerKycs[index]['partnerPhoto'].push(
            this.selectedFiles['partnerPhoto'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i < this.selectedFiles['partnerPhoto'][index]['uploadedFiles'].length;
          i++
        ) {
          this.partnerKycs[index]['partnerPhoto'].push(
            this.selectedFiles['partnerPhoto'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['partnervoterId'][index] &&
        this.selectedFiles['partnervoterId'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['partnervoterId'][index]['links'].length;
          i++
        ) {
          this.partnerKycs[index]['partnervoterId'].push(
            this.selectedFiles['partnervoterId'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['partnervoterId'][index]['uploadedFiles'].length;
          i++
        ) {
          this.partnerKycs[index]['partnervoterId'].push(
            this.selectedFiles['partnervoterId'][index]['uploadedFiles'][i]
          );
        }
      }
      // if (
      //   this.selectedFiles['partnerotherDocuments1'][index] &&
      //   this.selectedFiles['partnerotherDocuments1'][index]['links']
      // ) {
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['partnerotherDocuments1'][index]['links'].length;
      //     i++
      //   ) {
      //     this.partnerKycs[index]['partnerotherDocuments1'].push(
      //       this.selectedFiles['partnerotherDocuments1'][index]['links'][i]
      //     );
      //   }
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['partnerotherDocuments1'][index]['uploadedFiles']
      //       .length;
      //     i++
      //   ) {
      //     this.partnerKycs[index]['partnerotherDocuments1'].push(
      //       this.selectedFiles['partnerotherDocuments1'][index][
      //       'uploadedFiles'
      //       ][i]
      //     );
      //   }
      // }
      // if (
      //   this.selectedFiles['partnerotherDocuments2'][index] &&
      //   this.selectedFiles['partnerotherDocuments2'][index]['links']
      // ) {
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['partnerotherDocuments2'][index]['links'].length;
      //     i++
      //   ) {
      //     this.partnerKycs[index]['partnerotherDocuments2'].push(
      //       this.selectedFiles['partnerotherDocuments2'][index]['links'][i]
      //     );
      //   }
      //   for (
      //     let i = 0;
      //     i <
      //     this.selectedFiles['partnerotherDocuments2'][index]['uploadedFiles']
      //       .length;
      //     i++
      //   ) {
      //     this.partnerKycs[index]['partnerotherDocuments2'].push(
      //       this.selectedFiles['partnerotherDocuments2'][index][
      //       'uploadedFiles'
      //       ][i]
      //     );
      //   }
      // }
    }
    let formData = {
      partnerKycs: this.partnerKycs,
    };

    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Partners kycs Saved Successfully');
        this.getLoanLeadById(this.leadId)
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  addBankStatementsRow() {
    let data = {
      name: '',
      accountType: '',
      from: '',
      to: '',
      bankStatements: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.bankStatements.push(data);
    this.selectedFiles.bankStatements.push(fileData);
  }
  savePartnersCibil() {
    for (let index = 0; index < this.partnerCibil.length; index++) {
      this.partnerCibil[index]['partnerCibilReport'] = [];

      if (
        this.selectedFiles['partnerCibilReport'][index] &&
        this.selectedFiles['partnerCibilReport'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['partnerCibilReport'][index]['links'].length;
          i++
        ) {
          this.partnerCibil[index]['partnerCibilReport'].push(
            this.selectedFiles['partnerCibilReport'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['partnerCibilReport'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.partnerCibil[index]['partnerCibilReport'].push(
            this.selectedFiles['partnerCibilReport'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      partnerCibil: this.partnerCibil,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Partners cibil Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  deletePartnersCibilRow(index) {
    this.partnerCibil.splice(index, 1);
    this.selectedFiles.partnerCibilReport.splice(index, 1);
  }
  deletePartnersKycsRow(index) {
    this.partnerKycs.splice(index, 1);
    this.selectedFiles.partnerpanCard.splice(index, 1);
    this.selectedFiles.partneraadharCard.splice(index, 1);
    this.selectedFiles.partnerPhoto.splice(index, 1);
    this.selectedFiles.partnervoterId.splice(index, 1);
    // this.selectedFiles.partnerotherDocuments1.splice(index, 1);
    // this.selectedFiles.partnerotherDocuments2.splice(index, 1);
  }
  deletePayslipsRow(index) {
    this.paySlips.splice(index, 1);
    if (
      this.selectedFiles['paySlips'] &&
      this.selectedFiles['paySlips'][index]
    ) {
      this.selectedFiles['paySlips'].splice(index, 1);
    }
  }
  deleteBankStatementsRow(index) {
    this.bankStatements.splice(index, 1);
    if (
      this.selectedFiles['bankStatements'] &&
      this.selectedFiles['bankStatements'][index]
    ) {
      this.selectedFiles['bankStatements'].splice(index, 1);
    }
  }
  addExistingLoansRow() {
    let data = {
      bankName: '',
      loanType: '',
      emiAmount: '',
      emiClosingDate: '',
    };
    this.existingLoans.push(data);
  }
  deleteExistingLoansRow(index) {
    this.existingLoans.splice(index, 1);
  }
  addOtherAttachmentsRow() {
    let data = {
      name: '',
      otherDocuments: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.otherDocuments.push(data);
    this.selectedFiles.otherDocuments.push(fileData);
  }
  deleteOtherAttachmentsRow(index) {
    this.otherDocuments.splice(index, 1);
    if (
      this.selectedFiles['otherDocuments'] &&
      this.selectedFiles['otherDocuments'][index]
    ) {
      this.selectedFiles['otherDocuments'].splice(index, 1);
    }
  }
  addGstDetailsRow() {
    let data = {
      operatingState: '',
      filingPeriod: '',
      gst3BSale: '',
      gstDetails: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.gstDetails.push(data);
    this.selectedFiles.gstDetails.push(fileData);
  }
  deleteGstDetailsRow(index) {
    this.gstDetails.splice(index, 1);
    if (
      this.selectedFiles['gstDetails'] &&
      this.selectedFiles['gstDetails'][index]
    ) {
      this.selectedFiles['gstDetails'].splice(index, 1);
    }
  }
  saveKycsSection() {
    let formData = {
      contactPerson: this.contactPerson,
      panNumber: this.panNumber,
      aadharNumber: this.aadharNumber,
      coApplicantRelation: this.coApplicantRelation,
      coApplicantName: this.coApplicantName,
    };
    formData['panCard'] = [];
    if (
      this.selectedFiles['panCard'] &&
      this.selectedFiles['panCard']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['panCard']['links'].length; i++) {
        formData['panCard'].push(this.selectedFiles['panCard']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['panCard']['uploadedFiles'].length;
        i++
      ) {
        formData['panCard'].push(
          this.selectedFiles['panCard']['uploadedFiles'][i]
        );
      }
    }
    formData['aadharCard'] = [];
    if (
      this.selectedFiles['aadharCard'] &&
      this.selectedFiles['aadharCard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['aadharCard']['links'].length;
        i++
      ) {
        formData['aadharCard'].push(
          this.selectedFiles['aadharCard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['aadharCard']['uploadedFiles'].length;
        i++
      ) {
        formData['aadharCard'].push(
          this.selectedFiles['aadharCard']['uploadedFiles'][i]
        );
      }
    }
    formData['photo'] = [];
    if (this.selectedFiles['photo'] && this.selectedFiles['photo']['links']) {
      for (let i = 0; i < this.selectedFiles['photo']['links'].length; i++) {
        formData['photo'].push(this.selectedFiles['photo']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['photo']['uploadedFiles'].length;
        i++
      ) {
        formData['photo'].push(this.selectedFiles['photo']['uploadedFiles'][i]);
      }
    }
    formData['voterId'] = [];
    if (
      this.selectedFiles['voterId'] &&
      this.selectedFiles['voterId']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['voterId']['links'].length; i++) {
        formData['voterId'].push(this.selectedFiles['voterId']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['voterId']['uploadedFiles'].length;
        i++
      ) {
        formData['voterId'].push(
          this.selectedFiles['voterId']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantPancard'] = [];
    if (
      this.selectedFiles['coApplicantPancard'] &&
      this.selectedFiles['coApplicantPancard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPancard']['links'].length;
        i++
      ) {
        formData['coApplicantPancard'].push(
          this.selectedFiles['coApplicantPancard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPancard']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantPancard'].push(
          this.selectedFiles['coApplicantPancard']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantAadharcard'] = [];
    if (
      this.selectedFiles['coApplicantAadharcard'] &&
      this.selectedFiles['coApplicantAadharcard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantAadharcard']['links'].length;
        i++
      ) {
        formData['coApplicantAadharcard'].push(
          this.selectedFiles['coApplicantAadharcard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantAadharcard']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantAadharcard'].push(
          this.selectedFiles['coApplicantAadharcard']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantPhoto'] = [];
    if (
      this.selectedFiles['coApplicantPhoto'] &&
      this.selectedFiles['coApplicantPhoto']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPhoto']['links'].length;
        i++
      ) {
        formData['coApplicantPhoto'].push(
          this.selectedFiles['coApplicantPhoto']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPhoto']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantPhoto'].push(
          this.selectedFiles['coApplicantPhoto']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantVoterId'] = [];
    if (
      this.selectedFiles['coApplicantVoterId'] &&
      this.selectedFiles['coApplicantVoterId']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantVoterId']['links'].length;
        i++
      ) {
        formData['coApplicantVoterId'].push(
          this.selectedFiles['coApplicantVoterId']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantVoterId']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantVoterId'].push(
          this.selectedFiles['coApplicantVoterId']['uploadedFiles'][i]
        );
      }
    }
    // console.log(formData);
    // console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        // console.log(data);
        this.loading = false;
        this.toastService.showSuccess("Kyc's Saved Successfully");
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveCibilSection() {
    for (let index = 0; index < this.coApplicantCibil.length; index++) {
      this.coApplicantCibil[index]['coApplicantCibilReport'] = [];

      if (
        this.selectedFiles['coApplicantCibilReport'][index] &&
        this.selectedFiles['coApplicantCibilReport'][index]['links']
      ) {
        for (
          let i = 0;
          i <
          this.selectedFiles['coApplicantCibilReport'][index]['links'].length;
          i++
        ) {
          this.coApplicantCibil[index]['coApplicantCibilReport'].push(
            this.selectedFiles['coApplicantCibilReport'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['coApplicantCibilReport'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.coApplicantCibil[index]['coApplicantCibilReport'].push(
            this.selectedFiles['coApplicantCibilReport'][index][
            'uploadedFiles'
            ][i]
          );
        }
      }
    }
    let formData = {
      contactPerson: this.contactPerson,
      panNumber: this.panNumber,
      aadharNumber: this.aadharNumber,
      cibilScore: this.cibilScore,
      coApplicantCibil: this.coApplicantCibil,
    };
    formData['cibilReport'] = [];
    if (
      this.selectedFiles['cibilReport'] &&
      this.selectedFiles['cibilReport']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['cibilReport']['links'].length;
        i++
      ) {
        formData['cibilReport'].push(
          this.selectedFiles['cibilReport']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['cibilReport']['uploadedFiles'].length;
        i++
      ) {
        formData['cibilReport'].push(
          this.selectedFiles['cibilReport']['uploadedFiles'][i]
        );
      }
    }
    // console.log(formData);
    // console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        // console.log(data);
        this.loading = false;
        this.toastService.showSuccess('Cibil Data Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveCompanyDetailsSection() {
    for (let index = 0; index < this.paySlips.length; index++) {
      this.paySlips[index]['date'] = this.moment(
        this.paySlips[index]['date']
      ).format('MM/DD/YYYY');
      this.paySlips[index]['paySlips'] = [];
      if (
        this.selectedFiles['paySlips'][index] &&
        this.selectedFiles['paySlips'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['paySlips'][index]['links'].length;
          i++
        ) {
          this.paySlips[index]['paySlips'].push(
            this.selectedFiles['paySlips'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i < this.selectedFiles['paySlips'][index]['uploadedFiles'].length;
          i++
        ) {
          this.paySlips[index]['paySlips'].push(
            this.selectedFiles['paySlips'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      companyName: this.companyName,
      paySlips: this.paySlips,
    };
    formData['companyId'] = [];
    if (
      this.selectedFiles['companyId'] &&
      this.selectedFiles['companyId']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['companyId']['links'].length;
        i++
      ) {
        formData['companyId'].push(this.selectedFiles['companyId']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['companyId']['uploadedFiles'].length;
        i++
      ) {
        formData['companyId'].push(
          this.selectedFiles['companyId']['uploadedFiles'][i]
        );
      }
    }
    // console.log(formData);
    // console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        // console.log(data);
        this.loading = false;
        this.toastService.showSuccess('company Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveBankStatementsSection() {
    for (let index = 0; index < this.bankStatements.length; index++) {
      this.bankStatements[index]['from'] = this.moment(
        this.bankStatements[index]['from']
      ).format('MM/DD/YYYY');
      this.bankStatements[index]['to'] = this.moment(
        this.bankStatements[index]['to']
      ).format('MM/DD/YYYY');
      this.bankStatements[index]['bankStatements'] = [];
      if (
        this.selectedFiles['bankStatements'][index] &&
        this.selectedFiles['bankStatements'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['bankStatements'][index]['links'].length;
          i++
        ) {
          this.bankStatements[index]['bankStatements'].push(
            this.selectedFiles['bankStatements'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['bankStatements'][index]['uploadedFiles'].length;
          i++
        ) {
          this.bankStatements[index]['bankStatements'].push(
            this.selectedFiles['bankStatements'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      bankStatements: this.bankStatements,
    };
    // console.log(formData);
    // console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        // console.log(data);
        this.loading = false;
        this.toastService.showSuccess('Bank Statements Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveExistingLoans() {
    for (let index = 0; index < this.existingLoans.length; index++) {
      this.existingLoans[index]['emiClosingDate'] = this.moment(
        this.existingLoans[index]['emiClosingDate']
      ).format('MM/DD/YYYY');
    }
    let formData = {
      existingLoans: this.existingLoans,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess(
          'Existing Loan Details Saved Successfully'
        );
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveOtherAttachments() {
    let formData = {};
    formData['residenceProof'] = [];
    if (
      this.selectedFiles['residenceProof'] &&
      this.selectedFiles['residenceProof']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['residenceProof']['links'].length;
        i++
      ) {
        formData['residenceProof'].push(
          this.selectedFiles['residenceProof']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['residenceProof']['uploadedFiles'].length;
        i++
      ) {
        formData['residenceProof'].push(
          this.selectedFiles['residenceProof']['uploadedFiles'][i]
        );
      }
    }
    for (let index = 0; index < this.otherDocuments.length; index++) {
      this.otherDocuments[index]['otherDocuments'] = [];
      if (
        this.selectedFiles['otherDocuments'][index] &&
        this.selectedFiles['otherDocuments'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['otherDocuments'][index]['links'].length;
          i++
        ) {
          this.otherDocuments[index]['otherDocuments'].push(
            this.selectedFiles['otherDocuments'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['otherDocuments'][index]['uploadedFiles'].length;
          i++
        ) {
          this.otherDocuments[index]['otherDocuments'].push(
            this.selectedFiles['otherDocuments'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    formData['otherDocuments'] = this.otherDocuments;
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Other Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveSaleDetailsSection() {
    let formData = {};
    formData['saleDeed'] = [];
    if (
      this.selectedFiles['saleDeed'] &&
      this.selectedFiles['saleDeed']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['saleDeed']['links'].length; i++) {
        formData['saleDeed'].push(this.selectedFiles['saleDeed']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['saleDeed']['uploadedFiles'].length;
        i++
      ) {
        formData['saleDeed'].push(
          this.selectedFiles['saleDeed']['uploadedFiles'][i]
        );
      }
    }
    formData['saleAgreement'] = [];
    if (
      this.selectedFiles['saleAgreement'] &&
      this.selectedFiles['saleAgreement']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['saleAgreement']['links'].length;
        i++
      ) {
        formData['saleAgreement'].push(
          this.selectedFiles['saleAgreement']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['saleAgreement']['uploadedFiles'].length;
        i++
      ) {
        formData['saleAgreement'].push(
          this.selectedFiles['saleAgreement']['uploadedFiles'][i]
        );
      }
    }
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Sale Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveFinancialReturns() {
    for (let index = 0; index < this.financialReturns.length; index++) {
      this.financialReturns[index]['pastIncomeReturns'] = [];
      this.financialReturns[index]['presentIncomeReturns'] = [];
      if (
        this.selectedFiles['pastIncomeReturns'][index] &&
        this.selectedFiles['pastIncomeReturns'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['pastIncomeReturns'][index]['links'].length;
          i++
        ) {
          this.financialReturns[index]['pastIncomeReturns'].push(
            this.selectedFiles['pastIncomeReturns'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['pastIncomeReturns'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.financialReturns[index]['pastIncomeReturns'].push(
            this.selectedFiles['pastIncomeReturns'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['presentIncomeReturns'][index] &&
        this.selectedFiles['presentIncomeReturns'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['presentIncomeReturns'][index]['links'].length;
          i++
        ) {
          this.financialReturns[index]['presentIncomeReturns'].push(
            this.selectedFiles['presentIncomeReturns'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['presentIncomeReturns'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.financialReturns[index]['presentIncomeReturns'].push(
            this.selectedFiles['presentIncomeReturns'][index]['uploadedFiles'][
            i
            ]
          );
        }
      }
    }
    let formData = {
      financialReturns: this.financialReturns,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Financial Returns Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveGstDetails() {
    for (let index = 0; index < this.gstDetails.length; index++) {
      this.gstDetails[index]['filingPeriod'] = this.moment(
        this.gstDetails[index]['filingPeriod']
      ).format('MM/DD/YYYY');
      this.gstDetails[index]['gstDetails'] = [];
      if (
        this.selectedFiles['gstDetails'][index] &&
        this.selectedFiles['gstDetails'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['gstDetails'][index]['links'].length;
          i++
        ) {
          this.gstDetails[index]['gstDetails'].push(
            this.selectedFiles['gstDetails'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i < this.selectedFiles['gstDetails'][index]['uploadedFiles'].length;
          i++
        ) {
          this.gstDetails[index]['gstDetails'].push(
            this.selectedFiles['gstDetails'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      gstDetails: this.gstDetails,
    };
    formData['gstCertificate'] = [];
    if (
      this.selectedFiles['gstCertificate'] &&
      this.selectedFiles['gstCertificate']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['gstCertificate']['links'].length;
        i++
      ) {
        formData['gstCertificate'].push(
          this.selectedFiles['gstCertificate']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['gstCertificate']['uploadedFiles'].length;
        i++
      ) {
        formData['gstCertificate'].push(
          this.selectedFiles['gstCertificate']['uploadedFiles'][i]
        );
      }
    }
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('GST Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  uploadFiles(fileType, acceptableTypes, index?) {
    let data = {
      acceptableTypes: acceptableTypes,
      files:
        index || index == 0
          ? this.selectedFiles[fileType][index]['filesData']
          : this.selectedFiles[fileType]['filesData'],
      uploadedFiles:
        index || index == 0
          ? this.selectedFiles[fileType][index]['uploadedFiles']
          : this.selectedFiles[fileType]['uploadedFiles'],
    };
    let fileUploadRef = this.dialogService.open(FileUploadComponent, {
      header: 'Select Files',
      width: '90%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });
    fileUploadRef.onClose.subscribe((files: any) => {
      if (files) {
        this.saveFiles(files, fileType, index);
      }
    });
  }
  saveFiles(files, fileType, index) {
    this.loading = true;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let file of files) {
        if (file && !file['fileuploaded']) {
          formData.append('files', file);
        }
      }
      const accountId = this.userDetails?.accountId || 'default';
      this.leadsService.uploadFiles(formData, this.leadId, fileType, accountId).subscribe(
        (response: any) => {
          if (response && response['links'] && response['links'].length > 0) {
            for (let i = 0; i < response['links'].length; i++) {
              index || index == 0
                ? this.selectedFiles[fileType][index]['links'].push(
                  response['links'][i]
                )
                : this.selectedFiles[fileType]['links'].push(
                  response['links'][i]
                );
            }
            for (let i = 0; i < files.length; i++) {
              files[i]['fileuploaded'] = true;
              index || index == 0
                ? this.selectedFiles[fileType][index]['filesData'].push(
                  files[i]
                )
                : this.selectedFiles[fileType]['filesData'].push(files[i]);
            }
            // console.log(
            //   'this.selectedFiles',
            //   this.selectedFiles[fileType],
            //   files
            // );
            this.toastService.showSuccess('Files Uploaded Successfully');
          } else {
            this.toastService.showError({ error: 'Something went wrong' });
          }
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  goBack(): void {
    this.location.back();
  }
}
