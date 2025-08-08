import { Component, HostListener } from '@angular/core';
import { SubscriptionService } from '../services/subscription.service';
import { Subscription } from 'rxjs';
import { RoutingService } from '../services/routing-service';
import { LeadsService } from './leads/leads.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  subscription: Subscription;
  iswiz: any = false;
  smallMenuSection: any = false;
  isSidebarVisible = true;
  bodyHeight: any;
  smallDeviceDisplay: any;
  constructor(
    private subscriptionService: SubscriptionService,
    private routingService: RoutingService,
    private leadService: LeadsService
  ) {
    this.leadService.sidebarVisible$.subscribe((visible) => {
      this.smallMenuSection = !visible;
    });
    this.onResize();
    this.subscription = this.subscriptionService
      .getMessage()
      .subscribe((message) => {
        switch (message.ttype) {
          case 'hidemenus':
            this.iswiz = message.value;
            this.onResize();
            break;
          case 'smallMenu':
            this.smallMenuSection = message.value;
            break;
        }
      });
    this.routingService.setFeatureRoute('user');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    let screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth <= 672) {
      this.smallDeviceDisplay = true;
    } else {
      this.smallDeviceDisplay = false;
    }
    if (this.iswiz) {
      this.bodyHeight = screenHeight;
    } else {
      if (screenWidth <= 991) {
        this.bodyHeight = screenHeight - 107;
      } else {
        this.bodyHeight = screenHeight - 67;
      }
    }
  }
  onSidebarToggle(state: boolean) {
    this.isSidebarVisible = state;
  }
}
