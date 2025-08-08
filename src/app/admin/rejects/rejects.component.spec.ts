import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectsComponent } from './rejects.component';

describe('RejectsComponent', () => {
  let component: RejectsComponent;
  let fixture: ComponentFixture<RejectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
