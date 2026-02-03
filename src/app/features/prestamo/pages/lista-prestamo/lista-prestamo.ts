import { Component, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Storage } from '@app/shared/services/storage';
import { PrestamoService } from '../../services/prestamo-service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PrestamoConDetalles } from '@app/core/models/dett-prestamo';
import { ViewportService } from '@app/shared/services/viewport-service';
import { PageTitleService } from '@app/shared/services/page-title-service';

@Component({
  selector: 'app-lista-prestamo',
  imports: [
    TableModule,
    TagModule,
    ProgressSpinnerModule,
    CommonModule,
    CurrencyPipe,
  ],
  templateUrl: './lista-prestamo.html',
  styleUrl: './lista-prestamo.css',
})
export default class ListaPrestamo {
  protected readonly _storage = inject(Storage);
  protected readonly _prestamoService = inject(PrestamoService);
  protected readonly _viewPort = inject(ViewportService);
  protected readonly pageTitleService = inject(PageTitleService);

  userId = this._storage.getUsuarioId();

  prestamos = rxResource({
    params: () => ({ userId: this.userId }),
    stream: ({ params }) => {
      return this._prestamoService.listarPrestamosPorUsuario(params.userId);
    },
  });

  // Lista de préstamos
  protected prestamosList = computed(() => {
    const data = this.prestamos.value();
    return data?.data || [];
  });

  // Estados de carga y error
  protected isLoading = computed(() => this.prestamos.isLoading());
  protected hasError = computed(() => !!this.prestamos.error());
  protected errorMessage = computed(() => {
    const error = this.prestamos.error();
    return error ? 'No se pudo cargar el listado de préstamos' : '';
  });

  // Formatea un período de YYYYMM a YYYY-MM
  protected formatPeriodo(periodo: string): string {
    if (!periodo || periodo.length !== 6) return periodo;
    return `${periodo.substring(0, 4)}-${periodo.substring(4, 6)}`;
  }

  // Calcular total de intereses desde los detalles
  protected calcularTotalIntereses(prestamo: PrestamoConDetalles): number {
    return prestamo.detalles.reduce((total, detalle) => total + detalle.interes, 0);
  }

  // Calcular total a pagar desde los detalles
  protected calcularTotalPagado(prestamo: PrestamoConDetalles): number {
    return prestamo.detalles.reduce((total, detalle) => total + detalle.monto, 0);
  }

  // Contar cuotas pagadas (X/N)
  protected obtenerCuotasPagadas(prestamo: PrestamoConDetalles): { pagadas: number; total: number } {
    const pagadas = prestamo.detalles.filter(d => d.estadoPago === 'PAGADO').length;
    return {
      pagadas,
      total: prestamo.detalles.length
    };
  }

  // Calcular total pagado (suma de detalles con estadoPago = PAGADO)
  protected calcularTotalPagadoDetalles(prestamo: PrestamoConDetalles): number {
    return prestamo.detalles
      .filter(d => d.estadoPago === 'PAGADO')
      .reduce((total, detalle) => total + detalle.monto, 0);
  }

  // Calcular total pendiente (suma de detalles con estadoPago != PAGADO)
  protected calcularTotalPendiente(prestamo: PrestamoConDetalles): number {
    return prestamo.detalles
      .filter(d => d.estadoPago !== 'PAGADO')
      .reduce((total, detalle) => total + detalle.monto, 0);
  }

  // Contar cuotas vencidas
  protected obtenerCuotasVencidas(prestamo: PrestamoConDetalles): number {
    if (prestamo.detalles.length === 0) return 0;

    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = now.getFullYear();
    const periodoActual = parseInt(`${currentYear}${currentMonth}`);

    return prestamo.detalles.filter(d => {
      const periodoPago = parseInt(d.periodoPago || '0');
      return periodoPago <= periodoActual && d.estadoPago === 'PENDIENTE';
    }).length;
  }

  constructor() {
    this.pageTitleService.setPageTitle('Mis', 'Préstamos');
  }
}

