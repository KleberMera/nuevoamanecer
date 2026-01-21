import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Storage } from '@shared/services/storage';
import { apiResponse } from '@core/models/apiResponse';
import API_ROUTES from '@core/routes/api.routes';
import { Usuario } from '@core/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(Storage);
  private readonly apiUrl = API_ROUTES.AUTH;
  private keyUser = signal<string>('user');
  private keyToken = signal<string>('access_token');

  formlogin(data: Partial<Usuario> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        nombreUsuario: new FormControl(data.nombreUsuario, [Validators.required]),
        password: new FormControl(data.password, [Validators.required, Validators.minLength(8)]),
      }),
    );
    return form;
  }

  login(usuario: Usuario): Observable<apiResponse<Usuario>> {
    const url = this.apiUrl.LOGIN;
    return this._http.post<apiResponse<Usuario>>(url, usuario).pipe(
      tap((res) => {
        console.log(res);
        this._storage.set(this.keyUser(), res.data);
        this._storage.set(this.keyToken(), res.access_token);
      }),
    );
  }
}
