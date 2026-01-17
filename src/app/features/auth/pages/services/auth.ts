import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Storage } from '../../../../shared/services/storage';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(Storage);
  private keyUser = signal<string>('user');
  private keyToken = signal<string>('access_token');

  formlogin(data: Partial<Usuario> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        nombreUsuario: new FormControl(data.nombreUsuario, [Validators.required]),
        password: new FormControl(data.password, [
          Validators.required,
          Validators.minLength(8),
        ]),
      })
    );
    return form;
  }

  login(){
   
    
  }
}
