import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {

  accountId: any;
  accountName: string = '';

  subscriptions: any[] = [];
  subscriptionCount: any = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private leadService: LeadsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Read accountId from route — works when navigated from global analytics
     this.accountId = this.route.snapshot.paramMap.get('id');
  }

  loadSubscriptions(event: any) {
    if (!this.accountId) return;

    let api_filter = this.leadService.setFiltersFromPrimeTable(event);
    api_filter['accountId-eq'] = this.accountId;
    this.loading = true;

    this.leadService.getSubscriptions(api_filter).subscribe(
      (response: any) => {
        this.subscriptions = response || [];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );

    this.leadService.getSubscriptionsCount(api_filter).subscribe(
      (response: any) => {
        this.subscriptionCount = parseInt(response) || 0;
      },
      (error: any) => {
        console.error('Error fetching subscriptions count:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Active':    return 'badge bg-success';
      case 'Expired':   return 'badge bg-danger';
      case 'Cancelled': return 'badge bg-secondary';
      case 'Trial':     return 'badge bg-warning text-dark';
      default:          return 'badge bg-light text-dark';
    }
  }
}
// import { Component, Input, OnInit } from '@angular/core';
// import { LeadsService } from '../leads/leads.service';
// import { ToastService } from 'src/app/services/toast.service';
// import { Location } from '@angular/common';
// @Component({
//   selector: 'app-subscriptions',
//   templateUrl: './subscriptions.component.html',
//   styleUrl: './subscriptions.component.scss'
// })
// export class SubscriptionsComponent implements OnInit {

//   @Input() accountId: any;

//   subscriptions: any[] = [];
//   subscriptionCount: any = 0;
//   loading: boolean = false;

//   constructor(
//     private leadService: LeadsService,
//     private toastService: ToastService,
//     private location: Location,
//   ) {}

//   ngOnInit(): void {
//     // initial load is triggered by p-table's onLazyLoad
//   }

//   loadSubscriptions(event: any) {
//     let api_filter = this.leadService.setFiltersFromPrimeTable(event);
//     api_filter['accountId-eq'] = this.accountId;
//     this.loading = true;

//     this.leadService.getSubscriptions(api_filter).subscribe(
//       (response: any) => {
//         this.subscriptions = response || [];
//         this.loading = false;
//       },
//       (error: any) => {
//         this.loading = false;
//         this.toastService.showError(error);
//       }
//     );

//     this.leadService.getSubscriptionsCount(api_filter).subscribe(
//       (response: any) => {
//         this.subscriptionCount = parseInt(response) || 0;
//       },
//       (error: any) => {
//         console.error('Error fetching subscriptions count:', error);
//       }
//     );
//   }

//   getStatusClass(status: string) {
//     switch (status) {
//       case 'Active':   return 'badge bg-success';
//       case 'Expired':  return 'badge bg-danger';
//       case 'Cancelled': return 'badge bg-secondary';
//       case 'Trial':    return 'badge bg-warning text-dark';
//       default:         return 'badge bg-light text-dark';
//     }
//   }

//    goBack() {
//     this.location.back();
//   }
// }
