import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LeadsService } from '../leads.service';
import { projectConstantsLocal } from '../../../constants/project-constants';
import { ToastService } from '../../../services/toast.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '../../../services/routing-service';
import { DateTimeProcessorService } from '../../../services/date-time-processor.service';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import moment from 'moment-timezone';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  breadCrumbItems: any = [];
  today: Date;
  leadForm: UntypedFormGroup;
  submitted = false
  leadSources: any = [];
  leadUsers: any = [];
  files: File[];
  selectedFiles: any = {
    audioFiles: { filesData: [], links: [], uploadedFiles: [] },
  };
  businessEntities: any = projectConstantsLocal.BUSINESS_ENTITIES;
  leadRemarks: any = projectConstantsLocal.LEAD_REMARKS;
  businessTurnover: any = projectConstantsLocal.BUSINESS_TURNOVER;
  natureOfBusines: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  stateEntities: any = projectConstantsLocal.STATE_ENTITIES;
  booleanOptions: any = projectConstantsLocal.YES_OR_NO;
  natureOfBusinessSuggestions: any;
  citySuggestions: any;
  userDetails: any;
  leadId: any;
  loading: any;
  capabilities: any;
  leadData: any;
  steps: any[];
  activeIndex: number = 0;
  heading: any = 'Create Lead';
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
    private confirmationService: ConfirmationService,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService,
    private dialogService: DialogService
  ) {
    this.steps = [
      { label: 'Business Details' },
      { label: 'Business Address' },
      { label: 'Contact Details' },
      { label: 'Loan / OD Requirement' },
      { label: 'Other Details' },
    ];
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.leadId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Lead';
        this.getLeadDetailsById().then((data) => {
          if (data) {
            // console.log('leadData', this.leadData);
            this.leadForm.patchValue({
              businessName: this.leadData[0]?.businessName,
              businessEmail: this.leadData[0]?.businessEmail,
              contactPerson: this.leadData[0]?.contactPerson,
              primaryPhone: this.leadData[0]?.primaryPhone,
              secondaryPhone: this.leadData[0]?.secondaryPhone,
              addressLine1: this.leadData[0]?.addressLine1,
              addressLine2: this.leadData[0]?.addressLine2,
              existingLoanDetails: this.leadData[0]?.existingLoanDetails,
              city: this.leadData[0]?.city,
              state: this.leadData[0]?.state,
              pincode: this.leadData[0]?.pincode,
              leadSource: this.leadData[0]?.leadSource,
              sourcedBy: this.leadData[0]?.sourcedBy,
              businessEntity: this.leadData[0]?.businessEntity,
              businessTurnover: this.leadData[0]?.businessTurnover,
              product: this.leadData[0]?.product,
              natureOfBusiness: this.leadData[0]?.natureOfBusiness,
              businessOperatingSince: this.leadData[0]?.businessOperatingSince,
              hadOwnHouse: this.leadData[0]?.hadOwnHouse,
              loanRequirement: this.leadData[0]?.loanRequirement,
              odRequirement: this.leadData[0]?.odRequirement,
              calledFrom: this.leadData[0]?.calledFrom,
              remarks: this.leadData[0]?.remarks,
              leadRemarks: this.leadData[0]?.leadRemarks,
              createdOn: this.moment(this.leadData[0]?.createdOn).format(
                'YYYY-MM-DD  HH:mm:ss'
              ),
            });
            if (this.leadData[0]?.audioFiles) {
              this.selectedFiles['audioFiles']['uploadedFiles'] =
                this.leadData[0]?.audioFiles;
            }
          }
        });
      }
    });
    // this.userDetails =
    //   this.localStorageService.getItemFromLocalStorage('userDetails');
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Leads',
        routerLink: '/user/leads',
        queryParams: { v: this.version },
      },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
    this.getLeadSourcesValues();
    this.getLeadUsers();
  }
  preventInvalidKeys(event: KeyboardEvent) {
    const invalidKeys = ['e', 'E', '+', '-', ' '];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  preventInvalidPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    if (/[^0-9.]/.test(paste)) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.today = new Date();
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    // console.log(this.userDetails);
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
    this.createForm();
    const phoneControl = this.leadForm.get('primaryPhone');
    phoneControl?.valueChanges.subscribe(value => {
      // Only trigger validation when exactly 10 digits are entered
      if (value && value.length == 10) {
        const isValid = /^[6-9]\d{9}$/.test(value); // Starts with 6-9 and 10 digits
        if (!isValid) {
          phoneControl.setErrors({ pattern: true });
        } else {
          phoneControl.setErrors(null); // Valid number
        }
      } else {
        // Clear pattern error for incomplete input
        if (phoneControl?.hasError('pattern')) {
          phoneControl.setErrors(null);
        }
      }
    });
  }

  onStepChange(event: any) {
    this.activeIndex = event.index;
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
  createForm() {
    this.leadForm = this.formBuilder.group({
      businessName: ['', Validators.compose([Validators.required])],
      businessEmail: [''],
      contactPerson: ['', Validators.compose([Validators.required])],
      existingLoanDetails: ['', Validators.compose([Validators.required])],
      primaryPhone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10)
          // Validators.pattern(/^[6789]\d{9}$/),
        ]),
      ],
      secondaryPhone: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: ['', Validators.compose([Validators.required])],
      state: [''],
      pincode: [''],
      leadSource: [''],
      sourcedBy: ['', Validators.compose([Validators.required])],
      businessEntity: ['', Validators.compose([Validators.required])],
      businessTurnover: ['', Validators.compose([Validators.required])],
      natureOfBusiness: ['', Validators.compose([Validators.required])],
      product: ['', Validators.compose([Validators.required])],
      businessOperatingSince: ['', Validators.compose([Validators.required])],
      createdOn: [''],
      hadOwnHouse: ['', Validators.compose([Validators.required])],
      loanRequirement: [''],
      odRequirement: [''],
      calledFrom: ['', Validators.compose([Validators.required])],
      remarks: ['', Validators.compose([Validators.required])],
      leadRemarks: ['', Validators.compose([Validators.required])],
    });
    if (
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType == '3' &&
      this.userDetails.id
    ) {
      this.leadForm.controls['sourcedBy'].setValue(this.userDetails.id);
      this.leadForm.controls['leadSource'].setValue(1);
    }
  }
  getLeadSourcesValues(filter = {}) {
    this.leadsService.getLeadSources(filter).subscribe(
      (sources) => {
        this.leadSources = sources;
        // console.log('Lead sources :', this.leadSources);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLeadUsers(filter = {}) {
    this.leadsService.getUsers(filter).subscribe(
      (users) => {
        this.leadUsers = users;
        // console.log('Lead Users:', this.leadUsers);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  goBack() {
    this.location.back();
  }

  onSubmit(formValues) {
    this.submitted = true;
    if (this.leadForm.invalid) {
      return
    }
    let formData: any = {
      businessName: formValues.businessName,
      businessEmail: formValues.businessEmail,
      contactPerson: formValues.contactPerson,
      primaryPhone: formValues.primaryPhone,
      secondaryPhone: formValues.secondaryPhone,
      addressLine1: formValues.addressLine1,
      addressLine2: formValues.addressLine2,
      city: formValues.city,
      state: formValues.state,
      pincode: formValues.pincode,
      leadSource: formValues.leadSource,
      sourcedBy: formValues.sourcedBy,
      businessEntity: formValues.businessEntity,
      businessTurnover: formValues.businessTurnover,
      natureOfBusiness: formValues.natureOfBusiness,
      product: formValues.product,
      businessOperatingSince: formValues.businessOperatingSince,
      hadOwnHouse: formValues.hadOwnHouse,
      loanRequirement: formValues.loanRequirement,
      odRequirement: formValues.odRequirement,
      existingLoanDetails: formValues.existingLoanDetails,
      remarks: formValues.remarks,
      leadRemarks: formValues.leadRemarks,
      calledFrom: formValues.calledFrom,
      createdBy:
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.username,
      lastUpdatedBy:
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.username,
    };

    formData['audioFiles'] = [];
    if (
      this.selectedFiles['audioFiles'] &&
      this.selectedFiles['audioFiles']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['audioFiles']['links'].length;
        i++
      ) {
        formData['audioFiles'].push(
          this.selectedFiles['audioFiles']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['audioFiles']['uploadedFiles'].length;
        i++
      ) {
        formData['audioFiles'].push(
          this.selectedFiles['audioFiles']['uploadedFiles'][i]
        );
      }
    }
    // console.log('formvalues', formValues);
    // console.log('formData', formData);
    if (this.actionType == 'create') {
      if (formValues.createdOn) {
        formData.createdOn = moment(formValues.createdOn)
          .tz('Asia/Kolkata') // Convert to IST
          .set({
            hour: moment().tz('Asia/Kolkata').hour(), // Set the current hour in IST
            minute: moment().tz('Asia/Kolkata').minute(), // Set the current minute in IST
            second: moment().tz('Asia/Kolkata').second(), // Set the current second in IST
            millisecond: moment().tz('Asia/Kolkata').millisecond(), // Set the current millisecond in IST
          })
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'); // Format as UTC time
      }
      this.loading = true;
      // console.log(formData);
      this.leadsService.createLead(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Lead Created Successfully');
            this.routingService.handleRoute('leads', null);
          }
        },
        (error: any) => {
          this.loading = false;
          // console.log(error);
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      if (formValues.createdOn) {
        // formData.createdOn = this.moment(formValues.createdOn).format(
        //   'YYYY-MM-DD HH:mm:ss'
        // );
        // formData.lastUpdatedOn = this.moment(formValues.createdOn).format(
        //   'YYYY-MM-DD HH:mm:ss'
        // );
        const newCreatedOn = this.moment(formValues.createdOn).format(
          'YYYY-MM-DD'
        );
        const currentCreatedOn = this.moment(this.leadData[0].createdOn).format(
          'YYYY-MM-DD'
        );
        // console.log(newCreatedOn);
        // console.log(currentCreatedOn);
        if (newCreatedOn !== currentCreatedOn) {
          formData.createdOn = moment(formValues.createdOn)
            .tz('Asia/Kolkata') // Convert to IST
            .set({
              hour: moment().tz('Asia/Kolkata').hour(), // Set the current hour in IST
              minute: moment().tz('Asia/Kolkata').minute(), // Set the current minute in IST
              second: moment().tz('Asia/Kolkata').second(), // Set the current second in IST
              millisecond: moment().tz('Asia/Kolkata').millisecond(), // Set current millisecond in IST
            })
            .utc()
            .format('YYYY-MM-DD HH:mm:ss'); // Format as Asian time (IST)
        }
      }
      this.loading = true;
      // console.log(formData);
      this.leadsService.updateLead(this.leadId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Lead Updated Successfully');
            this.routingService.handleRoute('leads', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  getSourceName(userId) {
    if (this.leadUsers && this.leadUsers.length > 0) {
      let leadUserName = this.leadUsers.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }
  getLeadDetailsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getLeadDetailsById(this.leadId, filter).subscribe(
        (leadData) => {
          this.leadData = leadData;
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
  confirmDelete(file) {
    // console.log('Before Deletion:', this.selectedFiles);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Audio File?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFile(file);
      },
    });
  }
  // deleteFile(fileUrl: string) {
  //   const relativePath = fileUrl.substring(fileUrl.indexOf('/uploads'));
  //   this.leadsService.deleteFile(relativePath).subscribe(
  //     (response: any) => {
  //       if (response.message === 'File deleted successfully.') {
  //         console.log('File deleted successfully.');
  //         console.log(this.selectedFiles);
  //         this.selectedFiles.audioFiles.uploadedFiles =
  //           this.selectedFiles.audioFiles.uploadedFiles.filter(
  //             (f: string) => f !== fileUrl
  //           );
  //         console.log(this.selectedFiles);
  //         this.toastService.showSuccess('File Deleted Successfully');
  //       } else {
  //         console.error('Error deleting file:', response.error);
  //         this.toastService.showError(response);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  deleteFile(fileUrl: string) {
    if (!fileUrl) {
      console.error('Invalid file URL provided.');
      this.toastService.showError('Invalid file URL provided.');
      return;
    }
    const relativePath = fileUrl.substring(fileUrl.indexOf('/uploads'));
    this.leadsService.deleteFile(relativePath).subscribe({
      next: (response: any) => {
        if (response?.message === 'File deleted successfully.') {
          // console.log('File deleted successfully:', fileUrl);
          if (this.selectedFiles?.audioFiles?.uploadedFiles) {
            this.selectedFiles.audioFiles.uploadedFiles =
              this.selectedFiles.audioFiles.uploadedFiles.filter(
                (file: string) => file !== fileUrl
              );
          }
          // console.log('Updated selected files:', this.selectedFiles);
          this.toastService.showSuccess('File Deleted Successfully');
        } else {
          const errorMsg = response?.error || 'Unexpected error occurred.';
          console.error('Error deleting file:', errorMsg);
          this.toastService.showError(errorMsg);
        }
      },
      error: (error) => {
        console.error('Error during file deletion:', error);
        this.toastService.showError(error);
      },
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
      const accountId = this.userDetails?.accountId || 'default'; // make sure accountId is available
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
}
