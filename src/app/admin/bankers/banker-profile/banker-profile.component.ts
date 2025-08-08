import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-banker-profile',
  templateUrl: './banker-profile.component.html',
  styleUrl: './banker-profile.component.scss',
})
export class BankerProfileComponent implements OnInit {
  breadCrumbItems: any = [];
  bankerId: string | null = null;
  bankers: any = null;
  loading: boolean = false;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private leadsService: LeadsService,
    private location: Location,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    this.breadCrumbItems = [
      {

        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Lenders',
        routerLink: '/user/bankers',
        queryParams: { v: this.version },
      },
      { label: 'Profile' },
    ];
  }

  ngOnInit(): void {
    this.bankerId = this.route.snapshot.paramMap.get('id');
    if (this.bankerId) {
      this.getBankersDetailsById(this.bankerId);
    }
  }

  getBankersDetailsById(id: string) {
    this.loading = true;
    this.leadsService.getBankersDetailsById(id).subscribe(
      (response) => {
        this.bankers = response;
        // console.log('bankers', this.bankers);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'New':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Archived':
        return { textColor: '#FF555A', backgroundColor: '#FFE2E3' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  getStatusName(statusId) {
    if (this.leadInternalStatusList && this.leadInternalStatusList.length > 0) {
      let leadStatusName = this.leadInternalStatusList.filter(
        (leadStatus) => leadStatus.id == statusId
      );
      return (
        (leadStatusName &&
          leadStatusName[0] &&
          leadStatusName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }
  goBack() {
    this.location.back();
  }
}
