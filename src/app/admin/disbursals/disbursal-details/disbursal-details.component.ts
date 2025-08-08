import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { DialogService } from 'primeng/dynamicdialog';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
interface FormDetail {
  id: number;
  // program: string;
  // bankName: string;
  sanctionedLetter: string[];
  repaymentSchedule: string[];
}

@Component({
  selector: 'app-disbursal-details',
  templateUrl: './disbursal-details.component.html',
  styleUrls: ['./disbursal-details.component.scss'],
})
export class DisbursalDetailsComponent implements OnInit {
  leads: any = null;
  loading: any;
  userDetails: any;
  leadId: string | null = null;
  disbursalDetails: any[] = [];
  displayedItems: any = [];
  bankMap = new Map<number, string>();
  banks: any = [];
  selectedFiles: any = {
    sanctionedLetter: { filesData: [], links: [], uploadedFiles: [] },
    repaymentSchedule: { filesData: [], links: [], uploadedFiles: [] },
  };
  version = projectConstantsLocal.VERSION_DESKTOP;
  breadCrumbItems: any[] = [
    {

      label: ' Home',
      routerLink: '/user/dashboard',
      queryParams: { v: this.version },
    },
    {
      label: 'Disbursals',
      routerLink: '/user/disbursals',
      queryParams: { v: this.version },
    },
    { label: 'Disbursed Details' },
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private dialogService: DialogService,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
    this.getBankers();
  }

