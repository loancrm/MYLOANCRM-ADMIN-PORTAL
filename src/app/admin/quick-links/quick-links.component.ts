import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrl: './quick-links.component.scss'
})
export class QuickLinksComponent {

  // ── Copy toast ────────────────────────────────────────────────────────────
  showCopyToast = false;
  copyToastMsg  = '';
  private toastTimer: any;
private location: Location
  links = [
  {
    title:        'SurePass',
    desc:         'API Console & Product Catalogue',
    url:          'https://console.surepass.app/product/console/product-catalogue',
    domain:       'console.surepass.app',
    icon:         'pi-shield',
    colorClass:   'card-green',
    username:     'connect@myloancrm.com',
    password:     null,              // ✅ null = no password field shown
    mobile:       null,
    showUsername: false,
    showPassword: false,
    showMobile:   false,
  },
  {
    title:        'VerifyAL',
    desc:         'Verification Dashboard',
    url:          'https://dashboardnew.verifyal.com/dashboard',
    domain:       'dashboardnew.verifyal.com',
    icon:         'pi-verified',
    colorClass:   'card-blue',
    username:     'connect@myloancrm.com',
    password:     'Myloancrm@2024$',
    mobile:       null,
    showUsername: false,
    showPassword: false,
    showMobile:   false,
  },
  {
    title:        'Precisa',
    desc:         'Bank Statement Analyser',
    url:          'https://webapp.precisa.in/precisa/home',
    domain:       'webapp.precisa.in',
    icon:         'pi-chart-bar',
    colorClass:   'card-orange',
    username:     'winwaycreators@gmail.com',
    password:     'Winway@2018',
    mobile:       null,
    showUsername: false,
    showPassword: false,
    showMobile:   false,
  },
  {
    title:        'Airtel Business',
    desc:         'Commercial Communication',
    url:          'https://www.airtel.in/business/commercial-communication/',
    domain:       'airtel.in/business',
    icon:         'pi-mobile',
    colorClass:   'card-red',
    username:     'winwaycreators@gmail.com',
    password:     'Ravi@2026',
    mobile:       '9949046262',      // ✅ mobile number added
    showUsername: false,
    showPassword: false,
    showMobile:   false,
  },
  {
    title:        'Fast 2 SMS',
    desc:         'Commercial Communication',
    url:          'https://www.fast2sms.com/dashboard/dlt',
    domain:       'fast2sms.com',
    icon:         'pi-mobile',
    colorClass:   'card-red',
    username:     '8179278882',
    password:     'Winway@123',
    mobile:       null,      // ✅ mobile number added
    showUsername: false,
    showPassword: false,
    showMobile:   false,
  },
  
];

  // ── Open link ─────────────────────────────────────────────────────────────
  openLink(link: any): void {
    window.open(link.url, '_blank');
  }

  // ── Toggle show/hide ──────────────────────────────────────────────────────
  toggleUsername(link: any): void {
    link.showUsername = !link.showUsername;
  }

  togglePassword(link: any): void {
    link.showPassword = !link.showPassword;
  }

  // ── Mask value — show only last 4 chars ───────────────────────────────────
  maskValue(value: string): string {
    if (!value) return '';
    if (value.length <= 4) return '••••';
    return '••••••' + value.slice(-4);
  }

  // ── Copy to clipboard ─────────────────────────────────────────────────────
  copy(value: string, label: string): void {
    navigator.clipboard.writeText(value).then(() => {
      this.showToast(`${label} copied!`);
    });
  }

  // ── Show toast notification ───────────────────────────────────────────────
  showToast(msg: string): void {
    this.copyToastMsg  = msg;
    this.showCopyToast = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showCopyToast = false;
    }, 2000);
  }
  goBack() {
    this.location.back();
  }
}