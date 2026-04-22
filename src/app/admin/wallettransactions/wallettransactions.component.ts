import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-wallettransactions',
  templateUrl: './wallettransactions.component.html',
  styleUrl: './wallettransactions.component.scss'
})
export class WallettransactionsComponent {
  accountId: any;
  accountName: string = '';
  payments: any[] = [];
  loading: boolean = false;
  currentTableEvent: any;
   searchFilter: any = {};
   walletTransactions: any[] = [];
   wallettransactionsCount: any = 0;
constructor(
    private route: ActivatedRoute,
    private location: Location,
    private leadService: LeadsService,
    private toastService: ToastService
  ) {}

   ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
   }

   loadWalletTransactions(event: any) {
  this.currentTableEvent = event;

  let api_filter = this.leadService.setFiltersFromPrimeTable(event);
   api_filter = Object.assign({}, api_filter, this.searchFilter);
  api_filter['accountId-eq'] = this.accountId;

  this.loading = true;

  this.leadService.getWalletTransactions(api_filter).subscribe(
  (res: any) => {
    this.walletTransactions = res || [];
    this.loading = false;
  },
  (err) => {
    this.loading = false;
    this.toastService.showError(err);
  }
);
  this.leadService.getWalletTransactionsCount(api_filter).subscribe(
    (count: any) => {
      this.wallettransactionsCount = parseInt(count) || 0;
    },
    (err) => console.error(err)
  );
}

  goBack(): void {
    this.location.back();
  }
}
