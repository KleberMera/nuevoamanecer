import { Component, inject, computed, signal } from '@angular/core';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { PageTitleService } from '@shared/services/page-title-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
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

  // Método genérico para abrir el dialog de acciones
  private abrirDialogAccion(header: string, accion?: accionInterface) {
    const dialogRef = this.dialogService.open(DialogAccion, {
      header,
      modal: true,
      width: '50vw',
      closable: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      ...(accion && { data: { accion } }), // Pasar datos solo si se proporciona acción
    });

    // Escuchar cuando se cierre el dialog
    dialogRef!.onClose.subscribe((result) => {
      if (result) {
        this.historial.reload(); // Recargar datos del historial
        this.selectedAccion.set(undefined);
      }
    });
  }

  // Abrir dialog para crear nueva acción
  protected abrirDialogNuevaAccion() {
    this.abrirDialogAccion('Registrar Nueva Acción');
  }

  // Abrir dialog para editar una acción (desktop y mobile)
  protected editarAccion(accion: accionInterface) {
    this.selectedAccion.set(accion);
    this.abrirDialogAccion('Editar Acción', accion);
  }

  // Manejar la selección de fila en desktop
  protected onRowSelect(event: any) {
    const accion = event.data;
    this.editarAccion(accion);
  }

  // Método para manejar la deselección de fila
  protected onRowUnselect() {
    this.selectedAccion.set(undefined);
    console.log('Selección eliminada');
  }

  // Abrir dialog desde vista mobile
  protected abrirDialogDesdesMobile(accion: accionInterface) {
    this.editarAccion(accion);
  }

  // Calcular el total del valor de las acciones mostradas
  protected getTotalValor(): number {
    return this.acciones().reduce((total, accion) => total + accion.valor, 0);
  }

  calcularValorTotal(): number {
    return this.acciones().reduce((total, accion) => total + (accion.valor || 0), 0);
  }

  calcularUtilidadTotal(): number {
    return this.acciones().reduce((total, accion) => total + (accion.utilidadTotal || 0), 0);
  }
}
