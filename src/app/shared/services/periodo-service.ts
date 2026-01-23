import { Injectable } from '@angular/core';

export interface Periodo {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
   /**
   * Genera una lista de períodos disponibles (desde 202601 hacia adelante)
   * @param cantidad Número de períodos a generar (default: 24)
   * @returns Array de períodos con formato { label: 'YYYY-MM', value: 'YYYYMM' }
   */
  generarPeriodos(cantidad: number = 24): Periodo[] {
    const periodos: Periodo[] = [];
    for (let i = 0; i < cantidad; i++) {
      const month = ((i % 12) + 1).toString().padStart(2, '0');
      const year = 2026 + Math.floor(i / 12);
      periodos.push({
        label: `${year}-${month}`,
        value: `${year}${month}`,
      });
    }
    return periodos;
  }

  /**
   * Obtiene el período actual en formato YYYYMM
   */
  getPeriodoActual(): string {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = now.getFullYear();
    return `${currentYear}${currentMonth}`;
  }
}
