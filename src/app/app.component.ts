import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LeadsService } from './admin/leads/leads.service';
import { VersionCheckService } from './services/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'eloanspro';
  loading: boolean = false;
  constructor(private router: Router, private leadsService: LeadsService, private versionCheckService: VersionCheckService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  }
  ngOnInit(): void {
    // this.versionCheckService.start();
    this.leadsService.startIpUpdateInterval();
  }

  isScrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // ngOnDestroy(): void {
  //   this.versionCheckService.stop();
  // }
}
