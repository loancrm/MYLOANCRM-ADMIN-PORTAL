import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamReportsComponent } from './cam-reports.component';

describe('CamReportsComponent', () => {
  let component: CamReportsComponent;
  let fixture: ComponentFixture<CamReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CamReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
