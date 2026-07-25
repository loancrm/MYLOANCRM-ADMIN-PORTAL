import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  selectedLead: any = {};

  loggedInUserRole: number = 0;

  assignFilterOptions: any[] = [];
  adminRemarkOptions: any[] = [];

  // Sidebar Variables
  sidebarVisible: boolean = false;
  filteredNotes: any[] = [];
  notes: any[] = [];
  allNotes: any[] = [];
  searchText: string = '';
  selectedDate: Date | null = null;

  newNote = {
    remarks: ''
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) { }

  //   ngOnInit(): void {

  //     const id = this.route.snapshot.paramMap.get('id');

  // const adminDetails = JSON.parse(localStorage.getItem('adminDetails') || '{}');

  // this.leadsService.addSocialMediaLeadRemark(
  //   this.selectedLead.id,
  //   {
  //     remarks: this.newNote.remarks,
  //     updatedBy: adminDetails?.user?.name
  //   }
  // ).subscribe({
  //   next: (res: any) => {
  //     this.notes = res.notes || [];
  //     this.filteredNotes = [...this.notes];
  //     this.newNote = { remarks: '' };
  //     this.toastService.showSuccess('Remark added successfully');
  //   },
  //   error: (err) => {
  //     // console.error(err);
  //     this.toastService.showError('Failed to save remark');
  //   }
  // });

  //     this.loggedInUserRole = Number(adminDetails?.user?.role || 0);

  //     this.loadAssignFilterOptions();
  //     this.loadAdminRemarks();

  //     if (id) {
  //       this.loadLead(id);
  //     }
  //   }
  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    const adminDetails = JSON.parse(
      localStorage.getItem('adminDetails') || '{}'
    );

    this.loggedInUserRole = Number(adminDetails?.user?.role || 0);

    this.loadAssignFilterOptions();
    this.loadAdminRemarks();

    if (id) {
      this.loadLead(id);
    }
  }

  addRemarks(): void {

    if (!this.newNote.remarks.trim()) {
      return;
    }

    const adminDetails = JSON.parse(
      localStorage.getItem('adminDetails') || '{}'
    );

    this.leadsService.addSocialMediaLeadRemark(
      this.selectedLead.id,
      {
        remarks: this.newNote.remarks,
        updatedBy: adminDetails?.user?.name
      }
    ).subscribe({
      next: (res: any) => {

        this.notes = res.notes || [];
        this.filteredNotes = [...this.notes];

        this.newNote = { remarks: '' };

        this.toastService.showSuccess('Remark added successfully');

      },
      error: (err) => {
        console.error(err);
        this.toastService.showError('Failed to save remark');
      }
    });

  }
  goBack(): void {
    this.location.back();
  }

  loadLead(id: any): void {

    this.leadsService.getSocialMediaLeadById(id).subscribe(
      (data: any) => {

        this.selectedLead = data;

        // Load saved remarks
        this.loadNotes(this.selectedLead.id);

      },
      () => {
        this.toastService.showError('Lead not found');
      }
    );

  }

  loadAssignFilterOptions(): void {
    this.leadsService.getUsers({
      'status-eq': 1
      // 'role-eq': 2
    }).subscribe((data: any) => {

      this.assignFilterOptions = data.map((user: any) => ({
        label: user.name,
        value: user.id
      }));

    });
  }

  loadAdminRemarks(): void {
    this.leadsService.getAdminRemarks({
      'status-eq': 3,
      'remarkInternalStatus-eq': 1
    }).subscribe((data: any) => {

      this.adminRemarkOptions = data.map((remark: any) => ({
        label: remark.displayName,
        value: String(remark.remarkId)
      }));

    });
  }

  goToCampaign(lead: any): void {

    this.router.navigate(
      ['/admin/social-media-leads/single-campaign'],
      {
        queryParams: {
          phone: lead.PhoneNumber,
          name: lead.Name,
          email: lead.Email || '',
          city: lead.City || '',
          company: lead.Company || '',
          state: lead.State || '',
          platform: lead.Platform || ''
        }
      }
    );

  }

  sendEmail(lead: any): void {
    if (lead.Email) {
      window.location.href = `mailto:${lead.Email}`;
    }
  }

  editLead(lead: any): void {

    this.router.navigate(
      ['/admin/social-media-leads/create'],
      {
        queryParams: {
          id: lead.id
        }
      }
    );

  }

  openWebsite(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onLeadAssignChange(lead: any, userId: any): void {
    this.leadsService.updateLeadAssign(lead.id, userId).subscribe(() => {
      this.toastService.showSuccess('Assigned successfully');
    });
  }

  onRemarkChange(lead: any, remarkId: any): void {
    this.leadsService.updateLeadRemark(lead.id, remarkId).subscribe(() => {
      this.toastService.showSuccess('Remark updated');
    });
  }


  // ===========================
  // Sidebar Methods
  // ===========================

  toggleSidebar(): void {

    this.sidebarVisible = !this.sidebarVisible;

    if (this.sidebarVisible && this.selectedLead?.id) {
      this.loadNotes(this.selectedLead.id);
    }

  }
  // addRemarks(): void {

  //   alert('addRemarks called');

  //   console.log("selectedLead =", this.selectedLead);
  //   console.log("selectedLead.id =", this.selectedLead?.id);

  //   if (!this.newNote.remarks.trim()) {
  //     return;
  //   }

  //   this.leadsService.addSocialMediaLeadRemark(
  //     this.selectedLead.id,
  //     this.newNote
  //   ).subscribe({
  //     next: (res: any) => {
  //       console.log("Success", res);
  //     },
  //     error: (err) => {
  //       console.log("Error", err);
  //     }
  //   });
  // }
  loadNotes(leadId: any): void {

    this.leadsService.getSocialMediaLeadNotes(leadId).subscribe({
      next: (res: any) => {

        console.log("Notes Response:", res);

        this.notes = res.notes || [];
        this.filteredNotes = [...this.notes];

      },
      error: (err) => {
        console.error(err);
      }
    });

  }
  applyFilters(): void {

    let filtered = [...this.notes];

    // Search Filter
    if (this.searchText.trim()) {

      const search = this.searchText.toLowerCase();

      filtered = filtered.filter((note: any) =>
        note.remarks?.toLowerCase().includes(search)
      );

    }

    // Date Filter
    if (this.selectedDate) {

      filtered = filtered.filter((note: any) => {

        const noteDate = new Date(note.date);
        const selected = new Date(this.selectedDate!);

        return (
          noteDate.getDate() === selected.getDate() &&
          noteDate.getMonth() === selected.getMonth() &&
          noteDate.getFullYear() === selected.getFullYear()
        );

      });

    }

    this.filteredNotes = filtered;

  }
  clearFilters(): void {

    this.searchText = '';
    this.selectedDate = null;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

}