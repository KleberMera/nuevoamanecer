export interface CabNomina {
  periodo: string;
  mes: string;
  totalcuota: number;
  totalcapital: number;
  totalinteres: number;
  cantidadusuarios: number;
}

export interface DetNomina {
  periodo: string;
  mes: string;
  nombrecompleto: string;
  cuota: number;
  capital: number;
  interes: number;
  estadopago: string;
  cuotapagar: string;
}

export interface NominaData {
  cabNomina: CabNomina[];
  detNomina: DetNomina[];
}
