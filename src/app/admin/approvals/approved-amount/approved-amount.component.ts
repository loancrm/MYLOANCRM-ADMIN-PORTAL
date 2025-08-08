import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { RoutingService } from '../../../services/routing-service';
@Component({
  selector: 'app-approved-amount',
  templateUrl: './approved-amount.component.html',
  styleUrl: './approved-amount.component.scss',
})
export class ApprovedAmountComponent implements OnInit {
  leads: any = null;
  leadId: string | null = null;
  moment: any;
  loading: any;
  banks: any = [];
  rowData: any = {};       // Your rowData object, modify based on your requirements
  minDisbursalDate: Date | null = null;  // Holds the min date for the disbursal date
  bankMap = new Map<number, string>();
  displayedItems: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  statusOptions: any[] = projectConstantsLocal.APPROVALS_STATUS;
  processcodes: any[] = projectConstantsLocal.PROCESS_CODES;
  productTypes: any[] = projectConstantsLocal.PRODUCT_TYPES;
  approvalDetails: any[] = [];
  breadCrumbItems: any[] = [
    {
      label: ' Home',
      routerLink: '/user/dashboard',
      queryParams: { v: this.version },
    },
    {
      label: 'Sanctions',
      routerLink: '/user/approvals',
      queryParams: { v: this.version },
    },
    { label: 'Sanction Details' },
  ];
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService,
    private router: Router
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.getBankers();
  }

  ngOnInit(): void {
    // this.leadId = this.route.snapshot.paramMap.get('id');
    // if (this.leadId) {
    //   this.getLeadById(this.leadId);
    //   this.getApprovalsDetailsById(this.leadId);
    // }
    this.leadId = this.route.snapshot.paramMap.get('id');
    const status = this.route.snapshot.paramMap.get('status');
    if (this.leadId) {
      if (!status) {
        this.getLeadById(this.leadId);
      } else {
        const validStatuses = ['personalLoan', 'homeLoan', 'lap'];
        if (validStatuses.includes(status)) {
          this.getLoanLeadById(this.leadId);
        } else {
          console.warn('Unknown status:', status);
          this.getLeadById(this.leadId);
        }
      }
      this.getApprovalsDetailsById(this.leadId);
    }
  }
  onSanctionDateChange() {
    if (this.rowData.approvalDate) {
      this.minDisbursalDate = new Date(this.rowData.approvalDate);
    } else {
      this.minDisbursalDate = null;
    }
  }

  changeLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  shouldDisplayBlock(): boolean {
    const lead = this.leads?.[0];
    if (!lead) return false;

    const isSelfEmployedHomeOrLap =
      (lead.loanType === 'homeLoan' || lead.loanType === 'lap') &&
      lead.employmentStatus === 'self-employed';

    const loanTypeNotExists = !('loanType' in lead);

    return isSelfEmployedHomeOrLap || loanTypeNotExists;
  }
  getLoanLeadById(leadId: any): void {
    this.leadsService.getLoanLeadById(leadId).subscribe(
      (data: any) => {
        this.leads = data;
        this.updateDisplayedItems();
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.leads && this.leads[0].employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      // { data: this.leads[0], displayProperty: 'businessName' },
      { data: this.leads[0], displayProperty: loanDisplayProperty },
    ];
  }
  saveFormData(): void {
    const loanType = this.leads[0]?.loanType;
    const formData = this.approvalDetails.map((detail) => ({
      id: detail.id,
      // program: detail.program,
      // bankName: detail.bankName,
      lan: detail.lan,
      sanctionedAmount: detail.sanctionedAmount,
      disbursedAmount: detail.disbursedAmount,
      roi: detail.roi,
      tenure: detail.tenure,
      processCode: detail.processCode,
      productType: detail.productType,
      productTypeName: this.getProductTypeName(detail.productType),
      approvalDate: detail.approvalDate
        ? this.moment(detail.approvalDate).format('YYYY-MM-DD')
        : null,
      disbursalDate: detail.disbursalDate
        ? this.moment(detail.disbursalDate).format('YYYY-MM-DD')
        : null,
      approvedStatus: detail.approvedStatus,
      approvedRemarks: detail.approvedRemarks,
    }));
    this.loading = true;
    const updateFn =
      loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap'
        ? this.leadsService.updateplApprovalsDetails.bind(this.leadsService)
        : this.leadsService.updateApprovalsDetails.bind(this.leadsService);
    updateFn(this.leadId, formData).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.showSuccess('Sanctions Info Saved Successfully');
        // const targetUrl = `user/approvals`;
        // this.router.navigateByUrl(targetUrl);
        this.routingService.handleRoute('approvals', null);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    });
  }

  saveplFormData(): void {
    const formData = this.approvalDetails.map((detail) => ({
      id: detail.id,
      bankName: detail.bankName,
      lan: detail.lan,
      sanctionedAmount: detail.sanctionedAmount,
      disbursedAmount: detail.disbursedAmount,
      roi: detail.roi,
      tenure: detail.tenure,
      processCode: detail.processCode,
      productType: detail.productType,
      productTypeName: this.getProductTypeName(detail.productType),
      approvalDate: detail.approvalDate
        ? this.moment(detail.approvalDate).format('YYYY-MM-DD')
        : null,
      disbursalDate: detail.disbursalDate
        ? this.moment(detail.disbursalDate).format('YYYY-MM-DD')
        : null,
      approvedStatus: detail.approvedStatus,
      approvedRemarks: detail.approvedRemarks,
    }));
    this.loading = true;
    this.leadsService.updateplApprovalsDetails(this.leadId, formData).subscribe(
      (response: any) => {
        this.loading = false;
        this.toastService.showSuccess('Sanctions Info Saved Successfully');
        // const targetUrl = `user/approvals`;
        // this.router.navigateByUrl(targetUrl);
        this.routingService.handleRoute('approvals', null);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getProductTypeName(statusId) {
    if (this.productTypes && this.productTypes.length > 0) {
      let productTypeName = this.productTypes.filter(
        (productType) => productType.id == statusId
      );
      return (
        (productTypeName &&
          productTypeName[0] &&
          productTypeName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  getMinDisbursalDate(approvalDate: string | Date): Date {
    return approvalDate ? this.moment(approvalDate).toDate() : new Date();
  }

  onApprovalDateChange(index: number): void {
    const detail = this.approvalDetails[index];
    if (detail && detail.approvalDate) {
      detail.minDisbursalDate = this.getMinDisbursalDate(detail.approvalDate);
    }
  }

  getApprovalsDetailsById(leadId) {
    this.loading = true;
    this.leadsService.getApprovalsDetailsById(leadId).subscribe(
      (lead: any) => {
        this.approvalDetails = lead;
        // console.log('FIPDETAILS:', this.approvalDetails);
        this.loading = false;
        this.approvalDetails.forEach((detail, index) => {
          this.onApprovalDateChange(index);
        });
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }


  getBankers(filter = {}) {
    this.loading = true;
    this.leadsService.getBankers(filter).subscribe(
      (response: any) => {
        this.banks = [{ name: 'All' }, ...response];

        // Create a Map for quick lookup
        this.bankMap.clear();
        for (const bank of response) {
          if (bank.id && bank.name) {
            this.bankMap.set(bank.id, bank.name);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLenderName(bankId: number): string {
    return this.bankMap.get(bankId) || '';
  }

  getLeadById(id: string) {
    this.leadsService.getLeadDetailsById(id).subscribe(
      (lead) => {
        this.leads = lead;
        this.updateDisplayedItems();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}
