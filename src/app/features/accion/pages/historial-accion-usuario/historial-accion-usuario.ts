import { Component, inject, computed, signal } from '@angular/core';
import { Storage } from '@app/shared/services/storage';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { apiResponse } from '@core/models/apiResponse';
import { accionInterface } from '@core/models/accion';
import { httpResource } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScreenService } from '@shared/services/screen-service';
import { PeriodoService } from '@shared/services/periodo-service';

@Component({
  selector: 'app-historial-accion-usuario',
  imports: [
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ProgressSpinnerModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './historial-accion-usuario.html',
  styleUrl: './historial-accion-usuario.css',
})
export default class HistorialAccionUsuario {
  protected readonly storage = inject(Storage);
  protected readonly regAccion = inject(RegistroAccionService);
  protected readonly periodoService = inject(PeriodoService);
  protected readonly _screenService = inject(ScreenService);

  usuarioId = signal<number>(this.storage.getUsuarioId());

  // Signal para forzar recarga de acciones
  private reloadVersion = signal<number>(0);

  // FormControl para el período
  protected periodoControl = new FormControl<string>(this.periodoService.getPeriodoActual());

  // FormControl para filtrar por estado
  protected estadoFilterControl = new FormControl<string>('');

  // Signal para el período seleccionado
  private periodoSeleccionado = signal<string>(this.periodoService.getPeriodoActual());

  // Signal para el estado a filtrar
  private estadoFilter = signal<string>('');

  // Historial con httpResource
  historial = httpResource<apiResponse<accionInterface[]>>(() => {
    this.reloadVersion(); // Crear dependencia del signal de reload
    return this.regAccion.listarAccionesUsuario(this.usuarioId(), this.periodoSeleccionado());
  });

  // Acciones para mostrar en tabla
  protected acciones = computed(() => {
    const data = this.historial.value();
    let acciones = data?.data || [];

    // Filtrar por estado
    const estadoFilter = this.estadoFilter();
    if (estadoFilter) {
      acciones = acciones.filter((accion) => accion.estado === estadoFilter);
    }

    return acciones;
  });

  // Estados de carga y error
  protected isLoading = computed(() => this.historial.isLoading());
  protected hasError = computed(() => !!this.historial.error());
  protected errorMessage = computed(() => {
    const error = this.historial.error();
    return error ? 'No se pudo cargar el historial' : '';
  });

  // Períodos disponibles
  protected periodosList = computed(() => [
    { label: 'Todos', value: null },
    ...this.periodoService.generarPeriodos(),
  ]);

  // Convertir estado a texto legible
  protected getEstadoTexto(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      A: 'ACTIVO',
      I: 'INACTIVO',
      D: 'DESCONTINUADO',
    };
    return estadoMap[estado] || estado;
  }

  constructor() {
    // Escuchar cambios del período
    this.periodoControl.valueChanges.subscribe((value) => {
      this.periodoSeleccionado.set(value || '');
    });

    // Escuchar cambios de filtro de estado
    this.estadoFilterControl.valueChanges.subscribe((value) => {
      this.estadoFilter.set(value || '');
    });
  }

  // Calcular el total del valor de las acciones mostradas
  calcularValorTotal(): number {
    return this.acciones().reduce((total, accion) => total + (accion.valor || 0), 0);
  }
}
