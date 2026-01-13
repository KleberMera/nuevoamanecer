import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class FormValidation {
  getErrorMessage(control: FormControl | null): string {
    if (!control || !control.errors || !control.touched) return '';
    const errors = control.errors;
    const ErrorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      email: 'Ingresa un correo electrónico válido',
      minlength: `Minimo ${errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Maximo ${errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'El formato es incorrecto',
      invalidPassword: 'La contraseña es incorrecta',
    };

    const firstError = Object.keys(errors)[0];
    return ErrorMessages[firstError] || 'Campo inválido';
  }

  isFielInvalid(form: FormGroup, fielName: string): boolean {
    const field = form.get(fielName);
    return field ? field.invalid && field.touched : false;
  }
}
