import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import API_ROUTES from '../../../core/routes/api.routes';
import { Observable } from 'rxjs';
import { apiResponse } from '../../../core/models/apiResponse';
import { Usuario } from '../../../core/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class RegistroAccionService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = API_ROUTES;

  //Listar Usuarios
  getUsuarios(estado: string) {
    const url = `${this.apiUrl.USUARIO.LISTAR_USUARIOS}/${estado}`;
    return url;
  }
}
