// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-account-leads-breakdown',
//   templateUrl: './account-leads-breakdown.component.html',
//   styleUrl: './account-leads-breakdown.component.scss'
// })
// export class AccountLeadsBreakdownComponent {

// }

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LeadsService } from '../../leads/leads.service';
import { RoutingService } from 'src/app/services/routing-service';

@Component({
  selector: 'app-account-leads-breakdown',
  templateUrl: './account-leads-breakdown.component.html',
  styleUrls: ['./account-leads-breakdown.component.scss'],
})
export class AccountLeadsBreakdownComponent implements OnInit, OnDestroy {

  @ViewChild('leadsTable') leadsTable: any;

  // ── Route params ──
  accountId    = '';
  accountName  = '';
  metric       = 'leads';
  loanType     = 'all';

  // ── Table state ──
  loading      = false;
  leads: any[] = [];
  totalRecords = 0;
  search       = '';
  tableReady = false;

  // ── Metric display map ──
  metricLabelMap: Record<string, string> = {
    leads:          'Leads',
    files:          'Files',
    credit:         'Credit',
    logins:         'Logins',
    inhouseRejects: 'Inhouse Rejects',
    bankRejects:    'Lender Rejects',
    cniRejects:     'CNI Rejects',
    sanctioned: 'Sanctioned',
    disbursed:  'Disbursed',
    bankers: 'Lenders',
  };

  metricIconMap: Record<string, string> = {
    leads:          'pi-users',
    files:          'pi-folder-open',
    credit:         'pi-credit-card',
    logins:         'pi-sign-in',
    inhouseRejects: 'pi-home',
    bankRejects:    'pi-building',
    cniRejects:     'pi-times-circle',
    sanctioned: 'pi-check-circle',
  disbursed:  'pi-wallet',
  bankers: 'pi-building',
  };

  metricColorMap: Record<string, string> = {
    leads:          '#534AB7',
    files:          '#185FA5',
    credit:         '#0F6E56',
    logins:         '#854F0B',
    inhouseRejects: '#993C1D',
    bankRejects:    '#A32D2D',
    cniRejects:     '#7B3FA0',
    sanctioned: '#0F6E56',
  disbursed:  '#534AB7',
  bankers: '#534AB7',
  };

  metricBgMap: Record<string, string> = {
    leads:          '#EEEDFE',
    files:          '#E6F1FB',
    credit:         '#E1F5EE',
    logins:         '#FAEEDA',
    inhouseRejects: '#FAECE7',
    bankRejects:    '#FCEBEB',
    cniRejects:     '#F5EBF9',
    sanctioned: '#E1F5EE',
  disbursed:  '#EEEDFE',
   bankers: '#EEEDFE',
  };

  loanTypeOptions = [
    { label: 'All',                     value: 'all'                   },
    { label: 'Business Loan',           value: 'businessLoan'          },
    { label: 'Personal Loan',           value: 'personalLoan'          },
    { label: 'Home Loan',               value: 'homeLoan'              },
    { label: 'Mortgage Loan',           value: 'lap'                   },
    { label: 'Professional Loan',       value: 'professionalLoans'     },
    { label: 'Car Loan',                value: 'carLoan'               },
    { label: 'Commercial Vehicle Loan', value: 'commercialVehicleLoan' },
    { label: 'Educational Loan',        value: 'educationalLoan'       },
  ];
  banks: any[]     = [];
bankTotal        = 0;
bankLoading      = false;

@ViewChild('bankTable') bankTable: any;

  private searchSubject = new Subject<string>();
  private destroy$      = new Subject<void>();

