import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRutinaComponent } from './edit-rutina.component';

describe('EditRutinaComponent', () => {
  let component: EditRutinaComponent;
  let fixture: ComponentFixture<EditRutinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRutinaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRutinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
