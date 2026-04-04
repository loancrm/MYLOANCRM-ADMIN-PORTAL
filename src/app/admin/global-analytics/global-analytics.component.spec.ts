import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAnalyticsComponent } from './global-analytics.component';

describe('GlobalAnalyticsComponent', () => {
  let component: GlobalAnalyticsComponent;
  let fixture: ComponentFixture<GlobalAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
