import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLoanCalculatorComponent } from './business-loan-calculator.component';

describe('BusinessLoanCalculatorComponent', () => {
  let component: BusinessLoanCalculatorComponent;
  let fixture: ComponentFixture<BusinessLoanCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessLoanCalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessLoanCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
