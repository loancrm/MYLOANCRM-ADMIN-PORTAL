import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankerProfileComponent } from './banker-profile.component';

describe('BankerProfileComponent', () => {
  let component: BankerProfileComponent;
  let fixture: ComponentFixture<BankerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankerProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
