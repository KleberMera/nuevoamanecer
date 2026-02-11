import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NominaService } from '../../services/nomina-service';
import { apiResponse } from '@app/core/models/apiResponse';
import { DistribucionPeriodo } from '@app/core/models/distribucion';

@Component({
  selector: 'app-dist-periodo',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ProgressSpinnerModule,
    CurrencyPipe,
  
  ],
  templateUrl: './dist-periodo.html',
  styleUrl: './dist-periodo.css',
})
export default class DistPeriodo {
  private readonly nominaService = inject(NominaService);
  private readonly currentYear = new Date().getFullYear();
  private readonly yearSeleccionado = signal<string>(this.currentYear.toString());

  protected yearControl = new FormControl<string>(this.currentYear.toString());
  protected yearsList = computed(() => [
    { label: this.currentYear.toString(), value: this.currentYear.toString() },
    {
      label: (this.currentYear - 1).toString(),
      value: (this.currentYear - 1).toString(),
    },
    {
      label: (this.currentYear - 2).toString(),
      value: (this.currentYear - 2).toString(),
    },
  ]);


  //Ahora con signals
  protected distribucion = httpResource<apiResponse<DistribucionPeriodo[]>>(() =>
    this.nominaService.getDistribucionPagos(this.yearSeleccionado())
  );


  // //Antes con suscripciones
  // getDistribucion() {
  //   this.nominaService.getDistribucionPagos2(this.yearSeleccionado()).subscribe({
  //     next: (response) => {
  //       this.distribucionList = response.data;
  //       //this.isLoading = false;
  //       //this.hasError = false;
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar la distribución:', error);
  //       //this.isLoading = false;
  //       //this.hasError = true;
  //     }
  //   });
  // }



  protected distribucionList = computed(() =>
    this.distribucion.value()?.data ?? []
  );
  protected isLoading = computed(() => this.distribucion.isLoading());
  protected hasError = computed(() => !!this.distribucion.error());
  protected errorMessage = computed(() =>
    this.distribucion.error() ? 'No se pudo cargar la distribucion' : ''
  );

  constructor() {
    this.yearControl.valueChanges.subscribe((value) => {
      this.yearSeleccionado.set(value || this.currentYear.toString());
    });
  }

  
}
