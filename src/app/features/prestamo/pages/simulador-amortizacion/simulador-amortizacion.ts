import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';

import { toast } from 'ngx-sonner';

interface CuotaAmortizacion {
  numero: number;
  cuota: number;
  interes: number;
  capital: number;
  saldo: number;
}

@Component({
  selector: 'app-simulador-amortizacion',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    CardModule,

    CurrencyPipe
  ],
  templateUrl: './simulador-amortizacion.html',
  styleUrl: './simulador-amortizacion.css',

})
export default class SimuladorAmortizacion {
 
  capitalConstante: number = 0;
  totalInteres: number = 0;
  totalPagado: number = 0;
  tabla = signal<CuotaAmortizacion[]>([]);

  constructor(private fb: FormBuilder) {
  
  }

  form = signal<FormGroup>(
    new FormGroup({
      valorPrestamo: new FormControl(0, [Validators.required, Validators.min(1)]),
      tasaInteres: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      numeroCuotas: new FormControl(0, [Validators.required, Validators.min(1)])
    }),
  )

  calcularAmortizacion() {
    if (this.form().invalid) {
      toast.error('Por favor completa todos los campos con valores válidos');
      return;
    }

    const { valorPrestamo, tasaInteres, numeroCuotas } = this.form().value;

    // La tasa ingresada es MENSUAL (no se divide entre 12)
    const tasaMensual = tasaInteres / 100;

    // En amortización alemana, el capital es constante
    this.capitalConstante = valorPrestamo / numeroCuotas;

    // Generar tabla de amortización
    let saldoRestante = valorPrestamo;
    this.totalInteres = 0;
    this.totalPagado = 0;
    const nuevaTabla: CuotaAmortizacion[] = [];

    for (let i = 1; i <= numeroCuotas; i++) {
      const interes = saldoRestante * tasaMensual;
      const capital = this.capitalConstante;
      const cuota = capital + interes;
      saldoRestante -= capital;

      // Evitar saldos negativos por redondeo
      if (saldoRestante < 0.01) {
        saldoRestante = 0;
      }

      nuevaTabla.push({
        numero: i,
        cuota: cuota,
        interes: interes,
        capital: capital,
        saldo: saldoRestante,
      });

      this.totalInteres += interes;
      this.totalPagado += cuota;
    }

    this.tabla.set(nuevaTabla);
    toast.success('Amortización calculada correctamente');
  }

  limpiar() {
    this.form().reset({ valorPrestamo: 0, tasaInteres: 0, numeroCuotas: 0 });
    this.tabla.set([]);
    this.capitalConstante = 0;
    this.totalInteres = 0;
    this.totalPagado = 0;
  }
    
}
