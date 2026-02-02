import { Component, inject, signal, computed } from '@angular/core';
import { DettPrestamoService } from '../../services/dett-prestamo-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UsuarioConPrestamos, PrestamoConDetalles, DettPrestamoCompleto } from '@core/models/dett-prestamo';
import { ViewportService } from '@app/shared/services/viewport-service';
import { PageTitleService } from '@app/shared/services/page-title-service';

@Component({
  selector: 'app-control-prestamo',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ProgressSpinnerModule,
    CommonModule,
    CurrencyPipe,
  ],
  templateUrl: './control-prestamo.html',
  styleUrl: './control-prestamo.css',
})
export default class ControlPrestamo {
  protected readonly _dettService = inject(DettPrestamoService);
  protected readonly _viewPort = inject(ViewportService);
  protected readonly pageTitleService = inject(PageTitleService);

  private estadoSeleccionado = signal<string>('A');
   usuarioSeleccionado = signal<UsuarioConPrestamos | undefined>(undefined);
  private reloadVersion = signal<number>(0);

  // FormControls
  protected estadoControl = new FormControl<string>('A');
  protected usuarioControl = new FormControl<UsuarioConPrestamos | null>(null);

  // Resource para obtener usuarios con préstamos
  usuariosConPrestamos = rxResource({
    params: () => ({ estado: this.estadoSeleccionado(), reload: this.reloadVersion() }),
    stream: ({ params }) => {
      return this._dettService.listarPrestamso(params.estado);
    },
  });

  // Lista de usuarios disponibles
  protected usuariosList = computed(() => {
    const data = this.usuariosConPrestamos.value();
    return data?.data || [];
  });

  // Préstamos del usuario seleccionado
  protected prestamosList = computed(() => {
    const usuario = this.usuarioSeleccionado();
    return usuario?.prestamos || [];
  });

  // Detalles del préstamo seleccionado
  protected detallesPrestamo = computed(() => {
    const prestamos = this.prestamosList();
    if (prestamos.length === 0) return [];
    return prestamos[0]?.detalles || [];
  });

  // Estados de carga y error
  protected isLoading = computed(() => this.usuariosConPrestamos.isLoading());
  protected hasError = computed(() => !!this.usuariosConPrestamos.error());
  protected errorMessage = computed(() => {
    const error = this.usuariosConPrestamos.error();
    return error ? 'No se pudo cargar el listado de usuarios con préstamos' : '';
  });

  // Estados disponibles
  protected estadosList = [
    { label: 'ACTIVOS', value: 'A' },
    { label: 'INACTIVOS', value: 'I' },
  ];

  // Obtener nombre completo del usuario
  protected getNombreCompleto(usuario: UsuarioConPrestamos): string {
    const { nombre1 = '', nombre2 = '', apellido1 = '', apellido2 = '' } = usuario;
    return `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim();
  }

  // Convertir estado a texto legible
  protected getEstadoTexto(estado: string | undefined): string {
    const estadoMap: { [key: string]: string } = {
      A: 'ACTIVO',
      I: 'INACTIVO',
    };
    return estadoMap[estado || ''] || estado || 'N/A';
  }

  // Formatea un período de YYYYMM a YYYY-MM
  protected formatPeriodo(periodo: string): string {
    if (!periodo || periodo.length !== 6) return periodo;
    return `${periodo.substring(0, 4)}-${periodo.substring(4, 6)}`;
  }

  // Calcular total de intereses desde los detalles
  protected calcularTotalIntereses(): number {
    const detalles = this.detallesPrestamo();
    return detalles.reduce((total, detalle) => total + detalle.interes, 0);
  }

  // Calcular total a pagar desde los detalles
  protected calcularTotalPagado(): number {
    const detalles = this.detallesPrestamo();
    return detalles.reduce((total, detalle) => total + detalle.monto, 0);
  }

  // Contar cuotas pagadas (X/N)
  protected obtenerCuotasPagadas(): { pagadas: number; total: number } {
    const detalles = this.detallesPrestamo();
    const pagadas = detalles.filter(d => d.estadoPago === 'PAGADO').length;
    return {
      pagadas,
      total: detalles.length
    };
  }

  // Calcular total pagado (suma de detalles con estadoPago = PAGADO)
  protected calcularTotalPagadoDetalles(): number {
    const detalles = this.detallesPrestamo();
    return detalles
      .filter(d => d.estadoPago === 'PAGADO')
      .reduce((total, detalle) => total + detalle.monto, 0);
  }

  // Calcular total pendiente (suma de detalles con estadoPago != PAGADO)
  protected calcularTotalPendiente(): number {
    const detalles = this.detallesPrestamo();
    return detalles
      .filter(d => d.estadoPago !== 'PAGADO')
      .reduce((total, detalle) => total + detalle.monto, 0);
  }

  // Contar cuotas vencidas según el período del préstamo
  protected obtenerCuotasVencidas(): number {
    const prestamos = this.prestamosList();
    if (prestamos.length === 0) return 0;

    const prestamo = prestamos[0];
    const periodoPrestamo = parseInt(prestamo.periodo || '0');
    
    // Período actual: YYYYMM
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = now.getFullYear();
    const periodoActual = parseInt(`${currentYear}${currentMonth}`);

    // La primera cuota vence en el siguiente período después del período del préstamo
    const periodoVencimiento = this.getSiguientePeriodo(prestamo.periodo || '');
    const periodoVencimientoNum = parseInt(periodoVencimiento);

    // Contar cuotas con periodoPago anterior al período actual
    const detalles = this.detallesPrestamo();
    return detalles.filter(d => {
      const periodoPago = parseInt(d.periodoPago || '0');
      return periodoPago < periodoActual;
    }).length;
  }

  // Obtener el siguiente período
  private getSiguientePeriodo(periodo: string): string {
    const year = parseInt(periodo.substring(0, 4));
    const month = parseInt(periodo.substring(4, 6));
    
    let newMonth = month + 1;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    
    return `${newYear}${newMonth.toString().padStart(2, '0')}`;
  }

  constructor() {
    this.pageTitleService.setPageTitle('Control de', 'Préstamos');

    // Escuchar cambios de estado
    this.estadoControl.valueChanges.subscribe((value) => {
      this.estadoSeleccionado.set(value || 'A');
      this.usuarioControl.reset();
      this.usuarioSeleccionado.set(undefined);
    });

    // Escuchar cambios de usuario seleccionado
    this.usuarioControl.valueChanges.subscribe((usuario) => {
      this.usuarioSeleccionado.set(usuario || undefined);
    });
  }
}
