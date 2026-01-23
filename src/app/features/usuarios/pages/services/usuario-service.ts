import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { apiResponse } from '@app/core/models/apiResponse';
import { Usuario } from '@app/core/models/usuario';
import API_ROUTES from '@app/core/routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = API_ROUTES.AUTH;
  protected readonly http = inject(HttpClient);

  //Listar usuarios por estado
  listarUsuariosPorEstado(estado: string) {
    const url = `${API_ROUTES.USUARIO.LISTAR_USUARIOS}/${estado}`;
    return url;
  }

  formUsuario(data: Partial<Usuario> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        cedula: new FormControl(data.cedula, [Validators.required]),
        nombre1: new FormControl(data.nombre1, [Validators.required]),
        nombre2: new FormControl(data.nombre2),
        apellido1: new FormControl(data.apellido1, [Validators.required]),
        apellido2: new FormControl(data.apellido2),
        telefono: new FormControl(data.telefono, [Validators.required]),
        email: new FormControl(data.email, [Validators.email]),
        nombreUsuario: new FormControl(data.nombreUsuario, [Validators.required]),
        password: new FormControl(data.password, [Validators.required, Validators.minLength(8)]),
        rolId: new FormControl(data.rolId, [Validators.required]),
        estado: new FormControl(data.estado || 'A'),
      }),
    );
    return form;
  }

  crearUsuario(usuario: Usuario): Observable<apiResponse<Usuario>> {
    const url = this.apiUrl.REGISTER;
    return this.http.post<apiResponse<Usuario>>(url, usuario);
  }
}
