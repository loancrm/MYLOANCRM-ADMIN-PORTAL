import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSelectionComponent } from './bank-selection.component';

describe('BankSelectionComponent', () => {
  let component: BankSelectionComponent;
  let fixture: ComponentFixture<BankSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
