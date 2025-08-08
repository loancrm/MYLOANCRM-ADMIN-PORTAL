import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesinProcessComponent } from './filesin-process.component';

describe('FilesinProcessComponent', () => {
  let component: FilesinProcessComponent;
  let fixture: ComponentFixture<FilesinProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilesinProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilesinProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
