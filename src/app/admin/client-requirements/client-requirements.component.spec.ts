import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRequirementsComponent } from './client-requirements.component';

describe('ClientRequirementsComponent', () => {
  let component: ClientRequirementsComponent;
  let fixture: ComponentFixture<ClientRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientRequirementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
