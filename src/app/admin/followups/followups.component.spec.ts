import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupsComponent } from './followups.component';

describe('FollowupsComponent', () => {
  let component: FollowupsComponent;
  let fixture: ComponentFixture<FollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
