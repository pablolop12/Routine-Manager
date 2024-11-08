import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutinaManagerComponent } from './rutina-manager.component';

describe('RutinaManagerComponent', () => {
  let component: RutinaManagerComponent;
  let fixture: ComponentFixture<RutinaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RutinaManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RutinaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
