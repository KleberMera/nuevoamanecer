import { Component, effect, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { NominaService } from '../../services/nomina-service';

@Component({
  selector: 'app-dist-periodo',
  imports: [],
  templateUrl: './dist-periodo.html',
  styleUrl: './dist-periodo.css',
})
export default class DistPeriodo {
  private readonly nominaService = inject(NominaService);
  private readonly yearSeleccionado = signal<string>(
    new Date().getFullYear().toString()
  );

  protected distribucion = httpResource<unknown>(() =>
    this.nominaService.getDistribucionPagos(this.yearSeleccionado())
  );

  constructor() {
    effect(() => {
      const data = this.distribucion.value();
      if (data !== undefined) {
        console.log('Distribucion pagos', data);
      }

      const error = this.distribucion.error();
      if (error) {
        console.error('Error distribucion pagos', error);
      }
    });
  }
}
