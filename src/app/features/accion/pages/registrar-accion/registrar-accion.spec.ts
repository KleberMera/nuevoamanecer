import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAccion } from './registrar-accion';

describe('RegistrarAccion', () => {
  let component: RegistrarAccion;
  let fixture: ComponentFixture<RegistrarAccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarAccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarAccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
