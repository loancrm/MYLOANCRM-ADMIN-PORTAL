import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallettransactionsComponent } from './wallettransactions.component';

describe('WallettransactionsComponent', () => {
  let component: WallettransactionsComponent;
  let fixture: ComponentFixture<WallettransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WallettransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WallettransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
