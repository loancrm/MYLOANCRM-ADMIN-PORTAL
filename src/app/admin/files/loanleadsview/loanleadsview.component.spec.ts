import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanleadsviewComponent } from './loanleadsview.component';

describe('LoanleadsviewComponent', () => {
  let component: LoanleadsviewComponent;
  let fixture: ComponentFixture<LoanleadsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanleadsviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanleadsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
