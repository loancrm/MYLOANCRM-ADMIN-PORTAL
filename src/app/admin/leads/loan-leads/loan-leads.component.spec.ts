import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanLeadsComponent } from './loan-leads.component';

describe('LoanLeadsComponent', () => {
  let component: LoanLeadsComponent;
  let fixture: ComponentFixture<LoanLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanLeadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
