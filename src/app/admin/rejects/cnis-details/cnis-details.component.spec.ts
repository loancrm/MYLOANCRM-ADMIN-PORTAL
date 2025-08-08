import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnisDetailsComponent } from './cnis-details.component';

describe('CnisDetailsComponent', () => {
  let component: CnisDetailsComponent;
  let fixture: ComponentFixture<CnisDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CnisDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CnisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
