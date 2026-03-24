import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleWhatsappCampaignComponent } from './single-whatsapp-campaign.component';

describe('SingleWhatsappCampaignComponent', () => {
  let component: SingleWhatsappCampaignComponent;
  let fixture: ComponentFixture<SingleWhatsappCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleWhatsappCampaignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleWhatsappCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
