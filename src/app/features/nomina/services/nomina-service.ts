import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import API_ROUTES from '@app/core/routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NominaService {
  apiUrl = API_ROUTES.NOMINA;
  protected readonly _http = inject(HttpClient);

  getNominaPeriodo(periodo: string) {
    const baseUrl = this.apiUrl.REPORTE_PAGOS.replace(/\/$/, '');
    const url = `${baseUrl}?periodo=${periodo}`;
    return url;
  }


  getDistribucionPagos(periodo: string) {
    const baseUrl = this.apiUrl.DISTRIBUCION_PAGOS.replace(/\/$/, '');
    const url = `${baseUrl}?periodo=${periodo}`;
    return url;
  }

  getDistribucionPagos2(periodo: string):Observable<any> {
    const baseUrl = this.apiUrl.DISTRIBUCION_PAGOS.replace(/\/$/, '');
    const url = `${baseUrl}?periodo=${periodo}`;
    return  this._http.get(url);
    
  }
}
