import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHouseDetailsComponent } from './in-house-details.component';

describe('InHouseDetailsComponent', () => {
  let component: InHouseDetailsComponent;
  let fixture: ComponentFixture<InHouseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InHouseDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InHouseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
