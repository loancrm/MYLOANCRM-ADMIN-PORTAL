import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursalsComponent } from './disbursals.component';

describe('DisbursalsComponent', () => {
  let component: DisbursalsComponent;
  let fixture: ComponentFixture<DisbursalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisbursalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisbursalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
