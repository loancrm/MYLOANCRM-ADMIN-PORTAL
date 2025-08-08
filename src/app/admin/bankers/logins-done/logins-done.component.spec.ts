import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsDoneComponent } from './logins-done.component';

describe('LoginsDoneComponent', () => {
  let component: LoginsDoneComponent;
  let fixture: ComponentFixture<LoginsDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginsDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginsDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
