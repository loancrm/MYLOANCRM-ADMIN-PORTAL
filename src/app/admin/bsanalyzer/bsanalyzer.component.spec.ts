import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsanalyzerComponent } from './bsanalyzer.component';

describe('BsanalyzerComponent', () => {
  let component: BsanalyzerComponent;
  let fixture: ComponentFixture<BsanalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BsanalyzerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BsanalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
