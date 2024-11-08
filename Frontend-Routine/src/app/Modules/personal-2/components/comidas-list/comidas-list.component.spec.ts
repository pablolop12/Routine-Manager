import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComidasListComponent } from './comidas-list.component';

describe('ComidasListComponent', () => {
  let component: ComidasListComponent;
  let fixture: ComponentFixture<ComidasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComidasListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComidasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