  ngOnInit(): void {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    // this.leadId = this.route.snapshot.paramMap.get('id');
    // if (this.leadId) {
    //   this.getLeadById(this.leadId);
    //   this.getDisbursalsDetailsById(this.leadId);
    // }
    this.leadId = this.route.snapshot.paramMap.get('id');
    const status = this.route.snapshot.paramMap.get('status');
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
      this.getDisbursalsDetailsById(this.leadId);
    }
  }

  saveFormData(): void {
    const formData: FormDetail[] = this.disbursalDetails.map((detail) => ({
      id: detail.id,
      // program: detail.program,
      // bankName: detail.bankName,
      sanctionedLetter: detail.sanctionedLetter
        ? Array.isArray(detail.sanctionedLetter)
          ? [...detail.sanctionedLetter]
          : [detail.sanctionedLetter]
        : [],
      repaymentSchedule: detail.repaymentSchedule
        ? Array.isArray(detail.repaymentSchedule)
          ? [...detail.repaymentSchedule]
          : [detail.repaymentSchedule]
        : [],
    }));
    formData.forEach((data, index) => {
      if (
        this.selectedFiles.sanctionedLetter &&
        this.selectedFiles.sanctionedLetter.filesData
      ) {
        const { links = [], uploadedFiles = [] } =
          this.selectedFiles.sanctionedLetter;
        data.sanctionedLetter = [
          ...data.sanctionedLetter,
          ...links,
          ...uploadedFiles,
        ];
      }
    });

    formData.forEach((data, index) => {
      if (
        this.selectedFiles.repaymentSchedule &&
        this.selectedFiles.repaymentSchedule.filesData
      ) {
        const { links = [], uploadedFiles = [] } =
          this.selectedFiles.repaymentSchedule;
        data.repaymentSchedule = [
          ...data.repaymentSchedule,
          ...links,
          ...uploadedFiles,
        ];
      }
    });
    // console.log(formData);
    this.loading = true;
    this.leadsService.updateDisbursalDetails(this.leadId, formData).subscribe(
      (response: any) => {
        this.loading = false;
        this.toastService.showSuccess('Files and Data Saved Successfully');
        // const targetUrl = `user/disbursals`;
        // this.router.navigateByUrl(targetUrl);
        this.routingService.handleRoute('disbursals', null);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getLoanLeadById(leadId: any): void {
    this.leadsService.getLoanLeadById(leadId).subscribe(
      (data: any) => {
        this.leads = data;
        this.updateDisplayedItems();
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }

  updateDisplayedItems() {
    const loanDisplayProperty =
      this.leads && this.leads[0].employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      // { data: this.leads[0], displayProperty: 'businessName' },
      { data: this.leads[0], displayProperty: loanDisplayProperty },
    ];
  }
  getDisbursalsDetailsById(leadId) {
    this.loading = true;
    this.leadsService.getDisbursalsDetailsById(leadId).subscribe(
      (lead: any) => {
        this.disbursalDetails = lead;
        this.initializeSelectedFiles();
        // console.log('disbursal details :', this.disbursalDetails);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  initializeSelectedFiles(): void {
    this.disbursalDetails.forEach((detail, index) => {
      if (detail.sanctionedLetter && detail.sanctionedLetter.length > 0) {
        if (!this.selectedFiles.sanctionedLetter[index]) {
          this.selectedFiles.sanctionedLetter[index] = {
            filesData: [],
            links: detail.sanctionedLetter,
            uploadedFiles: detail.sanctionedLetter,
          };
        }
      }
      if (detail.repaymentSchedule && detail.repaymentSchedule.length > 0) {
        if (!this.selectedFiles.repaymentSchedule[index]) {
          this.selectedFiles.repaymentSchedule[index] = {
            filesData: [],
            links: detail.repaymentSchedule,
            uploadedFiles: detail.repaymentSchedule,
          };
        }
      }
    });
  }

  uploadFiles(fileType, acceptableTypes, index?) {
    let data = {
      acceptableTypes: acceptableTypes,
      files:
        index || index === 0
          ? this.selectedFiles[fileType][index]?.filesData
          : this.selectedFiles[fileType]?.filesData,
      uploadedFiles:
        index || index === 0
          ? this.selectedFiles[fileType][index]?.uploadedFiles
          : this.selectedFiles[fileType]?.uploadedFiles,
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
            if (index || index === 0) {
              if (!this.selectedFiles[fileType][index]) {
                this.selectedFiles[fileType][index] = {
                  filesData: [],
                  links: [],
                  uploadedFiles: [],
                };
              }
            } else {
              if (!this.selectedFiles[fileType]) {
                this.selectedFiles[fileType] = {
                  filesData: [],
                  links: [],
                  uploadedFiles: [],
                };
              }
            }
            for (let i = 0; i < response['links'].length; i++) {
              index || index === 0
                ? this.selectedFiles[fileType][index]['links'].push(
                  response['links'][i]
                )
                : this.selectedFiles[fileType]['links'].push(
                  response['links'][i]
                );
            }
            for (let i = 0; i < files.length; i++) {
              files[i]['fileuploaded'] = true;
              index || index === 0
                ? this.selectedFiles[fileType][index]['filesData'].push(
                  files[i]
                )
                : this.selectedFiles[fileType]['filesData'].push(files[i]);
            }
            if (index || index === 0) {
              this.disbursalDetails[index][fileType] =
                this.selectedFiles[fileType][index]['links'];
            } else {
              this.disbursalDetails[0][fileType] =
                this.selectedFiles[fileType]['links'];
            }
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
  shouldDisplayBlock(): boolean {
    const lead = this.leads?.[0];
    if (!lead) return false;
    const isSelfEmployedHomeOrLap =
      (lead.loanType === 'homeLoan' || lead.loanType === 'lap') &&
      lead.employmentStatus === 'self-employed';
    const loanTypeNotExists = !('loanType' in lead);
    return isSelfEmployedHomeOrLap || loanTypeNotExists;
  }

  getLeadById(id: string) {
    this.leadsService.getLeadDetailsById(id).subscribe(
      (lead) => {
        this.leads = lead;
        this.updateDisplayedItems();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getBankers(filter = {}) {
    this.loading = true;
    this.leadsService.getBankers(filter).subscribe(
      (response: any) => {
        this.banks = [{ name: 'All' }, ...response];

        // Create a Map for quick lookup
        this.bankMap.clear();
        for (const bank of response) {
          if (bank.id && bank.name) {
            this.bankMap.set(bank.id, bank.name);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLenderName(bankId: number): string {
    return this.bankMap.get(bankId) || '';
  }
  goBack(): void {
    this.location.back();
  }
}
