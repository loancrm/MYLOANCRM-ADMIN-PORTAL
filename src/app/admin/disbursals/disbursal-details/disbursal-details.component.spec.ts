import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursalDetailsComponent } from './disbursal-details.component';

describe('DisbursalDetailsComponent', () => {
  let component: DisbursalDetailsComponent;
  let fixture: ComponentFixture<DisbursalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisbursalDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisbursalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
