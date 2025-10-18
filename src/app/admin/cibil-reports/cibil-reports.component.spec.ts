import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilReportsComponent } from './cibil-reports.component';

describe('CibilReportsComponent', () => {
  let component: CibilReportsComponent;
  let fixture: ComponentFixture<CibilReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CibilReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CibilReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
