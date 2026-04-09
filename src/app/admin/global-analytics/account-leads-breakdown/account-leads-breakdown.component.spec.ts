import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLeadsBreakdownComponent } from './account-leads-breakdown.component';

describe('AccountLeadsBreakdownComponent', () => {
  let component: AccountLeadsBreakdownComponent;
  let fixture: ComponentFixture<AccountLeadsBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountLeadsBreakdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountLeadsBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
