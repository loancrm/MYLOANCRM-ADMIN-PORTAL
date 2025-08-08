import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from '../leads.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/services/routing-service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import moment from 'moment-timezone';

@Component({
  selector: 'app-loan-leads',
  templateUrl: './loan-leads.component.html',
  styleUrl: './loan-leads.component.scss',
})
export class LoanLeadsComponent {
  breadCrumbItems: any = [];
  today: Date;
  leadForm: UntypedFormGroup;
  leadFormforBusiness: UntypedFormGroup;
  leadSources: any = [];
  leadUsers: any = [];
  files: File[];
  selectedFiles: any = {
    audioFiles: { filesData: [], links: [], uploadedFiles: [] },
  };
  stateEntities: any = projectConstantsLocal.STATE_ENTITIES;
  booleanOptions: any = projectConstantsLocal.YES_OR_NO;
  businessEntities: any = projectConstantsLocal.BUSINESS_ENTITIES;
  businessTurnover: any = projectConstantsLocal.BUSINESS_TURNOVER;
  natureOfBusines: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  employmentStatus: any = projectConstantsLocal.EMPLOYMENT_STATUS;
  natureOfBusinessSuggestions: any;
  citySuggestions: any;
  userDetails: any;
  leadId: any;
  loading: any;
  leadData: any;
  steps: any[];
  stepsforBusiness: any[];
  activeIndex: number = 0;
  heading: any = 'Create Lead';
  actionType: any = 'create';
  moment: any;
  loanType: string;
  version = projectConstantsLocal.VERSION_DESKTOP;
  preventNonNumeric(event: KeyboardEvent): void {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
  const key = event.key;

  const isDigit = key >= '0' && key <= '9';

  if (!isDigit && !allowedKeys.includes(key)) {
    event.preventDefault();
  }
}

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
    this.steps = [
      { label: 'Applicant Details' },
      { label: 'Address Details' },
      { label: 'Employment Details' },
      { label: 'Loan Requirement' },
      { label: 'Other Details' },
    ];
    this.stepsforBusiness = [
      { label: 'Business Details' },
      { label: 'Business Address' },
      { label: 'Contact Details' },
      { label: 'Loan Requirement' },
      { label: 'Other Details' },
    ];
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loanType = params['loanType'];
      // console.log('Selected Loan Type:', this.loanType);
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.leadId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Lead';
        this.getLoanLeadById().then((data) => {
          if (data) {
            (this.employmentStatus = this.leadData[0]?.employmentStatus),
              (this.loanType = this.leadData[0].loanType),
              // console.log('leadData', this.leadData);
            this.leadForm.patchValue({
              contactPerson: this.leadData[0]?.contactPerson,
              primaryPhone: this.leadData[0]?.primaryPhone,
              secondaryPhone: this.leadData[0]?.secondaryPhone,
              email: this.leadData[0]?.email,
              addressLine1: this.leadData[0]?.addressLine1,
              addressLine2: this.leadData[0]?.addressLine2,
              city: this.leadData[0]?.city,
              state: this.leadData[0]?.state,
              pincode: this.leadData[0]?.pincode,
              companyName: this.leadData[0]?.companyName,
              designation: this.leadData[0]?.designation,
              salary: this.leadData[0]?.salary,
              jobExperience: this.leadData[0]?.jobExperience,
              companyAddress: this.leadData[0]?.companyAddress,
              existingLoanDetails: this.leadData[0]?.existingLoanDetails,
              leadSource: this.leadData[0]?.leadSource,
              sourcedBy: this.leadData[0]?.sourcedBy,
              hadOwnHouse: this.leadData[0]?.hadOwnHouse,
              loanRequirement: this.leadData[0]?.loanRequirement,
              propertyType: this.leadData[0]?.propertyType,
              propertyValue: this.leadData[0]?.propertyValue,
              propertyLocation: this.leadData[0]?.propertyLocation,
              remarks: this.leadData[0]?.remarks,
              calledFrom: this.leadData[0]?.calledFrom,
              createdOn: this.moment(this.leadData[0]?.createdOn).format(
                'YYYY-MM-DD  HH:mm:ss'
              ),
            });
            this.leadFormforBusiness.patchValue({
              contactPerson: this.leadData[0]?.contactPerson,
              primaryPhone: this.leadData[0]?.primaryPhone,
              secondaryPhone: this.leadData[0]?.secondaryPhone,
              email: this.leadData[0]?.email,
              addressLine1: this.leadData[0]?.addressLine1,
              addressLine2: this.leadData[0]?.addressLine2,
              city: this.leadData[0]?.city,
              state: this.leadData[0]?.state,
              pincode: this.leadData[0]?.pincode,
              businessName: this.leadData[0]?.businessName,
              businessEntity: this.leadData[0]?.businessEntity,
              businessTurnover: this.leadData[0]?.businessTurnover,
              natureofBusiness: this.leadData[0]?.natureofBusiness,
              product: this.leadData[0]?.product,
              businessVintage: this.leadData[0]?.businessVintage,
              existingLoanDetails: this.leadData[0]?.existingLoanDetails,
              leadSource: this.leadData[0]?.leadSource,
              sourcedBy: this.leadData[0]?.sourcedBy,
              hadOwnHouse: this.leadData[0]?.hadOwnHouse,
              loanRequirement: this.leadData[0]?.loanRequirement,
              propertyType: this.leadData[0]?.propertyType,
              propertyValue: this.leadData[0]?.propertyValue,
              propertyLocation: this.leadData[0]?.propertyLocation,
              remarks: this.leadData[0]?.remarks,
              calledFrom: this.leadData[0]?.calledFrom,
              createdOn: this.moment(this.leadData[0]?.createdOn).format(
                'YYYY-MM-DD  HH:mm:ss'
              ),
            });
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
        label: 'Leads',
        routerLink: '/user/leads',
        queryParams: { v: this.version },
      },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
    this.getLeadSourcesValues();
    this.getLeadUsers();
  }
  ngOnInit(): void {
    this.today = new Date();
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    // console.log(this.userDetails);
    this.createForm();
    if (this.loanType == 'personalLoan') {
      this.employmentStatus = 'employed';
    }
  }
  onStepChange(event: any) {
    this.activeIndex = event.index;
  }
  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
  createForm() {
    this.leadForm = this.formBuilder.group({
      contactPerson: ['', Validators.compose([Validators.required])],
      primaryPhone: [
        '',
        Validators.compose([
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/),

        ]),
      ],
      secondaryPhone: [''],
      email: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: ['', Validators.compose([Validators.required])],
      state: [''],
      pincode: [''],
      companyName: ['', Validators.compose([Validators.required])],
      designation: ['', Validators.compose([Validators.required])],
      salary: ['', Validators.compose([Validators.required])],
      jobExperience: ['', Validators.compose([Validators.required])],
      companyAddress: ['', Validators.compose([Validators.required])],
      existingLoanDetails: ['', Validators.compose([Validators.required])],
      leadSource: [''],
      sourcedBy: ['', Validators.compose([Validators.required])],
      createdOn: [''],
      hadOwnHouse: ['', Validators.compose([Validators.required])],
      loanRequirement: [''],
      propertyType: [''],
      propertyValue: [''],
      propertyLocation: [''],
      remarks: ['', Validators.compose([Validators.required])],
      calledFrom: ['', Validators.compose([Validators.required])],
    });
    this.leadFormforBusiness = this.formBuilder.group({
      contactPerson: ['', Validators.compose([Validators.required])],
      primaryPhone: [
        '',
        Validators.compose([
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/),
        ]),
      ],
      secondaryPhone: [''],
      email: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: ['', Validators.compose([Validators.required])],
      state: [''],
      pincode: [''],
      businessName: ['', Validators.compose([Validators.required])],
      businessEntity: ['', Validators.compose([Validators.required])],
      businessTurnover: ['', Validators.compose([Validators.required])],
      natureofBusiness: ['', Validators.compose([Validators.required])],
      product: ['', Validators.compose([Validators.required])],
      businessVintage: ['', Validators.compose([Validators.required])],
      existingLoanDetails: ['', Validators.compose([Validators.required])],
      leadSource: [''],
      sourcedBy: ['', Validators.compose([Validators.required])],
      createdOn: [''],
      hadOwnHouse: ['', Validators.compose([Validators.required])],
      loanRequirement: [''],
      propertyType: [''],
      propertyValue: [''],
      propertyLocation: [''],
      remarks: ['', Validators.compose([Validators.required])],
      calledFrom: ['', Validators.compose([Validators.required])],
    });
    if (
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType == '3' &&
      this.userDetails.id
    ) {
      this.leadForm.controls['sourcedBy'].setValue(this.userDetails.id);
      this.leadForm.controls['leadSource'].setValue(1);
      this.leadFormforBusiness.controls['sourcedBy'].setValue(
        this.userDetails.id
      );
      this.leadFormforBusiness.controls['leadSource'].setValue(1);
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
    let formData: any = {
      loanType: this.loanType,
      employmentStatus: this.employmentStatus,
      businessName: formValues.businessName,
      businessEntity: formValues.businessEntity,
      businessTurnover: formValues.businessTurnover,
      natureofBusiness: formValues.natureofBusiness,
      product: formValues.product,
      businessVintage: formValues.businessVintage,
      contactPerson: formValues.contactPerson,
      primaryPhone: formValues.primaryPhone,
      secondaryPhone: formValues.secondaryPhone,
      email: formValues.email,
      addressLine1: formValues.addressLine1,
      addressLine2: formValues.addressLine2,
      city: formValues.city,
      state: formValues.state,
      pincode: formValues.pincode,
      companyName: formValues.companyName,
      designation: formValues.designation,
      salary: formValues.salary,
      jobExperience: formValues.jobExperience,
      companyAddress: formValues.companyAddress,
      leadSource: formValues.leadSource,
      sourcedBy: formValues.sourcedBy,
      sourcedByName: this.getSourceName(formValues.sourcedBy),
      hadOwnHouse: formValues.hadOwnHouse,
      loanRequirement: formValues.loanRequirement,
      propertyValue: formValues.propertyValue,
      propertyLocation: formValues.propertyLocation,
      propertyType: formValues.propertyType,
      existingLoanDetails: formValues.existingLoanDetails,
      remarks: formValues.remarks,
      calledFrom: formValues.calledFrom,
      createdBy:
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.username,
    };
    // console.log('formData', formData);
    if (this.actionType == 'create') {
      // if (formValues.createdOn) {
      //   formData.createdOn = this.moment(formValues.createdOn).format(
      //     'YYYY-MM-DD HH:mm:ss'
      //   );
      //   formData.lastUpdatedOn = this.moment(formValues.createdOn).format(
      //     'YYYY-MM-DD HH:mm:ss'
      //   );
      // }

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
      this.leadsService.createLoanLead(formData).subscribe(
        (data) => {
          if (data) {
            // console.log(data);
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
      this.leadsService.updateLoanLead(this.leadId, formData).subscribe(
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
  getLoanLeadById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService.getLoanLeadById(this.leadId, filter).subscribe(
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
}

