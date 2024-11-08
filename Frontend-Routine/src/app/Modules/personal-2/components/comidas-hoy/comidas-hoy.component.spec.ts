import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComidasHoyComponent } from './comidas-hoy.component';

describe('ComidasHoyComponent', () => {
  let component: ComidasHoyComponent;
  let fixture: ComponentFixture<ComidasHoyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComidasHoyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComidasHoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
