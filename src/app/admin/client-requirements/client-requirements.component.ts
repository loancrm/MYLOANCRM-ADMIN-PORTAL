import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-client-requirements',
  templateUrl: './client-requirements.component.html',
  styleUrls: ['./client-requirements.component.scss']
})
export class ClientRequirementsComponent implements OnInit {
requirementStatusChange(event: any): void {

  this.selectedRequirementStatus = event.value;

  this.loadRequirements(this.currentTableEvent);

}
inputValueChangeEvent(value: string): void {

  if (value === '') {

    this.accountIdToSearch = '';

    this.requirementTable.reset();   
    this.loadRequirements();         
  }

}

  @ViewChild('requirementTable') requirementTable!: Table;

  breadCrumbItems: any[] = [];

  requirements: any[] = [];

  requirementsCount = 0;

  apiLoading = false;
  currentTableEvent: any;

  accountIdToSearch = '';
  appliedFilter: any = {};

  filterConfig: any[] = [];

  selectedStatus= 'Active';

statusOptions = [
  {
    label: 'All',
    value: 'All'
  },
  {
    label: 'Active',
    value: 'Active'
  },
  {
    label: 'Inactive',
    value: 'Inactive'
  }
];
selectedRequirementStatus = 'All';

requirementStatusOptions = [
  {
    label: 'All',
    value: 'All'
  },
  {
    label: 'Pending',
    value: 'Pending'
  },
  {
    label: 'In Progress',
    value: 'In Progress'
  },
  {
    label: 'Completed',
    value: 'Completed'
  },
  {
    label: 'Rejected',
    value: 'Rejected'
  }
];
setFilterConfig() {

  this.filterConfig = [

    {
      header: 'Account ID',
      data: [
        {
          field: 'accountID',
          title: 'Account ID',
          type: 'text',
          filterType: 'like'
        }
      ]
    },


          {
        header: 'Requirement',
        data: [
          {
            field: 'requirement',
            title: 'Requirement',
            type: 'text',
            filterType: 'like'
          }
        ]
      },

    {
      header: 'Remarks',
      data: [
        {
          field: 'remarks',
          title: 'Remarks',
          type: 'text',
          filterType: 'like'
        }
      ]
    },

    {
      header: 'Status',
      data: [
        {
          field: 'status',
          title: 'Status',
          type: 'dropdown',
          filterType: 'eq',
          options: [
            { label: 'All', value: '' },
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' }
          ]
        }
      ]
    },

    {
      header: 'Requirement Status',
      data: [
        {
          field: 'requirementStatus',
          title: 'Requirement Status',
          type: 'dropdown',
          filterType: 'eq',
          options: [
            { label: 'All', value: '' },
            { label: 'Pending', value: 'Pending' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Rejected', value: 'Rejected' }
          ]
        }
      ]
    },

    {
      header: 'Deadline Date',
      data: [

        {
          field: 'deadlineDate',
          title: 'From',
          type: 'date',
          filterType: 'gte'
        },

        {
          field: 'deadlineDate',
          title: 'To',
          type: 'date',
          filterType: 'lte'
        }

      ]
    },

    {
      header: 'Created Date',
      data: [

        {
          field: 'createdOn',
          title: 'From',
          type: 'date',
          filterType: 'gte'
        },

        {
          field: 'createdOn',
          title: 'To',
          type: 'date',
          filterType: 'lte'
        }

      ]
    }

  ];

}
  constructor(
    private routingService: RoutingService,
    private toastService: ToastService,
    private location: Location,
    private leadsService: LeadsService
  ) {

    this.breadCrumbItems = [
      {
        label: 'Home',
        routerLink: '/admin/dashboard'
      },
      {
        label: 'Client Requirements'
      }
    ];

  }
ngOnInit(): void {
  this.selectedStatus = 'Active';
  this.setFilterConfig();
  this.loadRequirements();
}

loadRequirements(event?: any): void {

  this.currentTableEvent = event;

  let filter = this.leadsService.setFiltersFromPrimeTable(event);
  filter['sort'] = 'id,desc';
    filter = Object.assign(
          {},
          filter,
          this.appliedFilter
      );
  if (this.accountIdToSearch?.trim()) {
    filter['accountID-like'] = this.accountIdToSearch.trim();
  }

    if (this.selectedStatus && this.selectedStatus !== 'All') {
      filter['status-eq'] = this.selectedStatus;
    }

    if (
      this.selectedRequirementStatus &&
      this.selectedRequirementStatus !== 'All'
    ) {
      filter['requirementStatus-eq'] =
        this.selectedRequirementStatus;
    }

  this.leadsService.getClientRequirements(filter).subscribe((data: any) => {
    this.requirements = data;
  });

  this.leadsService.getClientRequirementsCount(filter).subscribe((count: any) => {
    this.requirementsCount = Number(count);
  });

}
viewRequirement(event: any) {

  const requirement = event.data;

  this.routingService.handleRoute(
    'client-requirements/view/' + requirement.id,
    null
  );

}
actionItems(item: any): MenuItem[] {

  return [
    {
      label: item.status === 'Active'
        ? 'Mark as Inactive'
        : 'Mark as Active',

      icon: item.status === 'Active'
        ? 'pi pi-times-circle'
        : 'pi pi-check-circle',

      command: () => this.changeRequirementStatus(
        item.id,
        item.status === 'Active'
          ? 'Inactive'
          : 'Active'
      )
    }
  ];

}
  changeRequirementStatus(id: number, status: string) {

  this.leadsService.changeClientRequirementStatus(id, status).subscribe(
    (data: any) => {

      this.toastService.showSuccess(
        'Status Updated Successfully'
      );

      this.loadRequirements();

    },
    (error: any) => {

      this.toastService.showError(error);

    }
  );

}


updateRequirement(id: number) {

  this.routingService.handleRoute(
    'client-requirements/update/' + id,
    null
  );

}
  filterWithAccountID(): void {
     this.loadRequirements(this.currentTableEvent);
  }
  

  statusChange(event: any): void {
    this.selectedStatus = event.value;
    this.loadRequirements(this.currentTableEvent);
  }

  createRequirement(): void {
    this.routingService.handleRoute(
      'client-requirements/create',
      null
    );
  }

  goBack(): void {
    this.location.back();
  }
applyConfigFilters(event: any): void {

  if (event.reset) {

    delete event.reset;

    this.appliedFilter = {};

  } else {

    this.appliedFilter = event;

  }

  this.loadRequirements(this.currentTableEvent);

}

}