import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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

@Component({
  selector: 'app-dialog-usuario',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TooltipModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './dialog-usuario.html',
  styleUrl: './dialog-usuario.css',
})
export class DialogUsuario {
  protected readonly usuarioService = inject(UsuarioService);
  protected readonly dialogRef = inject(DynamicDialogRef);

  protected formGroup = this.usuarioService.formUsuario();
  protected isSubmitting = signal(false);

  constructor() {
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
    this.usuarioService.crearUsuario(this.formGroup().value).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.dialogRef.close(response.data);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        toast.error(error?.error?.message || 'Error al crear el usuario');
        this.isSubmitting.set(false);
      },
    });
  }

  protected cancelar() {
    this.dialogRef.close();
  }

  roles = httpResource<apiResponse<Rol[]>>(() => this.usuarioService.listaRoles());
}
