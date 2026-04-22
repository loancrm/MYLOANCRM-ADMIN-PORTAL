import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-campaign-history',
  templateUrl: './campaign-history.component.html',
  styleUrl: './campaign-history.component.scss'
})
export class CampaignHistoryComponent implements OnInit {

  // ── List ──────────────────────────────────────────────
  history: any[]      = [];
  totalRecords        = 0;
  loading             = false;
  searchText          = '';

  // ── Detail dialog ─────────────────────────────────────
  showDetail          = false;
  selectedCampaign: any = null;
  detailLoading       = false;

  constructor(private leadsService: LeadsService, private location: Location,) {}

  ngOnInit(): void {
    this.loadHistory({ first: 0, rows: 10 });
  }

  loadHistory(event: any): void {
    this.loading = true;

    const filter: any = {
      from:  event.first || 0,
      count: event.rows  || 10,
    };

    if (this.searchText.trim()) {
      filter['search'] = this.searchText.trim();
    }

    // ── Count ──────────────────────────────────────────
    this.leadsService.getCampaignHistoryCount(filter).subscribe({
      next: (res: any) => { this.totalRecords = Number(res) || 0; },
      error: () => {}
    });

    // ── Data ───────────────────────────────────────────
    this.leadsService.getCampaignHistory(filter).subscribe({
      next: (res: any) => {
        this.history = res.data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applySearch(): void {
    this.loadHistory({ first: 0, rows: 10 });
  }

  viewDetail(row: any): void {
    this.showDetail    = true;
    this.selectedCampaign = null;
    this.detailLoading = true;

    this.leadsService.getCampaignHistoryById(row.id).subscribe({
      next: (res: any) => {
        this.selectedCampaign = res.data;
        this.detailLoading    = false;
      },
      error: () => { this.detailLoading = false; }
    });
  }

  closeDetail(): void {
    this.showDetail       = false;
    this.selectedCampaign = null;
  }

  getSuccessRate(row: any): number {
    if (!row.total_count) return 0;
    return Math.round((row.success_count / row.total_count) * 100);
  }

   goBack() {
    this.location.back();
  }
}