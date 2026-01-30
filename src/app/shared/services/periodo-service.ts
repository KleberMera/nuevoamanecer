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
   * Genera una lista de períodos disponibles
   * Incluye todos los meses del año anterior y el año actual
   * @returns Array de períodos con formato { label: 'YYYY-MM', value: 'YYYYMM' }
   */
  generarPeriodos(): Periodo[] {
    const periodos: Periodo[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // Añadir todos los meses del año anterior
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, '0');
      periodos.push({
        label: `${previousYear}-${month}`,
        value: `${previousYear}${month}`,
      });
    }

    // Añadir todos los meses del año actual
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, '0');
      periodos.push({
        label: `${currentYear}-${month}`,
        value: `${currentYear}${month}`,
      });
    }

    return periodos;
  }


  //   generarPeriodos(): Periodo[] {
  //   const periodos: Periodo[] = [];
  //   const now = new Date();
  //   const currentYear = now.getFullYear();
  //   const year = currentYear;


  //   for (let i = 1; i <= 12; i++) {
  //     const month = i.toString().padStart(2, '0');
  //     periodos.push({
  //       label: `${year}-${month}`,
  //       value: `${year}${month}`,
  //     });
  //   }
  //   return periodos;
  // }

  /**
   * Obtiene el período actual en formato YYYYMM
   */
  getPeriodoActual(): string {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = now.getFullYear();
    return `${currentYear}${currentMonth}`;
  }

  /**
   * Obtiene el siguiente período basado en uno dado
   * @param periodo Período actual en formato YYYYMM
   * @param meses Número de meses a sumar (por defecto 1)
   * @returns Siguiente período en formato YYYYMM
   */
  getSiguientePeriodo(periodo: string, meses: number = 1): string {
    const year = parseInt(periodo.substring(0, 4));
    const month = parseInt(periodo.substring(4, 6));
    
    let newMonth = month + meses;
    let newYear = year;
    
    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    
    return `${newYear}${newMonth.toString().padStart(2, '0')}`;
  }
}
