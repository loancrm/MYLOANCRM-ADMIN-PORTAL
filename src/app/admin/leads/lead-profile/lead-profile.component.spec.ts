import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadProfileComponent } from './lead-profile.component';

describe('LeadProfileComponent', () => {
  let component: LeadProfileComponent;
  let fixture: ComponentFixture<LeadProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
