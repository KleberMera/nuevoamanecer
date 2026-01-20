import { Component, inject, resource, signal } from '@angular/core';
import { RegistroAccionService } from '../../services/registro-accion-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { apiResponse } from '../../../../core/models/apiResponse';
import { Usuario } from '../../../../core/models/usuario';
@Component({
  selector: 'app-registrar-accion',
  imports: [],
  templateUrl: './registrar-accion.html',
  styleUrl: './registrar-accion.css',
})
export default class RegistrarAccion {
  protected readonly regAccion = inject(RegistroAccionService);
  protected readonly estado = signal<string>('A');

  user = httpResource<apiResponse<Usuario[]>>(() => this.regAccion.getUsuarios(this.estado())); // A reactive function as argument
}
