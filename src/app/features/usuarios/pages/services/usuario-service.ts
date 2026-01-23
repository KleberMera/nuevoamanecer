import { Injectable } from '@angular/core';
import API_ROUTES from '@app/core/routes/api.routes';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  private readonly apiUrl = API_ROUTES.AUTH;



  //Listar usuarios por estado
  listarUsuariosPorEstado(estado: string) {
    const url = `${API_ROUTES.USUARIO.LISTAR_USUARIOS}/${estado}`;
    return url;
  }
}
