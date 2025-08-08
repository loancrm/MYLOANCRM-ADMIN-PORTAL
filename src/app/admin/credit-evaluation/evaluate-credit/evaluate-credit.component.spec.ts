import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateCreditComponent } from './evaluate-credit.component';

describe('EvaluateCreditComponent', () => {
  let component: EvaluateCreditComponent;
  let fixture: ComponentFixture<EvaluateCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluateCreditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluateCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
