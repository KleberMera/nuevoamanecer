import { Component, inject, computed, signal } from '@angular/core';
import { Storage } from '@shared/services/storage';
import { HomeService } from '../../services/home-service';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { apiResponse } from '@core/models/apiResponse';
import { ProgressSpinner } from "primeng/progressspinner";
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PeriodoService } from '@shared/services/periodo-service';

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
  userName  = signal<string>(this.storage.getNombre() || 'Usuario');
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
  
  // Calcular días restantes para la reunión (30 de cada mes)
  protected diasRestantesReunion = computed(() => {
    const hoy = new Date();
    const diaActual = hoy.getDate();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    
    // Si ya pasó el 30 del mes actual, la próxima reunión es el 30 del siguiente mes
    let proximaReunion: Date;
    if (diaActual >= 30) {
      // Próxima reunión es el 30 del mes siguiente
      proximaReunion = new Date(anioActual, mesActual + 1, 30);
    } else {
      // La reunión es el 30 de este mes
      proximaReunion = new Date(anioActual, mesActual, 30);
    }
    
    // Calcular diferencia en días
    const diferencia = proximaReunion.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    
    return diasRestantes;
  });
  
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
