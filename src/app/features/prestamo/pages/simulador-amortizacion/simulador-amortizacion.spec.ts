import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorAmortizacion } from './simulador-amortizacion';

describe('SimuladorAmortizacion', () => {
  let component: SimuladorAmortizacion;
  let fixture: ComponentFixture<SimuladorAmortizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladorAmortizacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimuladorAmortizacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
