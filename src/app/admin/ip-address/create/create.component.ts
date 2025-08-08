import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  breadCrumbItems: any = [];
  ipAddressForm: UntypedFormGroup;
  formFields: any = [];
  ipAddressId: any;
  loading: any;
  ipAddressData: any;
  heading: any = 'Create Ip Address';
  actionType: any = 'create';
  moment: any;
  userDetails: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.ipAddressId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Ip Address';
        this.getIpAddressById().then((data) => {
          if (data) {
            // console.log('ip address data', this.ipAddressData);
            this.ipAddressForm.patchValue({
              ipAddress: this.ipAddressData.ipAddress,
            });
          }
        });
      }
    });

    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Ip Address', routerLink: '/user/ipAddress',
        queryParams: { v: this.version },
       },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
    this.getIpAddressById().then((data) => {
      if (data) {
        // console.log(this.ipAddressData);
        this.ipAddressForm.patchValue({
          ipAddress: this.ipAddressData?.ipAddress,
          ipAddressName: this.ipAddressData?.ipAddressName,
        });
      }
    });
  }
  ngOnInit() {
    this.createForm();
    this.setIpAddressList();
  }

  setIpAddressList() {
    this.formFields = [
      {
        label: 'Name',
        controlName: 'ipAddressName',
        type: 'text',
        required: true,
      },
      {
        label: 'Ip Address',
        controlName: 'ipAddress',
        type: 'text',
        required: true,
      },
    ];
  }
  // createForm() {
  //   this.ipAddressForm = this.formBuilder.group({
  //     ipAddress: ['', Validators.compose([Validators.required])],
  //   });
  // }
  createForm() {
    this.ipAddressForm = this.formBuilder.group({
      ipAddressName: ['', Validators.required],
      ipAddress: ['', Validators.required],
    });
  }
  // onSubmit(formValues) {
  //   let formData = {
  //     ipAddress: formValues.ipAddress,
  //   };
  //   if (this.actionType == 'create') {
  //     this.loading = true;
  //     this.leadsService.createIpAddress(formData).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.loading = false;
  //           this.toastService.showSuccess('Ip Address Created Successfully');
  //           this.routingService.handleRoute('ipAddress', null);
  //         }
  //       },
  //       (error: any) => {
  //         this.loading = false;
  //         this.toastService.showError(error);
  //       }
  //     );
  //   } else if (this.actionType == 'update') {
  //     this.loading = true;
  //     this.leadsService.updateIpAddress(this.ipAddressId, formData).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.loading = false;
  //           this.toastService.showSuccess('Ip Address Updated Successfully');
  //           this.routingService.handleRoute('ipAddress', null);
  //         }
  //       },
  //       (error: any) => {
  //         this.loading = false;
  //         this.toastService.showError(error);
  //       }
  //     );
  //   }
  // }

  onSubmit(formValues) {
    const formData = {
      ipAddressName: formValues.ipAddressName,
      ipAddress: formValues.ipAddress,
    };
    // console.log('formData', formData);
    if (this.actionType == 'create') {
      this.loading = true;
      this.leadsService.createIpAddress(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Ip Address Added Successfully');
            this.routingService.handleRoute('ipAddress', null);
          }
        },
        (error: any) => {
          this.loading = false;
          // console.log(error);
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      // console.log(formData);
      this.leadsService.updateIpAddress(this.ipAddressId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Ip Address Updated Successfully');
            this.routingService.handleRoute('ipAddress', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }
  getIpAddressById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getIpAddressById(this.ipAddressId, filter).subscribe(
        (response) => {
          this.ipAddressData = response;
          // console.log(this.ipAddressData);
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

  goBack() {
    this.location.back();
  }
}
