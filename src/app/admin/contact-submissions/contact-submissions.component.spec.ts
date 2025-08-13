import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSubmissionsComponent } from './contact-submissions.component';

describe('ContactSubmissionsComponent', () => {
  let component: ContactSubmissionsComponent;
  let fixture: ComponentFixture<ContactSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactSubmissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
