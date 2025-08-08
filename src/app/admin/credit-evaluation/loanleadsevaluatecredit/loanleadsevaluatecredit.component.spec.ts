import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanleadsevaluatecreditComponent } from './loanleadsevaluatecredit.component';

describe('LoanleadsevaluatecreditComponent', () => {
  let component: LoanleadsevaluatecreditComponent;
  let fixture: ComponentFixture<LoanleadsevaluatecreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanleadsevaluatecreditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanleadsevaluatecreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
