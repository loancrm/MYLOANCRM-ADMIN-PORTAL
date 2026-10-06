import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';

/**
 * One sidebar entry ("Credit & CAM Reports", super admin / role 1 only) with
 * tabs for Credit Reports, CAM (BSA) Reports, PAN Verifications and Mobile
 * Prefill (mobile → PAN). Each tab
 * is a child route that lazy-loads the existing page module, so the old
 * /cibil-reports and /cam-reports URLs (and the CAM bank-report view) keep
 * working unchanged.
 */
@Component({
  selector: 'app-credit-cam-reports',
  templateUrl: './credit-cam-reports.component.html',
  styleUrl: './credit-cam-reports.component.scss',
})
export class CreditCamReportsComponent implements OnInit {
  tabs: MenuItem[] = [
    { label: 'Credit Reports', icon: 'pi pi-chart-line', routerLink: 'credit' },
    { label: 'CAM Reports', icon: 'pi pi-file', routerLink: 'cam' },
    { label: 'PAN Verifications', icon: 'pi pi-id-card', routerLink: 'pan' },
    { label: 'Prefill (Mobile to PAN)', icon: 'pi pi-mobile', routerLink: 'prefill' },
  ];

  isSuperAdmin = false;

  constructor(
    private location: Location,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    const adminDetails =
      this.localStorageService.getItemFromLocalStorage('adminDetails');
    this.isSuperAdmin = Number(adminDetails?.user?.role) === 1;
    if (!this.isSuperAdmin) {
      this.router.navigate(['admin', 'dashboard']);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
