import { Component, inject, computed, signal } from '@angular/core';
import { Storage } from '@app/shared/services/storage';
import { HomeService } from '../../services/home-service';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { apiResponse } from '@app/core/models/apiResponse';
import { ProgressSpinner } from "primeng/progressspinner";
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PeriodoService } from '@shared/services/periodo.service';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, ProgressSpinner, SelectModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home {
  protected readonly storage = inject(Storage);
  protected readonly homeService = inject(HomeService);
  protected readonly periodoService = inject(PeriodoService);
  
  protected usuarioId = this.storage.getUsuarioId();
  
  // FormControl y signal para el período
  protected periodoControl = new FormControl<string>('');
  private periodoSeleccionado = signal<string>('');

  totalAccion = httpResource<apiResponse<any>>(() => 
    this.homeService.totalAcciones(this.usuarioId, this.periodoSeleccionado())
  );

  protected totales = computed(() => this.totalAccion.value()?.data);
  protected isLoading = computed(() => this.totalAccion.isLoading());
  protected hasError = computed(() => this.totalAccion.error());
  
  // Períodos disponibles
  protected periodosList = computed(() => [
    { label: 'Total', value: '' },
    ...this.periodoService.generarPeriodos(),
  ]);

  constructor() {
    // Escuchar cambios del período
    this.periodoControl.valueChanges.subscribe((value) => {
      this.periodoSeleccionado.set(value || '');
    });
  }
}
