import { Component, inject, computed, signal } from '@angular/core';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { PageTitleService } from '@shared/services/page-title-service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { apiResponse } from '@core/models/apiResponse';
import { accionInterface } from '@core/models/accion';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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
import { DialogAccion } from '../../components/dialog-accion/dialog-accion';
import { ViewportService } from '@app/shared/services/viewport-service';

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
    DatePipe,
  ],
  templateUrl: './historial-accion.html',
  styleUrl: './historial-accion.css',
  providers: [DialogService],
})
export default class HistorialAccion {
  protected readonly regAccion = inject(RegistroAccionService);
  protected readonly periodoService = inject(PeriodoService);
  protected readonly _screenService = inject(ScreenService);
  protected readonly _viewPort = inject(ViewportService);
  protected readonly dialogService = inject(DialogService);
  protected readonly pageTitleService = inject(PageTitleService);

  ref: DynamicDialogRef | undefined;

  // Signal para acción seleccionada
  protected selectedAccion = signal<accionInterface | undefined>(undefined);

  // Signal para forzar recarga de acciones
  private reloadVersion = signal<number>(0);

  // FormControl para el período
  protected periodoControl = new FormControl<string>(this.periodoService.getPeriodoActual());

  // FormControl para buscar usuario
  protected usuarioBuscaControl = new FormControl<string>('');

  // FormControl para filtrar por estado
  protected estadoFilterControl = new FormControl<string>('');

  // Signal para el período seleccionado
  private periodoSeleccionado = signal<string>(this.periodoService.getPeriodoActual());

  // Signal para el usuario a buscar
  private usuarioBusca = signal<string>('');

  // Signal para el estado a filtrar
  private estadoFilter = signal<string>('');

  // Historial con httpResource
  historial = httpResource<apiResponse<accionInterface[]>>(() => {
    this.reloadVersion(); // Crear dependencia del signal de reload
    return this.regAccion.listarAccionesPeriodo(this.periodoSeleccionado());
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
    this.pageTitleService.setPageTitle('Historial de', 'Acciones');

    // Escuchar cambios del período
    this.periodoControl.valueChanges.subscribe((value) => {
      this.periodoSeleccionado.set(value || '');
    });

    // Escuchar cambios de búsqueda de usuario
    this.usuarioBuscaControl.valueChanges.subscribe((value) => {
      this.usuarioBusca.set(value || '');
    });

    // Escuchar cambios de filtro de estado
    this.estadoFilterControl.valueChanges.subscribe((value) => {
      this.estadoFilter.set(value || '');
    });
  }

  // Método para abrir el dialog de crear acción
  protected abrirDialogAccion() {
    const dialogRef = this.dialogService.open(DialogAccion, {
      header: 'Registrar Nueva Acción',
      modal: true,
      width: '50vw',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    // Escuchar cuando se cierre el dialog
    dialogRef!.onClose.subscribe((result) => {
      if (result) {
        // Si se creó exitosamente, recargar la tabla
        this.reloadVersion.update((v) => v + 1);
      }
    });
  }

  // Método para manejar la selección de fila
  protected onRowSelect(event: any) {
    const accion = event.data;
    this.selectedAccion.set(accion);
    console.log('Acción seleccionada:', accion);

    // Abrir el dialog con la información de la acción
    const dialogRef = this.dialogService.open(DialogAccion, {
      header: 'Editar Acción',
      modal: true,
      width: '50vw',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { accion }, // Pasar los datos de la acción al dialog
    });

    // Escuchar cuando se cierre el dialog
    dialogRef!.onClose.subscribe((result) => {
      if (result) {
        // Si se actualizó exitosamente, recargar la tabla
        this.reloadVersion.update((v) => v + 1);
        this.selectedAccion.set(undefined);
      }
    });
  }

  // Método para manejar la deselección de fila
  protected onRowUnselect() {
    this.selectedAccion.set(undefined);
    console.log('Selección eliminada');
  }

  // Calcular el total del valor de las acciones mostradas
  protected getTotalValor(): number {
    return this.acciones().reduce((total, accion) => total + accion.valor, 0);
  }

  calcularValorTotal(): number {
    return this.acciones().reduce((total, accion) => total + (accion.valor || 0), 0);
  }

  abriDialagMobiel(accion: accionInterface) {
    this.selectedAccion.set(accion);
    console.log('Usuario seleccionado:', accion);

    // Abrir el dialog con la información del usuario
    const dialogRef = this.dialogService.open(DialogAccion, {
      header: 'Editar Usuario',
      modal: true,
      width: '50vw',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { accion }, // Pasar los datos del usuario al dialog
    });

    // Escuchar cuando se cierre el dialog
    dialogRef!.onClose.subscribe((result) => {
      if (result) {
        // Si se actualizó exitosamente, recargar la lista
        this.reloadVersion.update((v) => v + 1);
        this.selectedAccion.set(undefined);
      }
    });
  }
}
