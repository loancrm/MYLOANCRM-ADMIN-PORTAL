import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import moment from 'moment-timezone';

@Component({
  selector: 'app-create-social-media-lead',
  templateUrl: './create-social-media-lead.component.html',
  styleUrl: './create-social-media-lead.component.scss'
})
export class CreateSocialMediaLeadComponent implements OnInit {

  isEditMode = false;
  leadId: any = null;
  saving = false;

  form = {
    Name: '',
    Email: '',
    PhoneNumber: '',
    Company: '',
    City: '',
    State: '',
    pinCode: '',
    Platform: 'Manual',
    Website: '',
    CallbackDate: null as Date | null
  };

  platformOptions = [
    { label: 'Facebook',  value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'WhatsApp',  value: 'WhatsApp' },
    // { label: 'Google',    value: 'Google' },
    { label: 'Manual',    value: 'Manual' },
    { label: 'Others', value: 'Others'}
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Check if edit mode — id passed as query param
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.leadId = params['id'];
        this.loadLead(this.leadId);
      }
    });
  }

  loadLead(id: any): void {
    this.leadsService.getSocialMediaLeadById(id).subscribe(
      (data: any) => {
        this.form = {
          Name:        data.Name || '',
          Email:       data.Email || '',
          PhoneNumber: data.PhoneNumber || '',
          Company:     data.Company || '',
          City:        data.City || '',
          State:       data.State || '',
          pinCode:     data.pinCode || '',
          Platform:    data.Platform || 'Manual',
          Website:     data.Website || '',
          // CallbackDate: data.CallbackDate ? new Date(data.CallbackDate) : null
          CallbackDate: data.CallbackDate
          ? moment.utc(data.CallbackDate).tz('Asia/Kolkata').toDate()  // ← UTC → IST for display
          : null
        };
      },
      () => this.toastService.showError('Failed to load lead')
    );
  }

  // save(): void {
  //   if (!this.form.Name.trim() || !this.form.PhoneNumber.trim()) {
  //     this.toastService.showError('Name and Phone are required');
  //     return;
  //   }

  //   this.saving = true;

  //   if (this.isEditMode) {
  //     this.leadsService.updateSocialMediaLead(this.leadId, this.form).subscribe(
  //       () => {
  //         this.saving = false;
  //         this.toastService.showSuccess('Lead updated successfully');
  //         this.goBack();
  //       },
  //       () => {
  //         this.saving = false;
  //         this.toastService.showError('Failed to update lead');
  //       }
  //     );
  //   } else {
  //     this.leadsService.createSocialMediaLead(this.form).subscribe(
  //       () => {
  //         this.saving = false;
  //         this.toastService.showSuccess('Lead created successfully');
  //         this.goBack();
  //       },
  //       () => {
  //         this.saving = false;
  //         this.toastService.showError('Failed to create lead');
  //       }
  //     );
  //   }
  // }

  save(): void {
  if (!this.form.Name.trim() || !this.form.PhoneNumber.trim()) {
    this.toastService.showError('Name and Phone are required');
    return;
  }

  this.saving = true;

  const payload = {
    ...this.form,
    CallbackDate: this.form.CallbackDate
      ? moment(this.form.CallbackDate)
          .tz('Asia/Kolkata')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')   // ← IST → UTC before saving
      : null
  };

  if (this.isEditMode) {
    this.leadsService.updateSocialMediaLead(this.leadId, payload).subscribe(
      () => {
        this.saving = false;
        this.toastService.showSuccess('Lead updated successfully');
        this.goBack();
      },
      () => {
        this.saving = false;
        this.toastService.showError('Failed to update lead');
      }
    );
  } else {
    this.leadsService.createSocialMediaLead(payload).subscribe(
      () => {
        this.saving = false;
        this.toastService.showSuccess('Lead created successfully');
        this.goBack();
      },
      () => {
        this.saving = false;
        this.toastService.showError('Failed to create lead');
      }
    );
  }
}
  goBack(): void {
    this.location.back();
  }
}