import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietaManagerComponent } from './dieta-manager.component';

describe('DietaManagerComponent', () => {
  let component: DietaManagerComponent;
  let fixture: ComponentFixture<DietaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DietaManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DietaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
