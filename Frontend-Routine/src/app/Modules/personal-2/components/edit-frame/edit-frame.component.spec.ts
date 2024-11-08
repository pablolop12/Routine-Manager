import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFrameComponent } from './edit-frame.component';

describe('EditFrameComponent', () => {
  let component: EditFrameComponent;
  let fixture: ComponentFixture<EditFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFrameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
