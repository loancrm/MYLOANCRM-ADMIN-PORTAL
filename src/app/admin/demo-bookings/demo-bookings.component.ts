import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-demo-bookings',
  templateUrl: './demo-bookings.component.html',
  styleUrls: ['./demo-bookings.component.scss']
})
export class DemoBookingsComponent {

  @ViewChild('DemoBookingsTable') table!: Table;

  demoBookings: any[] = [];
  demoBookingsCount = 0;
  loading = false;

  globalSearch = '';
  selectedStatus: any = null;

  statusOptions = [
    { label: 'All', value: '' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Rescheduled', value: 'rescheduled' }
  ];

  currentEvent: any;
  rescheduleDialog = false;
  selectedBooking: any = null;

  rescheduleDate: any = null;
  rescheduleTime: any = null;
  availableSlots: any[] = [];
  editingRowId: number | null = null;
  users: any[] = [];
  loggedInUserRole!: number;

  constructor(
    private leadsService: LeadsService,
    private toast: ToastService,
    private location: Location,
  ) {}

  ngOnInit() {
     this.loadUsers();
      const adminDetails =
    JSON.parse(localStorage.getItem('adminDetails') || '{}');

  this.loggedInUserRole = Number(adminDetails?.user?.role || 0);

  this.loadUsers();
  this.loadDemoBookings({ first: 0, rows: 10 });
    // this.loadDemoBookings({ first: 0, rows: 10 });
  }

  // loadUsers() {
  //   this.leadsService.getUsers().subscribe((res: any) => {
  //     this.users = res;
  //   });
  // }
  loadUsers() {
    this.leadsService.getUsers().subscribe((res: any) => {
      this.users = res.filter((u: any) => u.status === 1);
    });
  }

  loadDemoBookings(event: any) {
    this.currentEvent = event;

    // const filter: any = {
    //   from: event.first,
    //   count: event.rows,
    //   search: this.globalSearch || '',
    //   status: this.selectedStatus || ''
    // };
    const filter: any = {
      from: event.first,
      count: event.rows
    };

    if (this.globalSearch && this.globalSearch.trim() !== '') {
      filter.search = this.globalSearch.trim();
    }

    if (this.selectedStatus) {
      filter.status = this.selectedStatus;
    }

    this.loading = true;

    this.leadsService.getDemoBookings(filter).subscribe(
      (res: any) => {
        this.demoBookings = res;
        this.loading = false;
      },
      () => {
        this.toast.showError('Failed to load bookings');
        this.loading = false;
      }
    );

    this.leadsService.getDemoBookingsCount(filter).subscribe(
      (count: any) => {
        this.demoBookingsCount = Number(count);
      }
    );
  }

  onSearch() {
    this.reload();
  }

  onStatusChange() {
    this.reload();
  }

  reload() {
    if (this.table) this.table.first = 0;
    this.loadDemoBookings({ first: 0, rows: 10 });
  }

  updateStatus(row: any, status: string) {
    this.leadsService.updateBookingStatus(row.id, { status }).subscribe(
      () => {
        row.status = status;
        this.toast.showSuccess('Status updated');
      },
      () => {
        this.toast.showError('Update failed');
      }
    );
  }
   goBack() {
    this.location.back();
  }

 openReschedule(row: any) {
  this.selectedBooking = row;
  this.rescheduleDialog = true;

  // PRE-FILL existing values
  this.rescheduleDate = row.demo_date ? new Date(row.demo_date) : null;
  this.rescheduleTime = row.demo_time || null;

  // load slots immediately if date exists
  if (this.rescheduleDate) {
    this.loadSlots();
  }
}

loadSlots() {
  if (!this.rescheduleDate) return;

  // const date = new Date(this.rescheduleDate)
  //   .toISOString()
  //   .split('T')[0];
  const date = this.rescheduleDate
  ? this.rescheduleDate.toLocaleDateString('en-CA')
  : null;

  this.leadsService.getSlots(date).subscribe((res: any) => {
    this.availableSlots = res.availableSlots.map((s: any) => ({
      label: s,
      value: s
    }));
  });
}

// confirmReschedule() {
//   if (!this.selectedBooking || !this.rescheduleDate || !this.rescheduleTime) {
//     this.toast.showError('Select date and time');
//     return;
//   }

//   const date = new Date(this.rescheduleDate)
//     .toISOString()
//     .split('T')[0];

//   this.leadsService.updateBookingStatus(
//     this.selectedBooking.id,
//     {
//       status: 'rescheduled',
//       demo_date: date,
//       demo_time: this.rescheduleTime
//     }
//   ).subscribe(
//     () => {
//       this.toast.showSuccess('Rescheduled successfully');

//       this.rescheduleDialog = false;

//       this.loadDemoBookings(this.currentEvent);
//     },
//     () => {
//       this.toast.showError('Reschedule failed');
//     }
//   );
// }
confirmReschedule() {
  if (!this.selectedBooking || !this.rescheduleDate || !this.rescheduleTime) {
    this.toast.showError('Select date and time');
    return;
  }

  const date = this.rescheduleDate
    ? this.rescheduleDate.toLocaleDateString('en-CA')
    : null;

  this.leadsService.updateBookingStatus(
    this.selectedBooking.id,  
    {
      status: 'rescheduled',
      demo_date: date,
      demo_time: this.rescheduleTime
    }
  ).subscribe(
    () => {
      this.toast.showSuccess('Rescheduled successfully');
      this.rescheduleDialog = false;
      this.loadDemoBookings(this.currentEvent);
    },
    () => {
      this.toast.showError('Reschedule failed');
    }
  );
}

enableEdit(row: any) {
  this.editingRowId = row.id;
}
saveNotes(row: any) {
  const payload = {
    notes: row.notes
  };

  this.leadsService.updateBookingStatus(row.id, payload).subscribe(
    () => {
      this.toast.showSuccess('Notes updated');
      this.editingRowId = null;
    },
    () => {
      this.toast.showError('Failed to update notes');
    }
  );
}

assignUser(row: any) {
  const payload = {
    assign_to: row.assign_to
  };

  this.leadsService.updateBookingStatus(row.id, payload).subscribe(
    () => {
      this.toast.showSuccess('User assigned successfully');
    },
    () => {
      this.toast.showError('Assignment failed');
    }
  );
}

clearFilters() {
  this.globalSearch = '';
  this.selectedStatus = null;
  this.reload();
}
}
