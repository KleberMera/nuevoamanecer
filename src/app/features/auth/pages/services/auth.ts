import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Storage } from '../../../../shared/services/storage';
import { User } from '../../../../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(Storage);
  private keyUser = signal<string>('user');
  private keyToken = signal<string>('access_token');

  formlogin(data: Partial<User> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        username: new FormControl(data.username, [Validators.required]),
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
