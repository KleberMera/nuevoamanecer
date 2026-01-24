import { Component, inject, computed, signal } from '@angular/core';
import { UsuarioService } from '../services/usuario-service';
import { httpResource } from '@angular/common/http';
import { apiResponse } from '@core/models/apiResponse';
import { Usuario } from '@core/models/usuario';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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
import { DialogUsuario } from '../components/dialog-usuario/dialog-usuario';

@Component({
  selector: 'app-lista-usuario',
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
  ],
  templateUrl: './lista-usuario.html',
  styleUrl: './lista-usuario.css',
     providers: [DialogService]
})
export default class ListaUsuario {
  protected readonly usuarioService = inject(UsuarioService);
  protected readonly _screenService = inject(ScreenService);
  protected readonly dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  // FormControl para estado
  protected estadoControl = new FormControl<string>('A');

  // FormControl para búsqueda
  protected usuarioBuscaControl = new FormControl<string>('');

  // Signal para estado seleccionado
  private estadoSeleccionado = signal<string>('A');

  // Signal para búsqueda
  private usuarioBusca = signal<string>('');

  // Signal para forzar recarga de usuarios
  private reloadVersion = signal<number>(0);

  // Usuarios con httpResource
  usuarios = httpResource<apiResponse<Usuario[]>>(() => {
    this.reloadVersion(); // Crear dependencia del signal de reload
    return this.usuarioService.listarUsuariosPorEstado(this.estadoSeleccionado());
  });

  // Usuarios filtrados para mostrar en tabla
  protected usuariosList = computed(() => {
    const data = this.usuarios.value();
    const listaUsuarios = data?.data || [];

    // Filtrar por búsqueda
    const busca = this.usuarioBusca().toLowerCase();
    if (!busca) return listaUsuarios;

    return listaUsuarios.filter((usuario) => {
      const nombreCompleto = this.getNombreCompleto(usuario).toLowerCase();
      const email = usuario.email?.toLowerCase() || '';
      const nombreUsuario = usuario.nombreUsuario?.toLowerCase() || '';

      return (
        nombreCompleto.includes(busca) || email.includes(busca) || nombreUsuario.includes(busca)
      );
    });
  });

  // Estados de carga y error
  protected isLoading = computed(() => this.usuarios.isLoading());
  protected hasError = computed(() => !!this.usuarios.error());
  protected errorMessage = computed(() => {
    const error = this.usuarios.error();
    return error ? 'No se pudo cargar el listado de usuarios' : '';
  });

  // Obtener nombre completo del usuario
  protected getNombreCompleto(usuario: Usuario): string {
    const { nombre1 = '', nombre2 = '', apellido1 = '', apellido2 = '' } = usuario;
    return `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim();
  }

  // Convertir estado a texto legible
  protected getEstadoTexto(estado: string | undefined): string {
    const estadoMap: { [key: string]: string } = {
      A: 'ACTIVO',
      I: 'INACTIVO',
      D: 'DESCONTINUADO',
    };
    return estadoMap[estado || ''] || estado || 'N/A';
  }

  // Estados disponibles
  protected estadosList = [
    { label: 'ACTIVOS', value: 'A' },
    { label: 'INACTIVOS', value: 'I' },
  ];

  // Método para abrir el dialog de crear usuario
  protected abrirDialogUsuario() {
    const dialogRef = this.dialogService.open(DialogUsuario, {
      header: 'Crear Nuevo Usuario',
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
        // Si se creó exitosamente, recargar la lista
        this.reloadVersion.update((v) => v + 1);
      }
    });
  }

  constructor() {
    // Escuchar cambios de estado
    this.estadoControl.valueChanges.subscribe((value) => {
      this.estadoSeleccionado.set(value || 'A');
    });

    // Escuchar cambios de búsqueda
    this.usuarioBuscaControl.valueChanges.subscribe((value) => {
      this.usuarioBusca.set(value || '');
    });
  }
}
