import { Component } from '@angular/core';
import { BsanalyzerService } from './bsanalyzer.service';

@Component({
  selector: 'app-bsanalyzer',
  templateUrl: './bsanalyzer.component.html',
  styleUrl: './bsanalyzer.component.scss'
})
export class BsanalyzerComponent {
  banks: any[] = [];
  extractedDetails: any;
  selectedFile: File | null = null;

  constructor(private bsaService: BsanalyzerService) { }

  searchBanks(query: string) {
    if (query.length >= 3) {
      this.bsaService.searchBanks(query).subscribe(data => {
        this.banks = data;
      });
    }
  }

  onFileSelected(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0]; // Store the first selected file
      console.log('Selected file:', this.selectedFile);
    }
  }

  uploadAndExtract() {
    console.log(this.selectedFile)
    if (this.selectedFile) {
      this.bsaService.extractBankDetails(this.selectedFile).subscribe(details => {
        this.extractedDetails = details;
      });
    }
  }
}
