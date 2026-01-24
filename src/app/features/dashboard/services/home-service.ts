import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import API_ROUTES from '@core/routes/api.routes';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = API_ROUTES;

  totalAcciones(usuarioId: number, periodo?: string) {
    const url = `${this.apiUrl.ACCION.TOTAL_ACCIONES}/${usuarioId}?periodo=${periodo || ''}`;
    return url;
  }
}
