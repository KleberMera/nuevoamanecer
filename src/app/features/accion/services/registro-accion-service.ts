import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import API_ROUTES from '../../../core/routes/api.routes';
import { Observable } from 'rxjs';
import { apiResponse } from '../../../core/models/apiResponse';
import { Usuario } from '../../../core/models/usuario';
import { accionInterface } from '../../../core/models/accion';

@Injectable({
  providedIn: 'root',
})
export class RegistroAccionService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = API_ROUTES;

  // Listar Usuarios por estado
  getUsuarios(estado: string) {
    const url = `${this.apiUrl.USUARIO.LISTAR_USUARIOS}/${estado}`;
    return url
  }

  // Crear nueva acción
  crearAccion(accion: accionInterface): Observable<apiResponse<accionInterface>> {
    return this._http.post<apiResponse<accionInterface>>(
      this.apiUrl.ACCION.CREAR_ACCION,
      accion
    );
  }

  // Listar acciones del usuario
  listarAccionesUsuario(usuarioId: number): Observable<apiResponse<accionInterface[]>> {
    const url = `${this.apiUrl.ACCION.LISTAR_ACCIONES_USUARIO}/${usuarioId}`;
    return this._http.get<apiResponse<accionInterface[]>>(url);
  }
}