  constructor(
    private route:          ActivatedRoute,
    private location:       Location,
    private leadsService:   LeadsService,
    private routingService: RoutingService,
  ) {}
  ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.accountId = params['accountId'] || '';
  });

  // ── Read sessionStorage FIRST before unlocking table ──
  const stored = sessionStorage.getItem('breakdownParams');
  if (stored) {
    try {
      const p      = JSON.parse(stored);
      this.metric      = p.metric      || 'leads';
      this.loanType    = p.loanType    || 'all';   // ← dropdown gets correct value
      this.accountName = p.accountName || '';
    } catch {}
    sessionStorage.removeItem('breakdownParams');
  }

  // ── Unlock table AFTER loanType is set ──
  this.tableReady = true;

  this.searchSubject.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  ).subscribe(() => {
    this.onLazyLoad({ first: 0, rows: 10 });
  });
}
    // ngOnInit(): void {
    //   // ── accountId from route param ──
    //   this.route.params.subscribe(params => {
    //     this.accountId = params['accountId'] || '';
        
    //   });

    //   // ── metric/loanType/accountName from sessionStorage ──
    //   // (passed by global-analytics before navigating)
    //   const stored = sessionStorage.getItem('breakdownParams');
    //   if (stored) {
    //     try {
    //       const p        = JSON.parse(stored);
    //       this.metric      = p.metric      || 'leads';
    //       this.loanType    = p.loanType    || 'all';
    //       this.accountName = p.accountName || '';
    //     } catch {}
    //     sessionStorage.removeItem('breakdownParams'); // ← clean up after reading
    //   }

    //   // ── Debounced search ──
    //   this.searchSubject.pipe(
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     takeUntil(this.destroy$)
    //   ).subscribe(() => {
    //     this.onLazyLoad({ first: 0, rows: 10 });
    //   });
    // }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLazyLoad(event: any): void {
  // if (!this.accountId) return;
   if (!this.accountId || !this.tableReady) return; 

  // ── Bankers metric → use getBankWiseAnalytics ──
  // if (this.isBankersMetric) {
  //   this.bankLoading = true;
  //   const from = event.first ?? 0;
  //   const rows = event.rows  ?? 10;

  //   this.leadsService.getBankWiseAnalytics(
  //     this.accountId,
  //     this.loanType,
  //     from,
  //     rows
  //   ).subscribe(
  //     (res: any) => {
  //       this.banks        = res.banks || [];
  //       this.bankTotal    = res.total || 0;
  //       this.totalRecords = res.total || 0;
  //       this.bankLoading  = false;
  //     },
  //     () => { this.bankLoading = false; }
  //   );
  //   return;  // ← stop here, don't run leads logic below
  // }
  if (this.isBankersMetric) {
  this.bankLoading = true;
  const from = event.first ?? 0;
  const rows = event.rows  ?? 10;

  this.leadsService.getBankWiseAnalytics(
    this.accountId,
    this.loanType,
    from,
    rows
  ).subscribe(
    (res: any) => {
      const rawBanks = res.banks || [];
      this.bankTotal = res.total || 0;
      this.totalRecords = res.total || 0;

      // ✅ SAME LOGIC AS SAMPLE FILE
      if (this.loanType === 'all') {
        const rows2: any[] = [];

        rawBanks.forEach((bank: any) => {
          if (bank.loanTypes && bank.loanTypes.length > 0) {
            bank.loanTypes.forEach((lt: any) => {
              rows2.push({
                bankName: bank.bankName,
                loanType: lt.loanType,
                filesProcessed: lt.filesProcessed,
                totalSanctioned: lt.totalSanctioned,
                totalDisbursed: lt.totalDisbursed,
                highestSanctioned: lt.highestSanctioned,
                highestDisbursed: lt.highestDisbursed,
                lowestSanctioned: lt.lowestSanctioned || 0,
                lowestDisbursed: lt.lowestDisbursed || 0,
                avgSanctioned: lt.avgSanctioned || 0,
                avgDisbursed: lt.avgDisbursed || 0,
              });
            });
          } else {
            rows2.push({
              bankName: bank.bankName,
              loanType: '-',
              filesProcessed: bank.filesProcessed,
              totalSanctioned: bank.totalSanctioned,
              totalDisbursed: bank.totalDisbursed,
              highestSanctioned: bank.highestSanctioned,
              highestDisbursed: bank.highestDisbursed,
              lowestSanctioned: bank.lowestSanctioned || 0,
              lowestDisbursed: bank.lowestDisbursed || 0,
              avgSanctioned: bank.avgSanctioned || 0,
              avgDisbursed: bank.avgDisbursed || 0,
            });
          }
        });

        this.banks = rows2;

      } else {
        this.banks = rawBanks.map((bank: any) => ({
          bankName: bank.bankName,
          loanType: this.loanType,
          filesProcessed: bank.filesProcessed,
          totalSanctioned: bank.totalSanctioned,
          totalDisbursed: bank.totalDisbursed,
          highestSanctioned: bank.highestSanctioned,
          highestDisbursed: bank.highestDisbursed,
          lowestSanctioned: bank.lowestSanctioned || 0,
          lowestDisbursed: bank.lowestDisbursed || 0,
          avgSanctioned: bank.avgSanctioned || 0,
          avgDisbursed: bank.avgDisbursed || 0,
        }));
      }

      this.bankLoading = false;
    },
    () => {
      this.bankLoading = false;
    }
  );

  return;
}

  // ── All other metrics → existing logic untouched ──
  this.loading = true;
  const from  = event.first ?? 0;
  const count = event.rows  ?? 10;

  this.leadsService.getAccountLeadsBreakdown(
    this.accountId,
    this.metric,
    this.loanType,
    from,
    count,
    this.search.trim()
  ).subscribe(
    (res: any) => {
      this.leads        = res.leads || [];
      this.totalRecords = res.total || 0;
      this.loading      = false;
    },
    () => { this.loading = false; }
  );
}

  // ── Filters ──────────────────────────────────────────────────
  onSearchChange(): void {
    this.searchSubject.next(this.search);
  }

  // onLoanTypeChange(): void {
  //   if (this.leadsTable) { this.leadsTable.first = 0; }
  //   this.onLazyLoad({ first: 0, rows: 10 });
  // }
  onLoanTypeChange(): void {
  if (this.isBankersMetric) {
    if (this.bankTable) { this.bankTable.first = 0; }
  } else {
    if (this.leadsTable) { this.leadsTable.first = 0; }
  }
  this.onLazyLoad({ first: 0, rows: 10 });
}

  // ── Navigate to lead detail ──────────────────────────────────
  viewLead(leadId: any): void {
    if (this.metric === 'leads' || this.metric === 'files' ||
        this.metric === 'credit' || this.metric === 'logins' ||
        this.metric === 'inhouseRejects') {

      const loanTypeVal = this.loanType.toLowerCase();
      if (loanTypeVal === 'all' || loanTypeVal === 'businessloan' || loanTypeVal === 'business') {
        this.routingService.handleRoute('leads/view/' + leadId, null);
      } else {
        this.routingService.handleRoute('loan-leads/view/' + leadId, null);
      }
    }
  }

  // ── Helpers ──────────────────────────────────────────────────
  get metricLabel(): string {
    return this.metricLabelMap[this.metric] || this.metric;
  }

  get metricIcon(): string {
    return this.metricIconMap[this.metric] || 'pi-list';
  }

  get metricColor(): string {
    return this.metricColorMap[this.metric] || '#534AB7';
  }

  get metricBg(): string {
    return this.metricBgMap[this.metric] || '#EEEDFE';
  }

  getLoanTypeLabel(value: string): string {
    const found = this.loanTypeOptions.find(o => o.value === value);
    return found ? found.label : value;
  }

  getInternalStatusLabel(status: string): string {
    const map: Record<string, string> = {
      '1':  'Lead',
      '3':  'File',
      '5':  'Credit',
      '11': 'Login',
      '10': 'Inhouse Reject',
      'rejected': 'Rejected',
    };
    return map[status] || status;
  }

  getStatusChipClass(status: string): string {
    const map: Record<string, string> = {
      '1':  'chip-lead',
      '3':  'chip-file',
      '5':  'chip-credit',
      '11': 'chip-login',
      '10': 'chip-reject',
      'rejected': 'chip-reject',
    };
    return map[status] || '';
  }

  goBack(): void {
    this.location.back();
  }

  get isAmountMetric(): boolean {
  return this.metric === 'sanctioned' || this.metric === 'disbursed';
}

formatAmount(amount: number): string {
  if (!amount || amount === 0) return '₹0';
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + ' Cr';
  if (amount >= 100000)   return '₹' + (amount / 100000).toFixed(1)   + ' L';
  if (amount >= 1000)     return '₹' + (amount / 1000).toFixed(1)     + ' K';
  return '₹' + amount;
}
get isBankersMetric(): boolean {
  return this.metric === 'bankers';
}
}
