import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPrestamo } from './control-prestamo';

describe('ControlPrestamo', () => {
  let component: ControlPrestamo;
  let fixture: ComponentFixture<ControlPrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPrestamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPrestamo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
