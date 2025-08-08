import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksSavedComponent } from './banks-saved.component';

describe('BanksSavedComponent', () => {
  let component: BanksSavedComponent;
  let fixture: ComponentFixture<BanksSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanksSavedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BanksSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
