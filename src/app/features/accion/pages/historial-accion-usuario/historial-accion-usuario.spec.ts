import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAccionUsuario } from './historial-accion-usuario';

describe('HistorialAccionUsuario', () => {
  let component: HistorialAccionUsuario;
  let fixture: ComponentFixture<HistorialAccionUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAccionUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAccionUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
