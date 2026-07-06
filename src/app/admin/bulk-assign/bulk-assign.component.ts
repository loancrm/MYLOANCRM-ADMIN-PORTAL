import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';

@Component({
  selector: 'app-bulk-assign',
  templateUrl: './bulk-assign.component.html',
  styleUrls: ['./bulk-assign.component.scss']
})
export class BulkAssignComponent {
  constructor(
  private leadsService: LeadsService,
  private toastService: ToastService
) {}
@Input() visible = false;

  @Input() selectedLeads: any[] = [];

  @Input() salesUsers: any[] = [];
  @Input() totalLeads = 0;

@Input() currentPageLeads: any[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() assignComplete = new EventEmitter<void>();

  assignScope = 'selected';
  

  selectedAssignee: any = null;

  submitting = false;

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
 
submit() {

  if (!this.selectedAssignee) {
    this.toastService.showError('Please select a user');
    return;
  }

  let leadIds: number[] = [];

  if (this.assignScope === 'selected') {
    leadIds = this.selectedLeads.map(x => x.id);
  }

  if (this.assignScope === 'page') {
    leadIds = this.currentPageLeads.map(x => x.id);
  }

  if (this.assignScope === 'all') {
    leadIds = this.currentPageLeads.map(x => x.id); // For now
  }

  const payload = {
    assign_to: this.selectedAssignee,
    leadIds: leadIds
  };

  console.log(payload);

  this.leadsService.bulkAssignSocialMediaLeads(payload).subscribe({
    next: () => {
      this.toastService.showSuccess('Leads assigned successfully');
      this.assignComplete.emit();
      this.closeDialog();
    },
    error: (err) => {
      console.log(err);
      this.toastService.showError('Bulk Assign Failed');
    }
  });

}
  
getAssignCount(): number {

  if (this.assignScope === 'all') {
    return this.totalLeads;
  }

  if (this.assignScope === 'page') {
    return this.currentPageLeads.length;
  }

  return this.selectedLeads.length;
}
}
