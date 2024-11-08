import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDietaComponent } from './new-dieta.component';

describe('NewDietaComponent', () => {
  let component: NewDietaComponent;
  let fixture: ComponentFixture<NewDietaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewDietaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
