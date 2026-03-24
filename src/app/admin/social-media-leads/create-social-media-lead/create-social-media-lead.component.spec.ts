import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSocialMediaLeadComponent } from './create-social-media-lead.component';

describe('CreateSocialMediaLeadComponent', () => {
  let component: CreateSocialMediaLeadComponent;
  let fixture: ComponentFixture<CreateSocialMediaLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSocialMediaLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSocialMediaLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
