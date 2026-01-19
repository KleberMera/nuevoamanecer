import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAccion } from './historial-accion';

describe('HistorialAccion', () => {
  let component: HistorialAccion;
  let fixture: ComponentFixture<HistorialAccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
