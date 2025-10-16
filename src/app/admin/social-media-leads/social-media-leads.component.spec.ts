import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaLeadsComponent } from './social-media-leads.component';

describe('SocialMediaLeadsComponent', () => {
  let component: SocialMediaLeadsComponent;
  let fixture: ComponentFixture<SocialMediaLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialMediaLeadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialMediaLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
