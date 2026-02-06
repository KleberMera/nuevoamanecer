import { Component, inject, signal } from '@angular/core';
import { NominaService } from '../../services/nomina-service';
import { httpResource } from '@angular/common/http';
import { PeriodoService } from '@app/shared/services/periodo-service';

@Component({
  selector: 'app-pagos',
  imports: [],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export default class Pagos {
  protected readonly _nominaService = inject(NominaService);
  protected readonly periodoService = inject(PeriodoService);

    private periodoSeleccionado = signal<string>(this.periodoService.getPeriodoActual());
  nomina = httpResource <any>(() =>
    this._nominaService.getNominaPeriodo(this.periodoSeleccionado())
  );
}
