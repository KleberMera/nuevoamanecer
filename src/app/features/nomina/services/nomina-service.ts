import { Injectable } from '@angular/core';
import API_ROUTES from '@app/core/routes/api.routes';

@Injectable({
  providedIn: 'root',
})
export class NominaService {
  apiUrl = API_ROUTES.NOMINA;

  getNominaPeriodo(periodo: string) {
    const baseUrl = this.apiUrl.REPORTE_PAGOS.replace(/\/$/, '');
    const url = `${baseUrl}?periodo=${periodo}`;
    return url;
  }
}
