import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoBookingsComponent } from './demo-bookings.component';

describe('DemoBookingsComponent', () => {
  let component: DemoBookingsComponent;
  let fixture: ComponentFixture<DemoBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
