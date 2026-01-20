import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { apiResponse } from '../../../../core/models/apiResponse';
import { Usuario } from '../../../../core/models/usuario';
import { accionInterface } from '../../../../core/models/accion';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { effect } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-registrar-accion',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './registrar-accion.html',
  styleUrl: './registrar-accion.css',
})
export default class RegistrarAccion {
  private readonly regAccion = inject(RegistroAccionService);
  private readonly fb = inject(FormBuilder);
  private readonly estado = signal<string>('A');
  protected isLoading = signal<boolean>(false);
  protected form!: FormGroup;

  user = httpResource<apiResponse<Usuario[]>>(() => this.regAccion.getUsuarios(this.estado())); 

  // Lista de usuarios con fallback
  protected usuariosList = computed(() => {
    const data = this.user.value();
    return data?.data || [];
  });

  // Mapeo de números a valores
  private readonly numeroValorMap: { [key: number]: number } = {
    1: 19,
    2: 29,
    3: 39,
    4: 49,
    5: 59,
    // Agrega más valores según sea necesario
  };

  constructor() {
    // Inicializar formulario
    this.form = this.fb.group({
      usuarioId: ['', [Validators.required]],
      periodo: ['202601', [Validators.required]],
      numero: ['', [Validators.required, Validators.min(1)]],
      valor: ['', [Validators.required, Validators.min(0)]],
      fecha: ['', [Validators.required]],
      estado: ['A'],
    });

    // Escuchar cambios en el campo número para calcular valor automáticamente
    effect(() => {
      const numero = this.form.get('numero')?.value;
      if (numero && this.numeroValorMap[numero]) {
        this.form.get('valor')?.setValue(this.numeroValorMap[numero], { emitEvent: false });
      }
    });
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.form.invalid) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);
    const accionData: accionInterface = this.form.value;
    const createPromise = firstValueFrom(this.regAccion.crearAccion(accionData));

    toast.promise(createPromise, {
      loading: 'Registrando acción...',
      success: (res) => {
        this.form.reset();
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
    this.form.reset();
  }

  // Validar si campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
