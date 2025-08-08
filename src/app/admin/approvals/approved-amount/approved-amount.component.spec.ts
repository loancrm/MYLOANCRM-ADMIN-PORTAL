import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedAmountComponent } from './approved-amount.component';

describe('ApprovedAmountComponent', () => {
  let component: ApprovedAmountComponent;
  let fixture: ComponentFixture<ApprovedAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedAmountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovedAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
