import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialFilesComponent } from './partial-files.component';

describe('PartialFilesComponent', () => {
  let component: PartialFilesComponent;
  let fixture: ComponentFixture<PartialFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartialFilesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PartialFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
