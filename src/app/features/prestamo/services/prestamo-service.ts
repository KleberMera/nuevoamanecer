import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { apiResponse } from '@app/core/models/apiResponse';
import { PrestamoInterface } from '@app/core/models/prestamo';
import API_ROUTES from '@app/core/routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  apiUrl = API_ROUTES;

  protected readonly _http = inject(HttpClient);

  formPrestamo(data: Partial<PrestamoInterface> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        usuarioId: new FormControl(data.usuarioId, [Validators.required]),
        monto: new FormControl(data.monto, [Validators.required, Validators.min(1)]),
        interes: new FormControl(data.interes, [Validators.required, Validators.min(0.01)]),
        cuotas: new FormControl(data.cuotas, [Validators.required, Validators.min(1)]),
        fecha: new FormControl(data.fecha , [Validators.required]),
        periodo: new FormControl(data.periodo || ''),
        frecuencia: new FormControl(data.frecuencia || 'MENSUAL', [Validators.required]),
        estado: new FormControl(data.estado || 'A'),
      }),
    );
    return form;
  }

  //crear Prestamo

  crearPrestamo(usuarioId: number,prestamo: PrestamoInterface): Observable<apiResponse<PrestamoInterface>> {
    const url =  `${this.apiUrl.PRESTAMO.CREAR}${usuarioId}`;
    return this._http.post<apiResponse<PrestamoInterface>>(url, prestamo);
  }

  listarUsuarios() {
    const url = `${this.apiUrl.USUARIO.LISTAR_USUARIOS}/A`;
    return url;
  }
}
