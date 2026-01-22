import { Component, inject, computed, signal } from '@angular/core';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { apiResponse } from '@app/core/models/apiResponse';
import { accionInterface } from '@app/core/models/accion';
import { PeriodoService } from '@shared/services/periodo.service';
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

@Component({
  selector: 'app-historial-accion',
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
  templateUrl: './historial-accion.html',
  styleUrl: './historial-accion.css',
})
export default class HistorialAccion {
  protected readonly regAccion = inject(RegistroAccionService);
  protected readonly periodoService = inject(PeriodoService);

  // FormControl para el período
  protected periodoControl = new FormControl<string>(this.periodoService.getPeriodoActual());

  // FormControl para buscar usuario
  protected usuarioBuscaControl = new FormControl<string>('');

  // Signal para el período seleccionado
  private periodoSeleccionado = signal<string>(this.periodoService.getPeriodoActual());

  // Signal para el usuario a buscar
  private usuarioBusca = signal<string>('');

  // Historial con httpResource
  historial = httpResource<apiResponse<accionInterface[]>>(() =>
    this.regAccion.listarAccionesPeriodo(this.periodoSeleccionado()),
  );

  // Acciones para mostrar en tabla
  protected acciones = computed(() => {
    const data = this.historial.value();
    const acciones = data?.data || [];

    // Filtrar por búsqueda de usuario
    const busca = this.usuarioBusca().toLowerCase();
    if (!busca) return acciones;

    return acciones.filter((accion) => {
      const nombreCompleto = this.getNombreCompleto(accion).toLowerCase();
      return nombreCompleto.includes(busca);
    });
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

  // Obtener nombre completo del usuario
  protected getNombreCompleto(accion: accionInterface): string {
    if (!accion.usuario) return 'N/A';
    const { nombre1 = '', nombre2 = '', apellido1 = '', apellido2 = '' } = accion.usuario;
    return `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim();
  }

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

    // Escuchar cambios de búsqueda de usuario
    this.usuarioBuscaControl.valueChanges.subscribe((value) => {
      this.usuarioBusca.set(value || '');
    });
  }

  // Calcular el total del valor de las acciones mostradas
  protected getTotalValor(): number {
    return this.acciones().reduce((total, accion) => total + accion.valor, 0);
  }


  calcularValorTotal(): number {
  return this.acciones().reduce((total, accion) => total + (accion.valor || 0), 0);
}
}
