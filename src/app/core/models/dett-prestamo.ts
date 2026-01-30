export interface DettPrestamoInterface {
  prestamoId: number;
  fecha?: Date;
  cuotaNum: number;
  monto: number;
  interes: number;
  capital: number;
  saldo: number;
  fechaPago?: Date;
  periodoPago?: string;
  estado: 'PENDIENTE' | 'PAGADO';
}
