export interface DettPrestamoInterface {


  cuotaNum: number;
  monto: number;
  interes: number;
  capital: number;
  saldo: number;
  fechaPago?: Date;
  periodoPago?: string;
  estadoPago: 'PENDIENTE' | 'PAGADO';
}
