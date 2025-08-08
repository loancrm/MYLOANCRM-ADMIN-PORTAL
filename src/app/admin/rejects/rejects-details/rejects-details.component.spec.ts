import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectsDetailsComponent } from './rejects-details.component';

describe('RejectsDetailsComponent', () => {
  let component: RejectsDetailsComponent;
  let fixture: ComponentFixture<RejectsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
