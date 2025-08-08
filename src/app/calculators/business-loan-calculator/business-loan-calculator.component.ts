import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-business-loan-calculator',
  templateUrl: './business-loan-calculator.component.html',
  styleUrls: ['./business-loan-calculator.component.scss']
})
export class BusinessLoanCalculatorComponent implements OnInit {
  loanAmount: number = 500000;
  interestRate: number = 10;
  tenure: number = 2;

  emi: number = 0;
  totalInterest: number = 0;
  totalPayable: number = 0;

  repaymentSchedule: any[] = [];
  groupedSchedule: { [key: string]: any[] } = {};
  groupedYears: { year: string }[] = [];
  expandedRows: { [key: string]: boolean } = {};

  piechartOptions: any;
  businessName: string = '';
  preventInvalidKeys(event: KeyboardEvent) {
    const invalidKeys = ['e', 'E', '+', '-', '.', ' '];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  preventInvalidPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    if (/[^0-9.]/.test(paste)) {
      event.preventDefault();
    }
  }
  limitInputLength(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.slice(0, 8);
    input.value = value;
    this.loanAmount = Number(value);
  }
  // Restrict the manual input to only numbers <= 4
  onTenureInput() {
    if (this.tenure > 4) {
      this.tenure = 4; // Automatically set to 4 if user enters a value greater than 4
    }
  }

  // Restrict keys (only allow digits 0-9)
  restrictTenureKeys(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;

    // Allow only numbers and the necessary keys (backspace, delete, etc.)
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab') {
      event.preventDefault();
    }

