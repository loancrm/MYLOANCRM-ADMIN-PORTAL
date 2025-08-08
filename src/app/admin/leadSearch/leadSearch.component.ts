import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './leadSearch.component.html',
  styleUrl: './leadSearch.component.scss',
})
export class LeadSearchComponent {
  dialogData: any;
  leadUsers: any = [];
  loading: any;
  constructor(
    private fileUploadRef: DynamicDialogRef,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private dialogConfig: DynamicDialogConfig,
    private routingService: RoutingService,
  ) {
    this.getLeadUsers();
  }

  ngOnInit() {
    if (this.dialogConfig && this.dialogConfig.data) {
      this.dialogData = this.dialogConfig.data.leadDetails;
      // console.log(this.dialogData);
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
 viewLeadProfile(leadId: string) {
  this.loading = true;            // Start loading
  this.fileUploadRef.close();
  this.routingService.handleRoute('leads/profile/' + leadId, null);
  // Note: You need to reset loading = false in LeadsProfileComponent after data loads
}

  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers: any) => {
        this.leadUsers = [{ name: 'All' }, ...leadUsers];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  close() {
    this.fileUploadRef.close();
  }
  ngOnDestroy() {
    this.fileUploadRef.close();
  }
}
