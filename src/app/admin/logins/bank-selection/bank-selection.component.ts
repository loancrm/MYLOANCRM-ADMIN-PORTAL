import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LeadsService } from '../../leads/leads.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';

interface Program {
  heading: string;
  name: string;
  imageUrl: string;
}

interface Bank {
  name: string;
  imageUrl: string[];
  selected: boolean;
  id: number;
}

@Component({
  selector: 'app-bank-selection',
  templateUrl: './bank-selection.component.html',
  styleUrls: ['./bank-selection.component.scss'],
})
export class BankSelectionComponent implements OnInit {
  leadId: any;
  leadData: any;
  loading: any;
  loginInfoDetails: any = {};
  breadCrumbItems: any = [];
  displayedItems: any = [];
  leads: any = [];
  selectedBanks: { id: number; name: string }[] = [];
  currentTableEvent: any;
  searchBank: string;
  filteredBanks: Bank[] = [];
  searchFilter: any = {};
  bankNameToSearch: string;
  version = projectConstantsLocal.VERSION_DESKTOP;
  programs: Program[] = [
    { heading: 'Income Surrogate', name: 'INCOME', imageUrl: '../../../assets/images/programs/income.png' },
    {
      heading: 'Banking Surrogate',
      name: 'BANKING',
      imageUrl: '../../../assets/images/programs/banking.png',
    },
    { heading: 'GST Surrogate', name: 'GST', imageUrl: '../../../assets/images/programs/gst.png' },
    { heading: 'DOD Surrogate', name: 'OD', imageUrl: '../../../assets/images/programs/od1.png' },
  ];

  banks: Bank[] = [];
  selectedProgram: string;
  constructor(
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService,
    private routingService: RoutingService,
    private location: Location,
    private router: Router
  ) { }
  ngOnInit(): void {
    // this.activatedRoute.params.subscribe((params) => {
    //   if (params && params['id']) {
    //     this.leadId = params['id'];
    //     this.getLeadById(this.leadId);
    //   }
    //   this.getBanks();
    // });
    this.leadId = this.activatedRoute.snapshot.paramMap.get('id');
    const status = this.activatedRoute.snapshot.paramMap.get('status');
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
      this.getBanks();
    }
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Logins',
        routerLink: '/user/logins',
        queryParams: { v: this.version },
      },
      { label: 'Bank Selection' },
    ];
  }

  sendLeadToFilesInProcess(lead) {
    // console.log(lead);
  }

  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }
  getBanks(): void {
    this.leadsService.getBanks().subscribe(
      (response: any) => {
        this.banks = response;
        this.filteredBanks = this.banks;
        // console.log('banks,', this.banks);
        // console.log(this.banks[0].imageUrl);
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  toggleSelected(bank: Bank): void {
    bank.selected = !bank.selected;
    if (!bank.selected) {
      this.selectedBanks.push({ id: bank.id, name: bank.name });
    } else {
      this.selectedBanks = this.selectedBanks.filter((b) => b.id !== bank.id);
    }
    // console.log('Selected Banks:', this.selectedBanks);
  }
  filterBanks(): void {
    this.filteredBanks = this.banks.filter((bank) =>
      bank.name.toLowerCase().includes(this.bankNameToSearch.toLowerCase())
    );
  }
  filterWithBankName() {
    if (this.bankNameToSearch && this.bankNameToSearch.trim() !== '') {
      this.filteredBanks = this.banks.filter((bank) =>
        bank.name.toLowerCase().includes(this.bankNameToSearch.toLowerCase())
      );
      // console.log('Filtered Banks:', this.filteredBanks);
      if (this.filteredBanks.length === 0) {
        this.toastService.showInfo('No banks found with the provided name.');
      }
    } else {
      this.filteredBanks = this.banks;
      // console.log('Reset Filter: Showing all banks');
    }
  }
  saveLoginInfo(): void {
    const bankIds = this.selectedBanks.map((bank) => bank.id);
    const bankNames = this.selectedBanks.map((bank) => bank.name);
    const formData: any = {
      bankId: bankIds,
      leadId: this.leadId,
      businessName: this.leadData[0].businessName,
      Program: this.selectedProgram,
      Banks: bankNames,
    };
    const loanType = this.leadData[0].loanType;
    console.log(this.leadData[0])
    if (loanType == 'homeLoan' || loanType == 'lap') {
      formData.loanType = this.leadData[0].loanType;
      formData.employmentStatus = this.leadData[0].employmentStatus;
    }
    // console.log('formData', formData);
    this.loading = true;
    this.leadsService.createLogin(formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Login Info Saved Successfully');
        // this.changeLeadStatus(this.leadData[0].id, 12);
        if (loanType === 'homeLoan' || loanType === 'lap') {
          this.changeLoanLeadStatus(this.leadData[0].leadId, 12);
        } else {
          this.changeLeadStatus(this.leadData[0].id, 12);
        }
        // const targetUrl = `user/filesinprocess`;
        // this.router.navigateByUrl(targetUrl);
        // this.routingService.handleRoute('filesinprocess', null);
        this.routingService.handleRoute(`logins/banksSaved/${this.leadData[0].id}`, null);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  saveLoanLoginInfo(): void {
    const bankIds = this.selectedBanks.map((bank) => bank.id);
    const bankNames = this.selectedBanks.map((bank) => bank.name);
    const formData = {
      bankId: bankIds,
      leadId: this.leadId,
      loanType: this.leadData[0].loanType,
      employmentStatus: this.leadData[0].employmentStatus,
      Banks: bankNames,
    };
    // console.log('formData', formData);
    this.loading = true;
    this.leadsService.createLogin(formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Login Info Saved Successfully');
        this.changeLoanLeadStatus(this.leadData[0].leadId, 12);
        // const targetUrl = `user/filesinprocess`;
        // this.router.navigateByUrl(targetUrl);
        this.routingService.handleRoute('filesinprocess', null);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  changeLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  changeLoanLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = '11,12';
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.getTotalLeads(api_filter);
    }
  }
  getTotalLeads(filter = {}) {
    this.loading = true;
    this.leadsService.getLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        // console.log(leads);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLoanLeadById(leadId: any): void {
    this.leadsService.getLoanLeadById(leadId).subscribe(
      (leadData: any) => {
        this.leadData = leadData;
        this.updateDisplayedItems();
        // console.log('loanleadData', leadData);
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.leadData && this.leadData[0]?.employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      // { data: this.leadData[0], displayProperty: 'businessName' },
      { data: this.leadData[0], displayProperty: loanDisplayProperty },
    ];
  }
  shouldDisplayBlock(): boolean {
    const lead = this.leadData?.[0];
    if (!lead) return false;

    const isSelfEmployedHomeOrLap =
      (lead.loanType === 'homeLoan' || lead.loanType === 'lap') &&
      lead.employmentStatus === 'self-employed';

    const loanTypeNotExists = !('loanType' in lead);

    return isSelfEmployedHomeOrLap || loanTypeNotExists;
  }

  getLeadById(leadId: any): void {
    this.leadsService.getLeadDetailsById(leadId).subscribe(
      (leadData: any) => {
        this.leadData = leadData;
        this.updateDisplayedItems();
        // console.log('leadData', leadData);
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}
