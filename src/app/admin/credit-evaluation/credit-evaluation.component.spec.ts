import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditEvaluationComponent } from './credit-evaluation.component';

describe('CreditEvaluationComponent', () => {
  let component: CreditEvaluationComponent;
  let fixture: ComponentFixture<CreditEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
