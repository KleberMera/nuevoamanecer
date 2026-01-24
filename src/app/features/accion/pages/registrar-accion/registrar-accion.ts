import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { apiResponse } from '@core/models/apiResponse';
import { Usuario } from '@core/models/usuario';
import { accionInterface } from '@core/models/accion';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse, httpResource } from '@angular/common/http';

import { FormCard } from '@shared/components/form-card/form-card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ClassNamesModule } from 'primeng/classnames';
import { firstValueFrom } from 'rxjs';
import { PeriodoService } from '@shared/services/periodo-service';

@Component({
  selector: 'app-registrar-accion',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormCard,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    ClassNamesModule,
  ],
  templateUrl: './registrar-accion.html',
  styleUrl: './registrar-accion.css',
})
export default class RegistrarAccion {
  private readonly regAccion = inject(RegistroAccionService);
  private readonly periodoService = inject(PeriodoService);

  private readonly estado = signal<string>('A');
  protected isLoading = signal<boolean>(false);
  protected form = this.regAccion.formAccion()

  user = httpResource<apiResponse<Usuario[]>>(() => this.regAccion.getUsuarios(this.estado())); 

  // Signal para el número
  private numeroSignal = signal<number | null>(null);

  // Signal vinculada para el valor (número * 10)
  protected valorSignal = linkedSignal(() => {
    const numero = this.numeroSignal();
    return numero && numero > 0 ? numero * 10 : 0;
  });

  // Lista de usuarios con fallback
  protected usuariosList = computed(() => {
    const data = this.user.value();
    return data?.data || [];
  });

  // Períodos disponibles (vigente: 202601 hacia adelante)
  protected periodosList = computed(() => this.periodoService.generarPeriodos());

  constructor() {
    // Establecer periodo actual por defecto
    const currentPeriodo = this.periodoService.getPeriodoActual();
    
    this.form().patchValue({
      periodo: currentPeriodo
    });

    // Escuchar cambios del número y actualizar signal y el valor del formulario
    const numeroControl = this.form().get('numero');
    const valorControl = this.form().get('valor');
    
    if (numeroControl) {
      numeroControl.valueChanges.subscribe((numero) => {
        this.numeroSignal.set(numero);
        if (valorControl) {
          valorControl.setValue(this.valorSignal(), { emitEvent: false });
        }
      });
    }
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.form().invalid) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);
    const accionData: accionInterface = this.form().value;
    const createPromise = firstValueFrom(this.regAccion.crearAccion(accionData));

    toast.promise(createPromise, {
      loading: 'Registrando acción...',
      success: (res) => {
        this.form().reset();
        this.isLoading.set(false);
        return res.message || 'Acción registrada exitosamente';
      },
      error: (err: unknown) => {
        this.isLoading.set(false);
        const httpError = err as HttpErrorResponse;
        return httpError.error.message || 'Error al registrar la acción';
      },
    });
  }

  // Resetear formulario
  onReset(): void {
    this.form().reset();
  }

  // Validar si campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form().get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
