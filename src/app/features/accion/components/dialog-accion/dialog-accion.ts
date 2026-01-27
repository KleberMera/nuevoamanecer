import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { httpResource } from '@angular/common/http';
import { apiResponse } from '@core/models/apiResponse';
import { Usuario } from '@core/models/usuario';
import { accionInterface } from '@core/models/accion';
import { toast } from 'ngx-sonner';
import { PeriodoService } from '@shared/services/periodo-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dialog-accion',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './dialog-accion.html',
  styleUrl: './dialog-accion.css',
})




export class DialogAccion {
  protected readonly regAccionService = inject(RegistroAccionService);
  protected readonly periodoService = inject(PeriodoService);
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly dynamicDialogConfig = inject(DynamicDialogConfig);

  protected formGroup = this.regAccionService.formAccion();
  protected isSubmitting = signal(false);
  protected isEditMode = signal(false);
  protected accionId: number | null = null;
  protected estado = signal<string>('A');

  // Signal para el número
  private numeroSignal = signal<number | null>(null);

  // Signal vinculada para el valor (número * 10)
  protected valorSignal = linkedSignal(() => {
    const numero = this.numeroSignal();
    return numero && numero > 0 ? numero * 10 : 0;
  });

  // Usuarios desde httpResource
  usuarios = httpResource<apiResponse<Usuario[]>>(() => ({
    method: 'GET',
    url: `${this.regAccionService['apiUrl'].USUARIO.LISTAR_USUARIOS}/A`
  }));

  // Lista de usuarios con fallback
  protected usuariosList = computed(() => {
    const data = this.usuarios.value();
    return data?.data || [];
  });

  // Períodos disponibles
  protected periodosList = computed(() => this.periodoService.generarPeriodos());

  // Estados disponibles
  protected estadosList = computed(() => [
    { label: 'ACTIVO', value: 'A' },
    { label: 'INACTIVO', value: 'I' },
  ]);

  constructor() {
    // Verificar si se pasó una acción (modo edición)
    const dialogData = this.dynamicDialogConfig.data as { accion?: accionInterface };
    if (dialogData?.accion) {
      this.isEditMode.set(true);
      this.accionId = dialogData.accion.id || null;
      this.cargarAccionEnFormulario(dialogData.accion);
    } else {
      // Modo creación: valores por defecto
      this.setupFormularioCreacion();
    }

    // Escuchar cambios del número y actualizar signal y el valor del formulario
    const numeroControl = this.formGroup().get('numero');
    const valorControl = this.formGroup().get('valor');

    if (numeroControl) {
      numeroControl.valueChanges.subscribe((numero) => {
        this.numeroSignal.set(numero);
        if (valorControl) {
          valorControl.setValue(this.valorSignal(), { emitEvent: false });
        }
      });
    }
  }

  private cargarAccionEnFormulario(accion: accionInterface) {
    // Convertir la fecha a Date si viene como string
    let fechaValue = accion.fecha;
    if (typeof accion.fecha === 'string') {
      fechaValue = new Date(accion.fecha);
    }

    this.formGroup().patchValue({
      usuarioId: accion.usuarioId,
      periodo: accion.periodo,
      numero: accion.numero,
      valor: accion.valor,
      fecha: fechaValue,
      estado: accion.estado,
    });

    // Desactivar campos en modo edición
    this.formGroup().get('usuarioId')?.disable();
    this.formGroup().get('estado')?.disable();
  }

  private setupFormularioCreacion() {
    // Establecer periodo actual por defecto
    const currentPeriodo = this.periodoService.getPeriodoActual();

    this.formGroup().patchValue({
      periodo: currentPeriodo,
      estado: 'A',
    });

    // Desactivar el estado (siempre 'A')
    this.formGroup().get('estado')?.disable();
  }

  protected guardarAccion() {
    if (this.formGroup().invalid) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    this.isSubmitting.set(true);
    const accionData: accionInterface = this.formGroup().getRawValue();

    if (this.isEditMode() && this.accionId) {
      // Modo edición: actualizar acción
      this.regAccionService.actualizarAccion(this.accionId, accionData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          toast.success(response.message || 'Acción actualizada correctamente');
          this.dialogRef.close(response.data);
        },
        error: (error) => {
          console.error('Error al actualizar acción:', error);
          toast.error(error?.error?.message || 'Error al actualizar la acción');
          this.isSubmitting.set(false);
        },
      });
    } else {
      // Modo creación: crear nueva acción
      this.regAccionService.crearAccion(accionData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          toast.success(response.message || 'Acción registrada correctamente');
          this.dialogRef.close(response.data);
        },
        error: (error) => {
          console.error('Error al crear acción:', error);
          toast.error(error?.error?.message || 'Error al registrar la acción');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  protected cancelar() {
    this.dialogRef.close();
  }

  // Validar si campo es inválido
  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.formGroup().get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}

