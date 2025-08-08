import { Component } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { RoutingService } from 'src/app/services/routing-service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  reportsListConfig: any = [];
  customerLabel: any;
  donationStatus: any;
  apptStatus: any;
  checkinStatus: any;
  crmStatus: any;
  cdlStatus: any;
  leadStatus: any;
  ivrStatus: any;
  orderStatus: any;
  memberStatus: any;
  showToken: any;
  activeUser: any;
  loading: any;
  financeStatus: any;
  breadCrumbItems: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private routingService: RoutingService,
    private location: Location
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Reports' },
    ];
  }
  ngOnInit() {
    this.setReportsList();
  }
  setReportsList() {
    let reportsListConfig = [
      {
        reportName: 'Leads',
        showSavedReports: true,
        customButtons: false,
        reportType: 'LEADS',
        condition: true,
        icon: '../../../assets/images/icons/leads.svg'
      },
      {
        reportName: 'Callbacks',
        showSavedReports: true,
        customButtons: false,
        reportType: 'CALLBACKS',
        condition: true,
        icon: '../../../assets/images/icons/callbacks.svg'
      },
      {
        reportName: 'Files In Process',
        showSavedReports: true,
        customButtons: false,
        reportType: 'FILESINPROCESS',
        condition: true,
        icon: '../../../assets/images/icons/filesinprocess.svg'
      },
      {
        reportName: 'Sanction Files',
        showSavedReports: true,
        customButtons: false,
        reportType: 'SANCTIONFILES',
        condition: true,
        icon: '../../../assets/images/icons/sanction-files.svg'
      },
      // {
      //   reportName: 'Disbursed Files',
      //   showSavedReports: true,
      //   customButtons: false,
      //   reportType: 'DISBURSALFILES',
      //   condition: true,
      // },
      {
        reportName: 'Bank Rejected Files',
        showSavedReports: true,
        customButtons: false,
        reportType: 'BANKREJECTEDFILES',
        condition: true,
        icon: '../../../assets/images/icons/rejects.svg',
      },
      {
        reportName: 'CNI Files',
        showSavedReports: true,
        customButtons: false,
        reportType: 'CNIFILES',
        condition: true,
        icon: '../../../assets/images/icons/cni-files.svg'
      },

      {
        reportName: 'Sanction Details',
        showSavedReports: true,
        customButtons: false,
        reportType: 'SANCTIONDETAILS',
        condition: true,
        icon: '../../../assets/images/icons/sanctions.svg'
      },
      {
        reportName: 'Disbursed Details',
        showSavedReports: true,
        customButtons: false,
        reportType: 'DISBURSALDETAILS',
        condition: true,
        icon: '../../../assets/images/icons/disbursal.svg'
      },
      {
        reportName: 'CNI Details',
        showSavedReports: true,
        customButtons: false,
        reportType: 'CNIDETAILS',
        condition: true,
        icon: '../../../assets/images/icons/cni-details.svg'

      },
      // {
      //   reportName: 'Logins Details',
      //   showSavedReports: true,
      //   customButtons: false,
      //   reportType: 'LOGINSDONEDETAILS',
      //   condition: true,
      // },
      {
        reportName: 'Login Files',
        showSavedReports: true,
        customButtons: false,
        reportType: 'LOGINFILES',
        condition: true,
        icon: '../../../assets/images/icons/lender1.svg'
      },
    ];
    this.reportsListConfig = reportsListConfig.filter(
      (report) => report.condition
    );
  }

  createReport(reportType) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        reportType: reportType,
      },
    };
    // this.routingService.setFeatureRoute('reports');
    this.routingService.handleRoute('reports/create', navigationExtras);
    // this.routingService.handleRoute('create', navigationExtras);
  }

  routeTo(reportRoute) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'reports-list',
      },
    };
    this.routingService.setFeatureRoute('');
    this.routingService.handleRoute(reportRoute, navigationExtras);
  }

  // viewAllReports() {
  //   this.routingService.setFeatureRoute('reports');
  //   this.routingService.handleRoute('report-list', null);
  // }

  viewAllReports() {
    this.routingService.handleRoute('reports/report-list', null);
  }
  goBack() {
    this.location.back();
  }
}
