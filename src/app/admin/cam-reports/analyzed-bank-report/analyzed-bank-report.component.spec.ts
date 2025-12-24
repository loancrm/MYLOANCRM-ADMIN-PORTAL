import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzedBankReportComponent } from './analyzed-bank-report.component';

describe('AnalyzedBankReportComponent', () => {
  let component: AnalyzedBankReportComponent;
  let fixture: ComponentFixture<AnalyzedBankReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyzedBankReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalyzedBankReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
