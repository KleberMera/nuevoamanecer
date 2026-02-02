import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { apiResponse } from '@app/core/models/apiResponse';
import { DettPrestamoInterface, UsuarioConPrestamos } from '@app/core/models/dett-prestamo';
import API_ROUTES from '@core/routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DettPrestamoService {
  apiUrl = API_ROUTES;
  protected readonly _http = inject(HttpClient);

  formDettPrestamo(data: Partial<DettPrestamoInterface> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        //prestamoId: new FormControl(data.prestamoId, [Validators.required]),
        cuotaNum: new FormControl(data.cuotaNum, [Validators.required]),
        interes: new FormControl(data.interes, [Validators.required, Validators.min(0)]),
        capital: new FormControl(data.capital, [Validators.required, Validators.min(0)]),
        saldo: new FormControl(data.saldo, [Validators.required, Validators.min(0)]),
        periodoPago: new FormControl(data.periodoPago, [Validators.required]),
        estadoPago: new FormControl(data.estadoPago || 'PENDIENTE'),
      }),
    );
    return form;
  }

  //Crear Dettale por id de prestamo
  crearDettPrestamo(
    prestamoId: number,
    dettPrestamo: DettPrestamoInterface,
  ): Observable<apiResponse<DettPrestamoInterface>> {
    const url = `${this.apiUrl.DETTALLE_PRESTAMO.CREAR}${prestamoId}`;
    return this._http.post<apiResponse<DettPrestamoInterface>>(url, dettPrestamo);
  }

  // Listar usuarios activos (para el dialog)
  listarPrestamso(estado: string): Observable<apiResponse<UsuarioConPrestamos[]>> {
    const url = `${this.apiUrl.PRESTAMO.DETALLE_PRESTAMOS_USUARIOS}/${estado}`;
    return this._http.get<apiResponse<UsuarioConPrestamos[]>>(url);
  }
}
