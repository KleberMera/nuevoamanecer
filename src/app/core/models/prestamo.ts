export interface PrestamoInterface {
  usuarioId: number;
  periodo?: string;
  monto: number;
  interes: number;
  cuotas: number;
  fecha: Date;
  frecuenciaPago: 'MENSUAL' | 'QUINCENAL' | 'SEMANAL';
  estado?: 'A' | 'I';
}
