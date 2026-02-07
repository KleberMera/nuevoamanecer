import { Component, computed, inject, signal } from '@angular/core';
import { NominaService } from '../../services/nomina-service';
import { httpResource } from '@angular/common/http';
import { PeriodoService } from '@app/shared/services/periodo-service';
import { apiResponse } from '@app/core/models/apiResponse';
import { NominaData } from '@app/core/models/nomina';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PageTitleService } from '@app/shared/services/page-title-service';
import { ViewportService } from '@app/shared/services/viewport-service';
import { PdfPagos } from '../../services/pdf-pagos';

@Component({
  selector: 'app-pagos',
  imports: [
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    InputTextModule,
    ButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export default class Pagos {
  protected readonly _nominaService = inject(NominaService);
  protected readonly periodoService = inject(PeriodoService);
  protected readonly _viewPort = inject(ViewportService);
  protected readonly pageTitleService = inject(PageTitleService);
  protected readonly pdfPagos = inject(PdfPagos);

  protected periodoControl = new FormControl<string | null>(this.periodoService.getPeriodoActual());
  protected estadoControl = new FormControl<string>('PENDIENTE');
  protected nombreControl = new FormControl<string>('');
  private periodoSeleccionado = signal<string>(this.periodoService.getPeriodoActual());
  private estadoSeleccionado = signal<string>('PENDIENTE');
  private nombreSeleccionado = signal<string>('');
  nomina = httpResource<apiResponse<NominaData>>(() =>
    this._nominaService.getNominaPeriodo(this.periodoSeleccionado())
  );

  protected detNomina = computed(() => this.nomina.value()?.data?.detNomina ?? []);
  protected detNominaFiltrada = computed(() => {
    const periodo = this.periodoSeleccionado();
    const estado = this.estadoSeleccionado();
    const nombre = this.nombreSeleccionado().trim().toLowerCase();
    const registros = this.detNomina();
    return registros.filter((item) => {
      const matchPeriodo = !periodo || item.periodo === periodo;
      const matchEstado = !estado || item.estadopago === estado;
      const matchNombre =
        !nombre || (item.nombrecompleto || '').toLowerCase().includes(nombre);
      return matchPeriodo && matchEstado && matchNombre;
    });
  });

  protected totalCuota = computed(() =>
    this.detNominaFiltrada().reduce((total, item) => total + (item.cuota || 0), 0)
  );
  protected totalCapital = computed(() =>
    this.detNominaFiltrada().reduce((total, item) => total + (item.capital || 0), 0)
  );
  protected totalInteres = computed(() =>
    this.detNominaFiltrada().reduce((total, item) => total + (item.interes || 0), 0)
  );

  protected isLoading = computed(() => this.nomina.isLoading());
  protected hasError = computed(() => !!this.nomina.error());
  protected errorMessage = computed(() =>
    this.nomina.error() ? 'No se pudo cargar la nómina' : ''
  );

  protected periodosList = computed(() => [
    { label: 'Todos', value: null },
    ...this.periodoService.generarPeriodos(),
  ]);

  protected estadosList = computed(() => [
    { label: 'Todos', value: null },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Pagado', value: 'PAGADO' },
  ]);

  constructor() {
    this.pageTitleService.setPageTitle('Nomina', 'de pagos');
    this.periodoControl.valueChanges.subscribe((value) => {
      this.periodoSeleccionado.set(value || '');
    });
    this.estadoControl.valueChanges.subscribe((value) => {
      this.estadoSeleccionado.set(value || '');
    });
    this.nombreControl.valueChanges.subscribe((value) => {
      this.nombreSeleccionado.set(value || '');
    });
  }

  protected exportPdf(): void {
    void this.pdfPagos.generatePagosPdf({
      items: this.detNominaFiltrada(),
      totals: {
        cuota: this.totalCuota(),
        capital: this.totalCapital(),
        interes: this.totalInteres(),
      },
      filters: {
        periodo: this.periodoSeleccionado(),
        estado: this.estadoSeleccionado(),
        nombre: this.nombreSeleccionado().trim(),
      },
    });
  }
}
