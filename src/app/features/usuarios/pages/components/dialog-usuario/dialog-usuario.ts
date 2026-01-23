import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  protected formGroup = this.usuarioService.formUsuario()
  protected isSubmitting = signal(false);

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
        this.isSubmitting.set(false);
      },
    });
  }

  protected cancelar() {
    this.dialogRef.close();
  }
}
