import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRutinaComponent } from './new-rutina.component';

describe('NewRutinaComponent', () => {
  let component: NewRutinaComponent;
  let fixture: ComponentFixture<NewRutinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewRutinaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRutinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
