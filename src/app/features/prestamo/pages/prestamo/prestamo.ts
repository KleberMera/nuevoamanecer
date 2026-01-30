import { DettPrestamoInterface } from '@app/core/models/dett-prestamo';
import { Component, inject, signal, computed } from '@angular/core';
import { PrestamoService } from '../../services/prestamo-service';
import { DettPrestamoService } from '../../services/dett-prestamo-service';
import { httpResource } from '@angular/common/http';
import { FormValidation } from '@app/shared/services/form-validation';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePickerModule } from 'primeng/datepicker';
import { apiResponse } from '@app/core/models/apiResponse';
import { Usuario } from '@app/core/models/usuario';
import { PeriodoService } from '@app/shared/services/periodo-service';
import { PrestamoInterface } from '@app/core/models/prestamo';
import { toast } from 'ngx-sonner';

interface CuotaAmortizacion {
  numero: number;
  cuota: number;
  interes: number;
  capital: number;
  saldo: number;
}

@Component({
  selector: 'app-prestamo',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    DatePickerModule,
    CurrencyPipe,
  ],
  templateUrl: './prestamo.html',
  styleUrl: './prestamo.css',
})
export default class Prestamo {
  protected readonly _prestamoService = inject(PrestamoService);
  protected readonly _dettPrestamoService = inject(DettPrestamoService);
  protected readonly _validator = inject(FormValidation);
  protected readonly periodoService = inject(PeriodoService);

  // Signals para la tabla de amortización
  protected capitalConstante = signal<number>(0);
  protected totalInteres = signal<number>(0);
  protected totalPagado = signal<number>(0);
  protected valorPrestamo = signal<number>(0);
  protected tabla = signal<DettPrestamoInterface[]>([]);
  protected isSubmitting = signal<boolean>(false);

  // Formulario del préstamo
  protected formPrestamo = this._prestamoService.formPrestamo();

  // Recurso HTTP para obtener usuarios
  protected usuarios = httpResource<apiResponse<Usuario[]>>(() => ({
    method: 'GET',
    url: this._prestamoService.listarUsuarios(),
  }));

  // Lista de usuarios con fallback
  protected usuariosList = computed(() => {
    const data = this.usuarios.value();
    return data?.data || [];
  });

  // Períodos disponibles
  protected periodosList = computed(() => this.periodoService.generarPeriodos());

  /**
   * Formatea un período de YYYYMM a YYYY-MM
   */
  protected formatPeriodo(periodo: string): string {
    if (!periodo || periodo.length !== 6) return periodo;
    return `${periodo.substring(0, 4)}-${periodo.substring(4, 6)}`;
  }

  constructor() {
    // Inicializar el formulario con valores por defecto
    const currentPeriodo = this.periodoService.getPeriodoActual();
    this.formPrestamo().patchValue({
      periodo: currentPeriodo,
      frecuenciaPago: 'MENSUAL',
    });
  }

  // Métodos de validación
  getErrorMessage(form: FormGroup, fieldName: string): string {
    const validation = this._validator.getErrorMessage(
      form.get(fieldName) as FormControl,
    );
    return validation;
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const invalid = this._validator.isFielInvalid(form, field);
    return invalid;
  }

  // Calcular amortización
  protected calcularAmortizacion() {
    if (this.formPrestamo().invalid) {
      toast.error('Por favor completa todos los campos con valores válidos');
      return;
    }

    const { monto, interes, cuotas, periodo } = this.formPrestamo().value;

    console.log(this.formPrestamo().value);
    

    // La tasa ingresada es MENSUAL (no se divide entre 12)
    const tasaMensual = interes / 100;

    // En amortización alemana, el capital es constante
    this.valorPrestamo.set(monto);
    this.capitalConstante.set(monto / cuotas);

    // Generar tabla de amortización
    let saldoRestante = monto;
    let totalInteresTmp = 0;
    let totalPagadoTmp = 0;
    const nuevaTabla: DettPrestamoInterface[] = [];

    for (let i = 1; i <= cuotas; i++) {
      const interesCuota = saldoRestante * tasaMensual;
      const capitalCuota = this.capitalConstante();
      const cuotaTotal = capitalCuota + interesCuota;
      saldoRestante -= capitalCuota;

      // Evitar saldos negativos por redondeo
      if (saldoRestante < 0.01) {
        saldoRestante = 0;
      }

      // Calcular el período para esta cuota
      const periodoCuota = this.periodoService.getSiguientePeriodo(periodo, i);

      nuevaTabla.push({
        
        cuotaNum: i,
        monto: cuotaTotal,
        interes: interesCuota,
        capital: capitalCuota,
        saldo: saldoRestante,
        periodoPago: this.formatPeriodo(periodoCuota),
        estadoPago: 'PENDIENTE',
      });

      totalInteresTmp += interesCuota;
      totalPagadoTmp += cuotaTotal;
    }

    this.tabla.set(nuevaTabla);
    this.totalInteres.set(totalInteresTmp);
    this.totalPagado.set(totalPagadoTmp);
    toast.success('Amortización calculada correctamente');
  }

  // Limpiar formulario
  protected limpiar() {
    const currentPeriodo = this.periodoService.getPeriodoActual();
    this.formPrestamo().reset({
      usuarioId: null,
      periodo: currentPeriodo,
      monto: null,
      interes: null,
      cuotas: null,
      fecha: null,
      frecuencia: 'MENSUAL',
    });
    this.tabla.set([]);
    this.valorPrestamo.set(0);
    this.capitalConstante.set(0);
    this.totalInteres.set(0);
    this.totalPagado.set(0);
  }

  // Guardar préstamo y detalles
  protected guardarPrestamo() {
    if (this.formPrestamo().invalid || this.tabla().length === 0) {
      toast.error('Por favor calcula la amortización primero');
      return;
    }

    this.isSubmitting.set(true);
    const prestamoData: PrestamoInterface = this.formPrestamo().getRawValue();

    // Crear el préstamo
    this._prestamoService.crearPrestamo(prestamoData).subscribe({
      next: (response) => {
        const prestamoId = response.data!.id!;
        
        // Obtener la tabla actual y actualizar el prestamoId
        const detalles: DettPrestamoInterface[] = this.tabla().map(detalle => ({
          ...detalle,
          
        }));

        // Crear los detalles del préstamo
        this.crearDetallesPrestamo(prestamoId, detalles);
      },
      error: (error) => {
        console.error('Error al crear préstamo:', error);
        toast.error(error?.error?.message || 'Error al registrar el préstamo');
        this.isSubmitting.set(false);
      },
    });
  }

  // Crear detalles del préstamo
  private crearDetallesPrestamo(prestamoId: number, detalles: DettPrestamoInterface[]) {
    let completados = 0;
    const total = detalles.length;

    detalles.forEach((detalle) => {
      this._dettPrestamoService.crearDettPrestamo(prestamoId, detalle).subscribe({
        next: () => {
          completados++;
          if (completados === total) {
            this.isSubmitting.set(false);
            toast.success('Préstamo registrado correctamente con todos los detalles');
            this.limpiar();
          }
        },
        error: (error) => {
          console.error('Error al crear detalle:', error);
          toast.error(error?.error?.message || 'Error al registrar los detalles');
          this.isSubmitting.set(false);
        },
      });
    });
  }
}
