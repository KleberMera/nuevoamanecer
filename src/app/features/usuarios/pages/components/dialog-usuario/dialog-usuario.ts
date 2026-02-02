import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UsuarioService } from '../../services/usuario-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { httpResource } from '@angular/common/http';
import { apiResponse } from '@core/models/apiResponse';
import { Rol } from '@core/models/rol';
import { toast } from 'ngx-sonner';
import { Usuario } from '@core/models/usuario';

@Component({
  selector: 'app-dialog-usuario',
  imports: [
    ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule,
    SelectModule, TooltipModule, PasswordModule, IconFieldModule, InputIconModule,
  ],
  templateUrl: './dialog-usuario.html',
  styleUrl: './dialog-usuario.css',
})
export class DialogUsuario {
  protected readonly usuarioService = inject(UsuarioService);
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly dynamicDialogConfig = inject(DynamicDialogConfig);

  protected formGroup = this.usuarioService.formUsuario();
  protected isSubmitting = signal(false);
  protected isEditMode = signal(false);
  protected usuarioId: number | null = null;

  constructor() {
    // Verificar si se pasó un usuario (modo edición)
    const dialogData = this.dynamicDialogConfig.data as { usuario?: Usuario };
    if (dialogData?.usuario) {
      this.isEditMode.set(true);
      this.usuarioId = dialogData.usuario.id || null;
      this.cargarUsuarioEnFormulario(dialogData.usuario);
    } else {
      // Modo creación: generar nombre de usuario y contraseña
      this.setupFormularioCreacion();
    }
  }

  private cargarUsuarioEnFormulario(usuario: Usuario) {
    this.formGroup().patchValue({
      cedula: usuario.cedula,
      nombre1: usuario.nombre1,
      nombre2: usuario.nombre2,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      telefono: usuario.telefono,
      email: usuario.email,
      nombreUsuario: usuario.nombreUsuario,
      rolId: usuario.rol?.id,
      estado: usuario.estado,
    });

    // Desactivar los campos en modo edición
    this.formGroup().get('cedula')?.disable();
    this.formGroup().get('password')?.disable();
  }

  private setupFormularioCreacion() {
    // Generar nombre de usuario: primera letra de nombre1 + apellido1
    this.formGroup()
      .get('nombre1')
      ?.valueChanges.subscribe(() => {
        this.generarNombreUsuario();
      });
    this.formGroup()
      .get('apellido1')
      ?.valueChanges.subscribe(() => {
        this.generarNombreUsuario();
      });

    // Generar contraseña desde la cédula
    this.formGroup()
      .get('cedula')
      ?.valueChanges.subscribe((cedula) => {
        if (cedula) {
          this.formGroup().get('password')?.setValue(cedula);
        }
      });
  }

  private generarNombreUsuario() {
    const nombre1 = this.formGroup().get('nombre1')?.value || '';
    const apellido1 = this.formGroup().get('apellido1')?.value || '';

    if (nombre1 && apellido1) {
      const primeraLetra = nombre1.charAt(0).toLowerCase();
      const nombreUsuario = primeraLetra + apellido1.toLowerCase();
      this.formGroup().get('nombreUsuario')?.setValue(nombreUsuario, { emitEvent: false });
    }
  }

  protected guardarUsuario() {
    if (this.formGroup().invalid) {
      return;
    }

    this.isSubmitting.set(true);

    // Capitalizar nombres y apellidos
    const datosFormulario = this.formGroup().getRawValue();
    const datosCapitalizados = {
      ...datosFormulario,
      nombre1: this.capitalizarPalabras(datosFormulario.nombre1),
      nombre2: this.capitalizarPalabras(datosFormulario.nombre2),
      apellido1: this.capitalizarPalabras(datosFormulario.apellido1),
      apellido2: this.capitalizarPalabras(datosFormulario.apellido2),
    };

    if (this.isEditMode() && this.usuarioId) {
      // Modo edición: actualizar usuario
      const dataActualizar = {
        ...datosCapitalizados,
        id: this.usuarioId,
      };
      this.usuarioService.actualizarUsuario(this.usuarioId, dataActualizar).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          toast.success(response.message || 'Usuario actualizado correctamente');
          this.dialogRef.close(response.data);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          toast.error(error?.error?.message || 'Error al actualizar el usuario');
          this.isSubmitting.set(false);
        },
      });
    } else {
      // Modo creación: crear nuevo usuario
      this.usuarioService.crearUsuario(datosCapitalizados).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          toast.success('Usuario creado correctamente');
          this.dialogRef.close(response.data);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          toast.error(error?.error?.message || 'Error al crear el usuario');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  protected cancelar() {
    this.dialogRef.close();
  }

  private capitalizarPalabras(texto: string): string {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .split(' ')
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  roles = httpResource<apiResponse<Rol[]>>(() => this.usuarioService.listaRoles());
}
