import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioListComponent } from './ejercicio-list.component';

describe('EjercicioListComponent', () => {
  let component: EjercicioListComponent;
  let fixture: ComponentFixture<EjercicioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjercicioListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EjercicioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
