import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrl: './quick-links.component.scss'
})
export class QuickLinksComponent {

  links = [
    {
      title:   'SurePass',
      desc:    'API Console & Product Catalogue',
      url:     'https://console.surepass.app/product/console/product-catalogue',
      domain:  'console.surepass.app',
    },
    {
      title:   'VerifyAL',
      desc:    'Verification Dashboard',
      url:     'https://dashboardnew.verifyal.com/dashboard',
      domain:  'dashboardnew.verifyal.com',
    },
    {
      title:   'Precisa',
      desc:    'Bank Statement Analyser',
      url:     'https://webapp.precisa.in/precisa/home',
      domain:  'webapp.precisa.in',
    },
    {
      title:   'Airtel Business',
      desc:    'Commercial Communication',
      url:     'https://www.airtel.in/business/commercial-communication/',
      domain:  'airtel.in/business',
    },
  ];
constructor(private location: Location,){}

  openLink(link: any): void {
    window.open(link.url, '_blank');
  }
  goBack() {
    this.location.back();
  }
}