import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  loggedInUserRole: number = 0;

  requirementForm!: UntypedFormGroup;

  loading = false;
  submitted = false;
  moment: any;
  requirementId: any;

  heading = 'Create Client Requirement';

  actionType = 'create';

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  requirementStatusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private leadsService: LeadsService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe(params => {

      if (params['id']) {

        this.requirementId = params['id'];

        this.actionType = 'update';

        this.heading = 'Update Client Requirement';

        this.getRequirementById();

      }

    });

  }
  getRequirementById() {

    this.loading = true;

    this.leadsService.getClientRequirementById(this.requirementId).subscribe(
      (data: any) => {

        this.loading = false;

        this.requirementForm.patchValue({

          accountId: data.accountID,

          requirement: data.requirement,

          remarks: data.remarks,

          status: data.status,

          requirementStatus: data.requirementStatus,

          deadlineDate: new Date(data.deadlineDate)

        });

      },
      (error: any) => {

        this.loading = false;

        this.toastService.showError(error);

      }
    );

  }

  ngOnInit(): void {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');
    this.loggedInUserRole = Number(adminDetails?.user?.role || 0);
    this.createForm();
  }

  createForm() {

    this.requirementForm = this.fb.group({

      accountId: ['', Validators.required],
      requirement: [''],

      remarks: [''],

      status: ['Active', Validators.required],

      requirementStatus: ['Pending', Validators.required],

      deadlineDate: ['']

    });

  }


  onSubmit(formValues: any) {

    this.submitted = true;

    if (this.requirementForm.invalid) {
      return;
    }

    const formData = {

      accountId: formValues.accountId,

      requirement: formValues.requirement,

      remarks: formValues.remarks,

      status: formValues.status,

      requirementStatus: formValues.requirementStatus,

      deadlineDate:
        this.moment(formValues.deadlineDate).format('YYYY-MM-DD')

    };

    this.loading = true;

    if (this.actionType === 'create') {

      this.leadsService.createClientRequirement(formData).subscribe(

        (data: any) => {

          this.loading = false;

          this.toastService.showSuccess('Client Requirement Created Successfully');

          this.routingService.handleRoute(
            'client-requirements',
            null
          );

        },

        (error: any) => {

          this.loading = false;

          this.toastService.showError(error);

        }

      );

    } else {

      this.leadsService.updateClientRequirement(
        this.requirementId,
        formData
      ).subscribe(

        (data: any) => {

          this.loading = false;

          this.toastService.showSuccess('Client Requirement Updated Successfully');

          this.routingService.handleRoute(
            'client-requirements',
            null
          );

        },

        (error: any) => {

          this.loading = false;

          this.toastService.showError(error);

        }

      );

    }

  }

  goBack() {
    this.location.back();
  }

}