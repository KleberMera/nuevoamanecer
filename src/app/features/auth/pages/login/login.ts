import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { FormValidation } from '../../../../shared/services/form-validation';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import PAGES_ROUTES from '../../../../core/routes/pages.routes';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  private readonly _authService = inject(Auth);
  private readonly _router = inject(Router);
  private readonly _validator = inject(FormValidation);
  form = this._authService.formlogin();
  showPassword = signal<boolean>(false);

  getErrorMessage(fielName: string): string {
    const validation = this._validator.getErrorMessage(this.form().get(fielName) as FormControl);

    return validation;
  }

  isFieldInvalid(field: string): boolean {
    const invalid = this._validator.isFielInvalid(this.form(), field);
    return invalid;
  }

  // onSubmit() {
  //   if (this.form().invalid) return;
  //   this._authService.login(this.form().value).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this._router.navigate([PAGES_ROUTES.DASHBOARD.DASHBOARD]);
  //       toast.success(res.message);
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.log(err);
  //       toast.error(err.error.message);
  //     },
  //   });
  // }

  onSubmit() {
    if (this.form().invalid) return;
    const formValue = this.form().value;
    formValue.nombreUsuario = formValue.nombreUsuario.toLowerCase();
    const loginPromise = firstValueFrom(this._authService.login(formValue));
    toast.promise(loginPromise, {
      loading: 'Iniciando sesión...',
      success: (res) => {
        this._router.navigate([PAGES_ROUTES.DASHBOARD.DASHBOARD]);
        return res.message;
      },
      error: (err: unknown) => {
        const httpError = err as HttpErrorResponse;
        return httpError.error.message;
      },
    });
  }
}
