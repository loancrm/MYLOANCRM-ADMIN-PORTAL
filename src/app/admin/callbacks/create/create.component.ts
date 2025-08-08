import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  MinLengthValidator,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from '../../../services/date-time-processor.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutingService } from '../../../services/routing-service';
import { ToastService } from '../../../services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import moment from 'moment-timezone';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  breadCrumbItems: any = [];
  leadUsers: any = [];
  callBackForm: UntypedFormGroup;
  submitted=false
  callBackId: any;
  loading: any;
  callBackData: any;
  heading: any = 'Create Callback';
  actionType: any = 'create';
  moment: any;
  userDetails: any;
  leadSources: any = [];
  loanType: string;
  employmentStatus: any = projectConstantsLocal.EMPLOYMENT_STATUS;
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
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loanType = params['loanType'];
      // console.log('Selected Loan Type:', this.loanType);
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.callBackId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Callback';
        this.getCallBackDetailsById().then((data) => {
          if (data) {
            (this.employmentStatus = this.callBackData?.employmentStatus),
              (this.loanType = this.callBackData.loanType),
              // console.log('callBackData', this.callBackData);
            this.callBackForm.patchValue({
              businessName: this.callBackData.businessName,
              personName: this.callBackData.businessName,
              phone: this.callBackData.phone,
              sourcedBy: this.callBackData.sourcedBy,
              createdOn: this.moment(this.callBackData.createdOn).format(
                'YYYY-MM-DD  HH:mm:ss'
              ),
              // date: this.moment(this.callBackData.date).format('MM/DD/YYYY'),
              date: this.callBackData.date,
              remarks: this.callBackData.remarks,
            });
          }
        });
      }
    });
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    // this.breadCrumbItems = [
    //   {
    //
    //     label: ' Home',
    //     routerLink: '/user/dashboard',
    //     queryParams: { v: this.version },
    //   },
    //   {
    //     label: 'Callbacks',
    //     routerLink: '/user/callbacks',
    //     queryParams: { v: this.version },
    //   },
    //   { label: this.actionType == 'create' ? 'Create' : 'Update' },
    // ];
    this.breadCrumbItems = [
      {
        svgIcon: 'assets/images/icons/home.svg', // <-- custom SVG path
        label: 'Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Callbacks',
        routerLink: '/user/callbacks',
        queryParams: { v: this.version },
      },
      {
        label: this.actionType == 'create' ? 'Create' : 'Update'
      }
    ];
    this.getLeadUsers();
  }
  ngOnInit() {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    // console.log(this.userDetails);
    this.createForm();
    if (this.loanType == 'personalLoan') {
      this.employmentStatus = 'employed';
    }
    if (this.loanType == 'businessLoan') {
      this.employmentStatus = 'self-employed';
    }
    const phoneControl = this.callBackForm.get('phone');
    phoneControl?.valueChanges.subscribe(value=>{
      if (value && value.length==10){
        const isValid = /^[6-9]\d{9}$/.test(value);
        if(!isValid){
          phoneControl.setErrors({pattern:true});
        }else{
          phoneControl.setErrors(null);
        }
      }else{
        if(phoneControl?.hasError('pattern')){
          phoneControl.setErrors(null)
        }
      }
    });
    // const businessnameControl= this.callBackForm.get('businessName');
    // businessnameControl?.valueChanges.subscribe(value=>{
    //   if(value && value.length < 3){
    //     const isValid = MinLengthValidator.test(value);
    //     if(!isValid){
    //       businessnameControl.setErrors({MinLengthValidator:true});
    //     } else{
    //       businessnameControl.setErrors(null);
    //     }
    //   } else {
    //     if (businessnameControl?.hasError('MinLengthValidator')){
    //       businessnameControl.setErrors(null)
    //     }
    //   }
    // })
  }

  get businessName(){
    return this.callBackForm.get('businessName')
  }



  getCallBackDetailsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService
        .getCallBackDetailsById(this.callBackId, filter)
        .subscribe(
          (callBackData) => {
            this.callBackData = callBackData;
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
    this.callBackForm = this.formBuilder.group({
      businessName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      // personName: ['', Validators.compose([Validators.required])],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10)
          // Validators.pattern(/^[6-9]\d{9}$/),
        ]),
      ],
      sourcedBy: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      remarks: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      createdOn: [''],
    });
    if (
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType == '3' &&
      this.userDetails.id
    ) {
      this.callBackForm.controls['sourcedBy'].setValue(this.userDetails.id);
    }
  }
  onSubmit(formValues) {
    this.submitted=true;
    if(this.callBackForm.invalid){
      return
    }
    let formData: any = {
      loanType: this.loanType,
      employmentStatus: this.employmentStatus,
      businessName: formValues.businessName,
      phone: formValues.phone,
      // date: formValues.date,
      date: this.moment(formValues.date).format('YYYY-MM-DD'),
      remarks: formValues.remarks,
      sourcedBy: formValues.sourcedBy,
      lastUpdatedBy:
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.username,
      // ...(this.loanType ? { employmentStatus: this.employmentStatus } : {})
    };
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
      this.leadsService.createCallBack(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Callback Created Successfully');
            this.routingService.handleRoute('callbacks', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      if (formValues.createdOn) {
        const newCreatedOn = this.moment(formValues.createdOn).format(
          'YYYY-MM-DD'
        );
        const currentCreatedOn = this.moment(
          this.callBackData?.createdOn
        ).format('YYYY-MM-DD');
        // console.log(newCreatedOn);
        // console.log(currentCreatedOn);
        if (newCreatedOn !== currentCreatedOn) {
          formData.createdOn = moment(formValues.createdOn)
            .tz('Asia/Kolkata')
            .set({
              hour: moment().tz('Asia/Kolkata').hour(),
              minute: moment().tz('Asia/Kolkata').minute(),
              second: moment().tz('Asia/Kolkata').second(),
              millisecond: moment().tz('Asia/Kolkata').millisecond(),
            })
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        }
      }
      this.loading = true;
      this.leadsService.updateCallBack(this.callBackId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Callback Updated Successfully');
            this.routingService.handleRoute('callbacks', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
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
}
