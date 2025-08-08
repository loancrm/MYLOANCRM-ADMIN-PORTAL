import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbacksComponent } from './callbacks.component';

describe('CallbacksComponent', () => {
  let component: CallbacksComponent;
  let fixture: ComponentFixture<CallbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallbacksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