    // If the value is greater than 4, prevent entering more digits
    if (parseInt(value + event.key) > 4) {
      event.preventDefault();
    }
  }

  //  limitInterestRate(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   let value = parseFloat(input.value);

  //   // Restrict to max 15.99 and min 1
  //   if (value > 15.99) {
  //     value = 15.99;
  //   }

  //   if (value < 1) {
  //     value = 1;
  //   }
  // }
  limitInterestRate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    // Restrict to max 15.99 and min 1
    if (value > 15.99) {
      value = 15.99;
    }

    if (value < 1) {
      value = 1;
    }

    // Update the input's value immediately, so the user sees the restriction
    input.value = value.toFixed(2);

    // Update the model in Angular as well
    this.interestRate = value;
  }
  constructor() { }

  ngOnInit(): void {
    this.calculateEMI();
  }

  // calculateEMI(): void {
  //   const totalInterest = (this.loanAmount * this.interestRate * this.tenure) / 100;
  //   const totalPayable = this.loanAmount + totalInterest;
  //   const months = this.tenure * 12;
  //   const emi = Math.round(totalPayable / months);

  //   this.emi = emi;
  //   this.totalInterest = Math.round(totalInterest);
  //   this.totalPayable = Math.round(totalPayable);

  //   this.repaymentSchedule = [];
  //   this.groupedSchedule = {};
  //   this.groupedYears = [];

  //   let balance = totalPayable;
  //   const startDate = new Date();

  //   for (let i = 0; i < months; i++) {
  //     const monthDate = new Date(startDate);
  //     monthDate.setMonth(startDate.getMonth() + i);

  //     const monthName = monthDate.toLocaleString('default', { month: 'long' });
  //     const year = monthDate.getFullYear().toString();

  //     const principalPart = Math.round(this.loanAmount / months);
  //     const interestPart = Math.round(totalInterest / months);
  //     balance -= emi;

  //     const row = {
  //       month: `${monthName}-${year}`,
  //       emi,
  //       principal: principalPart,
  //       interest: interestPart,
  //       balance: balance > 0 ? Math.round(balance) : 0
  //     };

  //     if (!this.groupedSchedule[year]) {
  //       this.groupedSchedule[year] = [];
  //     }
  //     this.groupedSchedule[year].push(row);
  //   }

  //   this.groupedYears = Object.keys(this.groupedSchedule).map(year => ({ year }));

  //   this.updateChart();
  // }

  calculateEMI(): void {
    const totalInterest = (this.loanAmount * this.interestRate * this.tenure) / 100;
    const totalPayable = this.loanAmount + totalInterest;
    const months = this.tenure * 12;
    const emi = Math.round(totalPayable / months);

    this.emi = emi;
    this.totalInterest = Math.round(totalInterest);
    this.totalPayable = Math.round(totalPayable);

    this.repaymentSchedule = [];
    let balance = totalPayable;

    for (let i = 1; i <= months; i++) {
      const principalPart = Math.round(this.loanAmount / months);
      const interestPart = Math.round(totalInterest / months);
      balance -= emi;

      this.repaymentSchedule.push({
        month: `Month ${i}`,
        emi,
        principal: principalPart,
        interest: interestPart,
        balance: balance > 0 ? Math.round(balance) : 0
      });
    }

    this.updateChart();
  }

  toggleRow(year: string): void {
    this.expandedRows[year] = !this.expandedRows[year];
  }

  getYearlyTotal(year: string, field: 'emi' | 'principal' | 'interest'): number {
    return this.groupedSchedule[year].reduce((sum, row) => sum + Number(row[field]), 0);
  }

  enforceRange(event: Event, modelName: 'loanAmount' | 'interestRate' | 'tenure', min: number, max: number): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (isNaN(value)) return;

    if (value > max) value = max;
    if (value < min) value = min;

    // Update the corresponding model
    this[modelName] = value;
  }

  updateChart(): void {
    this.piechartOptions = {
      series: [this.loanAmount, this.totalInterest],
      chart: {
        type: 'donut',
        height: 320,
        offsetY: -20
      },
      labels: ['Principal', 'Interest'],
      // plotOptions: {
      //   pie: {
      //     startAngle: -90,
      //     endAngle: 90,
      //     donut: {
      //       size: '75%'
      //     }
      //   }
      // },
      colors: ['#29415B', '#EE7846'],
      legend: {
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  generatePDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const businessName = this.businessName;

    // ✅ 1. Watermark
    const addWatermark = () => {
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      doc.setFont('helvetica', 'medium');
      doc.setTextColor(230, 230, 230); // light gray
      doc.setFontSize(60);
      doc.text('MyLoanCRM', centerX, centerY, {
        angle: 45,
        align: 'center',
        baseline: 'middle'
      });
    };
    // ✅ 2. Header
    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor('#29415B');
      doc.text(businessName?.toUpperCase() || 'LOAN REPORT', pageWidth / 2, 15, {
        align: 'center',
      });
    };

    // ✅ 3. Draw header and summary table first
    addHeader();

    // ✅ 4. Summary Table (3 left + 3 right)
    autoTable(doc, {
      startY: 30,
      margin: { left: 14, right: 14 },
      body: [
        ['Loan Amount:', `Rs. ${this.loanAmount}`, 'Monthly EMI:', `Rs. ${this.emi}`],
        ['Interest Rate (Flat):', `${this.interestRate}%`, 'Interest:', `Rs. ${this.totalInterest}`],
        ['Tenure:', `${this.tenure} years`, 'Total Payable:', `Rs. ${this.totalPayable}`],
      ],
      styles: {
        fontSize: 10,
        font: 'helvetica',
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { fontStyle: 'bold', cellWidth: 40 },
        3: { cellWidth: 50 },
      },
      theme: 'grid',
    });
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#29415B');
    doc.text('Repayment Schedule', 14, 65);
    // ✅ 5. Repayment Table
    autoTable(doc, {
      head: [[
        'S. No.', 'Month', 'EMI (Rs.)', 'Principal (Rs.)', 'Interest (Rs.)', 'Balance (Rs.)'
      ]],
      body: this.repaymentSchedule.map((row, index) => [
        index + 1,
        row.month,
        `${row.emi}`,
        `${row.principal}`,
        `${row.interest}`,
        `${row.balance}`,
      ]),
      startY: 70,
      margin: { top: 25 },
      styles: {
        fontSize: 9,
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [41, 65, 91],
        textColor: 255,
      },
      didDrawPage: () => {
        addWatermark();
        addHeader();
      },
    });

    // ✅ 6. Save the file
    doc.save(`${this.businessName?.toUpperCase() || 'LOAN'}-EMI-REPORT.pdf`);
  }



}
