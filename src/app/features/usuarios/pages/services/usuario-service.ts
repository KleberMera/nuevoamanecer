import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { apiResponse } from '@core/models/apiResponse';
import { Usuario } from '@core/models/usuario';
import API_ROUTES from '@core/routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = API_ROUTES;
  protected readonly http = inject(HttpClient);

  listarUsuariosPorEstado(estado: string): Observable<apiResponse<Usuario[]>> {
    console.log('Llamando a listarUsuariosPorEstado2 con estado:', estado);
    const url = `${this.apiUrl.USUARIO.LISTAR_USUARIOS}/${estado}`;
    return this.http.get<apiResponse<Usuario[]>>(url);
  }

  listaRoles() {
    const url = this.apiUrl.ROL.LISTAR_ROLES;
    return url;
  }

  formUsuario(data: Partial<Usuario> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        cedula: new FormControl(data.cedula, [Validators.required]),
        nombre1: new FormControl(data.nombre1, [Validators.required]),
        nombre2: new FormControl(data.nombre2 || ''),
        apellido1: new FormControl(data.apellido1, [Validators.required]),
        apellido2: new FormControl(data.apellido2 || ''),
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
    const url = this.apiUrl.USUARIO.CREAR;
    return this.http.post<apiResponse<Usuario>>(url, usuario);
  }

  actualizarUsuario(usuarioId: number, usuario: Usuario): Observable<apiResponse<Usuario>> {
    const url = `${this.apiUrl.USUARIO.ACTUALIZAR}${usuarioId}`;
    return this.http.patch<apiResponse<Usuario>>(url, usuario);
  }
}
