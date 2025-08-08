import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  breadCrumbItems: any = [];
  BankerForm: UntypedFormGroup;
  files: File[];
  selectedFiles: any = {
    imageFiles: { filesData: [], links: [], uploadedFiles: [] },
  };
  capabilities: any;

  natureOfBusinessSuggestions: any;
  userDetails: any;
  bankersId: any;
  loading: any;
  bankersData: any;
  heading: any = 'Create Lender';
  actionType: any = 'create';
  moment: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private confirmationService: ConfirmationService,
    private dateTimeProcessor: DateTimeProcessorService,
    private dialogService: DialogService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.bankersId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Lender';
        this.getBankersDetailsById().then((data) => {
          if (data) {
            // console.log('bankersData', this.bankersData);
            this.BankerForm.patchValue({
              name: this.bankersData.name,
            });
            this.setBranchDetails(this.bankersData.branchDetails);
            if (this.bankersData.imageFiles) {
              this.selectedFiles['imageFiles']['uploadedFiles'] =
                this.bankersData.imageFiles;
            }
          }
        });
      }
    });
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Lenders',
        routerLink: '/user/bankers',
        queryParams: { v: this.version },
      },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
  }

  ngOnInit() {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.createForm();
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
  }

  createForm() {
    this.BankerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      branchDetails: this.formBuilder.array([this.createBranchDetail()]),
    });
  }

  createBranchDetail(): UntypedFormGroup {
    return this.formBuilder.group({
      branch: ['', Validators.required],
      contactPerson: ['', Validators.required],
      designation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get branchDetails(): UntypedFormArray {
    return this.BankerForm.get('branchDetails') as UntypedFormArray;
  }

  addBranchDetail() {
    this.branchDetails.push(this.createBranchDetail());
  }

  deleteBranchDetail(index: number) {
    this.branchDetails.removeAt(index);
  }

  setBranchDetails(branchDetails: any[]) {
    const branchDetailFormGroups = branchDetails.map((detail) =>
      this.formBuilder.group({
        branch: [detail.branch, Validators.required],
        contactPerson: [detail.contactPerson, Validators.required],
        designation: [detail.designation, Validators.required],
        phone: [
          detail.phone,
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        email: [detail.email, [Validators.required, Validators.email]],
      })
    );
    const branchDetailFormArray = this.formBuilder.array(
      branchDetailFormGroups
    );
    this.BankerForm.setControl('branchDetails', branchDetailFormArray);
  }

  goBack() {
    this.location.back();
  }

  onSubmit(formValues) {
    let formData = {
      name: formValues.name,
      branchDetails: formValues.branchDetails,
      lastUpdatedBy:
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.username,
    };
    formData['imageFiles'] = [];
    if (
      this.selectedFiles['imageFiles'] &&
      this.selectedFiles['imageFiles']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['imageFiles']['links'].length;
        i++
      ) {
        formData['imageFiles'].push(
          this.selectedFiles['imageFiles']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['imageFiles']['uploadedFiles'].length;
        i++
      ) {
        formData['imageFiles'].push(
          this.selectedFiles['imageFiles']['uploadedFiles'][i]
        );
      }
    }

    if (this.actionType == 'create') {
      this.loading = true;
      this.leadsService.createBanker(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Lender Created Successfully');
            this.routingService.handleRoute('bankers', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      this.leadsService.updateBanker(this.bankersId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Lender Updated Successfully');
            this.routingService.handleRoute('bankers', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  getBankersDetailsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getBankersDetailsById(this.bankersId, filter).subscribe(
        (bankersData) => {
          this.bankersData = bankersData;
          this.loading = false;
          resolve(true);
        },
        (error: any) => {
          this.loading = false;
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }

  uploadFiles(fileType, acceptableTypes) {
    let data = {
      acceptableTypes: acceptableTypes,
      files: this.selectedFiles[fileType]['filesData'],
      uploadedFiles: this.selectedFiles[fileType]['uploadedFiles'],
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
        this.saveFiles(files, fileType);
      }
    });
  }

  saveFiles(files, fileType) {
    this.loading = true;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let file of files) {
        if (file && !file['fileuploaded']) {
          formData.append('files', file);
        }
      }
      const accountId = this.userDetails?.accountId || 'default'; // make sure accountId is available
      this.leadsService.uploadFiles(formData, 'Bankers', fileType, accountId).subscribe(
        (response: any) => {
          if (response && response['links'] && response['links'].length > 0) {
            for (let i = 0; i < response['links'].length; i++) {
              this.selectedFiles[fileType]['links'].push(response['links'][i]);
            }
            for (let i = 0; i < files.length; i++) {
              files[i]['fileuploaded'] = true;
              this.selectedFiles[fileType]['filesData'].push(files[i]);
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
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
}
