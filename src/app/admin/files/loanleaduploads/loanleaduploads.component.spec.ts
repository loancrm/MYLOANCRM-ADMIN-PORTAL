import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanleaduploadsComponent } from './loanleaduploads.component';

describe('LoanleaduploadsComponent', () => {
  let component: LoanleaduploadsComponent;
  let fixture: ComponentFixture<LoanleaduploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanleaduploadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanleaduploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
