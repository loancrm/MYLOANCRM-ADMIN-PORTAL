
import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { CampaignLog } from '../modules/models';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit {
  logs: CampaignLog[] = [];
  loading = false;
  selectedLog: CampaignLog | null = null;

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loading = true;
    this.campaignService.getLogs().subscribe({
      next: (res) => { this.logs = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  

selectLog(log: CampaignLog) {
  this.selectedLog = log;
}
}