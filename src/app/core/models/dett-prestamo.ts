import { PrestamoInterface } from './prestamo';
import { Usuario } from './usuario';

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

export interface DettPrestamoCompleto extends DettPrestamoInterface {
  id: number;
  prestamoId: number;
  fecha?: Date | null;
}

export interface PrestamoConDetalles extends PrestamoInterface {
  detalles: DettPrestamoCompleto[];
}

export interface UsuarioConPrestamos extends Usuario {
  prestamos: PrestamoConDetalles[];
}



