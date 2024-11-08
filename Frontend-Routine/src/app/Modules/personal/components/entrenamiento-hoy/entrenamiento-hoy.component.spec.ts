import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenamientoHoyComponent } from './entrenamiento-hoy.component';

describe('EntrenamientoHoyComponent', () => {
  let component: EntrenamientoHoyComponent;
  let fixture: ComponentFixture<EntrenamientoHoyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntrenamientoHoyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntrenamientoHoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
