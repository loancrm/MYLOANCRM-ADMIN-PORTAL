import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { ConfirmationService } from 'primeng/api';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  breadCrumbItems: any = [];
  teamForm: UntypedFormGroup;
  leadSources: any = [];
  teamId: any;
  loading: any;
  teamData: any;
  heading: any = 'Create Employee';
  actionType: any = 'create';
  moment: any;
  capabilities: any;
  userDetails: any;
  userRoles: any = [];
  selectedFiles: any = {
    userImage: { filesData: [], links: [], uploadedFiles: [] },
  };
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
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.teamId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Employee';
        this.getTeamDetailsById().then((data) => {
          if (data) {
            // console.log('teamData', this.teamData);
            this.teamForm.patchValue({
              userId: this.teamData.userId,
              name: this.teamData.name,
              phone: this.teamData.phone,
              email: this.teamData.email,
              userType: this.teamData.userType,
              joiningDate: this.teamData.joiningDate,
            });
            if (this.teamData.userImage) {
              this.selectedFiles['userImage']['uploadedFiles'] =
                this.teamData.userImage;
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
        label: 'Team',
        routerLink: '/user/team',
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
    this.getLeadSources();
    this.getUserRoles();
    this.capabilities = this.leadsService.getUserRbac();
    // console.log(this.capabilities);
    const phoneControl = this.teamForm.get('phone number');
    phoneControl?.valueChanges.subscribe(value => {
      //only trigger validation when exactly 10 digits are entered
      if (value && value.length === 10) {
        const isValid = /^[6-9]\d{9}$/.test(value);//start with 6-9 and 10 digits
        if (!isValid) {
          phoneControl.setErrors({ pattern: true });

        } else {
          phoneControl.setErrors(null);//valid number
        }

      } else {
        //Clear pattern error for incomplete input
        if (phoneControl?.hasError('pattern')) {
          phoneControl.setErrors(null);
        }
      }
    });

  }



  getUserRoles(filter = {}) {
    this.leadsService.getUserRoles(filter).subscribe(
      (roles) => {
        this.userRoles = roles;
        // console.log(this.userRoles);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getLeadSources(filter = {}) {
    this.leadsService.getLeadSources(filter).subscribe(
      (sources) => {
        this.leadSources = sources;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTeamDetailsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getUsersDetailsById(this.teamId, filter).subscribe(
        (teamData) => {
          // console.log(this.teamId);
          // console.log(teamData);
          this.teamData = teamData;
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

  createForm() {
    this.teamForm = this.formBuilder.group({
      userId: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      // phone: ['', Validators.compose([Validators.required,Validators.pattern(/^\d{10}$/)])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{10}$/)])],
      email: ['', Validators.compose([Validators.required])],
      userType: ['', Validators.compose([Validators.required])],
      joiningDate: ['', Validators.compose([Validators.required])],
    });
  }

  onSubmit(formValues) {
    let formData = {
      name: formValues.name,
      phone: formValues.phone,
      email: formValues.email.toLowerCase(),
      userType: formValues.userType,
      userId: formValues.userId,
      joiningDate: formValues.joiningDate
        ? this.moment(formValues.joiningDate).format('YYYY-MM-DD')
        : null,
    };
    formData['userImage'] = [];
    if (
      this.selectedFiles['userImage'] &&
      this.selectedFiles['userImage']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['userImage']['links'].length;
        i++
      ) {
        formData['userImage'].push(this.selectedFiles['userImage']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['userImage']['uploadedFiles'].length;
        i++
      ) {
        formData['userImage'].push(
          this.selectedFiles['userImage']['uploadedFiles'][i]
        );
      }
    }
    if (this.actionType == 'create') {
      this.loading = true;
      this.leadsService.createUsers(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Team Created Successfully');
            this.routingService.handleRoute('team', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      this.leadsService.updateUsers(this.teamId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Team Updated Successfully');
            this.routingService.handleRoute('team', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
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
      // console.log(this.userDetails)
      const accountId = this.userDetails?.accountId || 'default'; // make sure accountId is available
      this.leadsService.uploadFiles(formData, 'Users', fileType, accountId).subscribe(
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
  goBack() {
    this.location.back();
  }
}
