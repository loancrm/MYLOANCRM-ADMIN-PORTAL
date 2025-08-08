import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankersComponent } from './bankers.component';

describe('BankersComponent', () => {
  let component: BankersComponent;
  let fixture: ComponentFixture<BankersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
