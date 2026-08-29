import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { MasterDataService } from '../master-data.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-master-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss'],
})
export class UploadsComponent implements OnInit, OnDestroy {
  version = projectConstantsLocal.VERSION_DESKTOP;
  activeTab = 0; // 0 = Upload, 1 = History

  // Upload form
  banks: any[]     = [];
  locations: any[] = [];
  selectedBankId: any     = null;
  selectedLocationId: any = null;
  selectedFile: File | null = null;
  uploading   = false;
  currentUploadId: number | null = null;
  uploadProgress: any   = null;
  progressPollSub: Subscription | null = null;

  // History
  uploads: any[] = [];
  totalUploads   = 0;
  historyLoading = false;
  historyPage    = 1;
  historySize    = 20;

  constructor(
    private location: Location,
    private masterDataService: MasterDataService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadBanks();
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.progressPollSub?.unsubscribe();
  }

  loadBanks() {
    this.masterDataService.getBanks({ status: 1, limit: 500 }).subscribe({
      next: (res: any) => { this.banks = res.banks || []; },
      error: () => {},
    });
  }

  onBankChange() {
    this.selectedLocationId = null;
    this.masterDataService.getLocations({ status: 1, limit: 500 }).subscribe({
      next: (res: any) => { this.locations = res.locations || []; },
      error: () => {},
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.toastService.showError('Only Excel files (.xlsx, .xls) are accepted');
      event.target.value = '';
      return;
    }
    this.selectedFile = file;
  }

  downloadTemplate() {
    this.masterDataService.downloadTemplate();
  }

  submitUpload() {
    if (!this.selectedBankId)     { this.toastService.showError('Please select a Bank'); return; }
    if (!this.selectedLocationId) { this.toastService.showError('Please select a Location'); return; }
    if (!this.selectedFile)       { this.toastService.showError('Please choose an Excel file'); return; }

    const formData = new FormData();
    formData.append('bankId',     String(this.selectedBankId));
    formData.append('locationId', String(this.selectedLocationId));
    formData.append('file',       this.selectedFile);

    this.uploading     = true;
    this.uploadProgress = null;

    this.masterDataService.uploadExcel(formData).subscribe({
      next: (res: any) => {
        this.uploading       = false;
        this.currentUploadId = res.uploadId;
        this.toastService.showSuccess('Upload started! Processing in background...');
        this.startProgressPolling(res.uploadId);
        this.loadHistory();
        this.activeTab = 1;
      },
      error: (err) => {
        this.uploading = false;
        this.toastService.showError(err?.error || 'Upload failed');
      },
    });
  }

  startProgressPolling(uploadId: number) {
    this.progressPollSub?.unsubscribe();
    this.progressPollSub = interval(2500)
      .pipe(
        switchMap(() => this.masterDataService.getUploadById(uploadId)),
        takeWhile(
          (res: any) => res.status === 'PENDING' || res.status === 'PROCESSING',
          true, // inclusive — emit the final state too
        ),
      )
      .subscribe({
        next: (res: any) => {
          this.uploadProgress = res;
          if (res.status !== 'PENDING' && res.status !== 'PROCESSING') {
            this.progressPollSub?.unsubscribe();
            this.loadHistory();
          }
        },
        error: () => this.progressPollSub?.unsubscribe(),
      });
  }

  get progressPercent(): number {
    if (!this.uploadProgress || !this.uploadProgress.totalRows) return 0;
    return Math.round((this.uploadProgress.processedRows / this.uploadProgress.totalRows) * 100);
  }

  loadHistory(page = 1) {
    this.historyLoading = true;
    this.historyPage    = page;
    this.masterDataService.getUploadHistory({ page, limit: this.historySize }).subscribe({
      next: (res: any) => {
        this.uploads      = res.uploads || [];
        this.totalUploads = res.total   || 0;
        this.historyLoading = false;
      },
      error: (err) => {
        this.historyLoading = false;
        this.toastService.showError(err?.error || 'Error loading history');
      },
    });
  }

  onHistoryPageChange(event: any) {
    this.historySize = event.rows;
    this.loadHistory(Math.floor(event.first / event.rows) + 1);
  }

  refreshRow(upload: any) {
    if (upload.status === 'PENDING' || upload.status === 'PROCESSING') {
      this.startProgressPolling(upload.id);
    }
  }

  downloadOriginalFile(upload: any) {
    const url = upload.fileUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      this.toastService.showError('File URL not available');
    }
  }

  downloadErrorReport(upload: any) {
    const url = upload.errorFilePath; // backend stores the files.loancrm.org URL here
    if (url) {
      window.open(url, '_blank');
    } else {
      this.toastService.showError('No error report available');
    }
  }

  statusBadgeClass(status: string) {
    return {
      'bg-success':   status === 'COMPLETED',
      'bg-warning text-dark': status === 'COMPLETED_WITH_ERRORS',
      'bg-danger':    status === 'FAILED',
      'bg-info text-dark':    status === 'PROCESSING',
      'bg-secondary': status === 'PENDING',
    };
  }

  goBack() { this.location.back(); }
}
