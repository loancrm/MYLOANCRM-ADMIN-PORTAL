import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {

  @Input() accountId: any;

  loading        = false;
  bankLoading    = false;
  selectedLoanType: string = 'all';

  loanTypeOptions = [
    { label: 'All',                      value: 'all'                   },
    { label: 'Business Loan',            value: 'businessLoan'          },
    { label: 'Personal Loan',            value: 'personalLoan'          },
    { label: 'Home Loan',                value: 'homeLoan'              },
    { label: 'Mortgage Loan',            value: 'lap'                   },
    { label: 'Professional Loan',        value: 'professionalLoans'     },
    { label: 'Car Loan',                 value: 'carLoan'               },
    { label: 'Commercial Vehicle Loan',  value: 'commercialVehicleLoan' },
  ];

  stats = {
    callbacks:      0,
    enquiries:      0,
    leads:          0,
    files:          0,
    credit:         0,
    logins:         0,
    sanctioned:     0,
    disbursed:      0,
    inhouseRejects: 0,
    bankRejects:    0,
    cniRejects:     0,
    bankers:        0,
     sanctionedFiles: 0,
  disbursedFiles:  0,
  };

  // ✅ Bank wise data
  banks: any[] = [];
  expandedBank: string | null = null;

  constructor(
    private leadsService: LeadsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.accountId) {
      this.accountId = this.route.snapshot.paramMap.get('id');
    }
    if (this.accountId) {
      this.loadAnalytics();
      this.loadBankAnalytics();
    }
  }

  loadAnalytics(): void {
    this.loading = true;
    const filter: any = {
      'loanType':      this.selectedLoanType,
      'sourcedBy-eq':  undefined
    };

    this.leadsService.getAccountDashboardMetrics(this.accountId, filter).subscribe(
      (res: any) => {
        const kpi = res.kpiMetrics || {};
        this.stats.callbacks      = kpi.callbacks?.total      || 0;
        this.stats.enquiries      = kpi.enquiries?.total      || 0;
        this.stats.leads          = kpi.leads?.total          || 0;
        this.stats.files          = kpi.files?.total          || 0;
        this.stats.credit         = kpi.credit?.total         || 0;
        this.stats.logins         = kpi.logins?.total         || 0;
        this.stats.sanctioned     = kpi.sanctioned?.total     || 0;
        this.stats.disbursed      = kpi.disbursed?.total      || 0;
        this.stats.inhouseRejects = kpi.inhouseRejects?.total || 0;
        this.stats.bankRejects    = kpi.bankRejects?.total    || 0;
        this.stats.cniRejects     = kpi.cniRejects?.total     || 0;
        this.stats.bankers        = kpi.bankers?.total        || 0;
        this.stats.sanctionedFiles = kpi.sanctionedFiles?.total || 0;
        this.stats.disbursedFiles  = kpi.disbursedFiles?.total  || 0;
        this.loading = false;
      },
      (error: any) => {
        console.error('Analytics load error:', error);
        this.loading = false;
      }
    );
  }

  loadBankAnalytics(): void {
    this.bankLoading = true;
    this.leadsService.getBankWiseAnalytics(this.accountId, this.selectedLoanType)
      .subscribe(
        (res: any) => {
          this.banks = res.banks || [];
          this.bankLoading = false;
        },
        (error: any) => {
          console.error('Bank analytics error:', error);
          this.bankLoading = false;
        }
      );
  }
onLoanTypeChange(): void {
  this.loadAnalytics();
  this.loadBankAnalytics();
}
  // onLoanTypeChange(): void {
  //   this.loadAnalytics();
  //   this.loadBankAnalytics();  // ✅ reload bank data too
  // }

  toggleBank(bankName: string): void {
    this.expandedBank = this.expandedBank === bankName ? null : bankName;
  }

  formatAmount(amount: number): string {
    if (!amount || amount === 0) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + ' Cr';
    if (amount >= 100000)   return '₹' + (amount / 100000).toFixed(1)   + ' L';
    if (amount >= 1000)     return '₹' + (amount / 1000).toFixed(1)     + ' K';
    return '₹' + amount;
  }
}
