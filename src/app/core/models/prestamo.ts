export interface PrestamoInterface {
  id?: number;
  usuarioId: number;
  periodo?: string;
  monto: number;
  interes: number;
  cuotas: number;
  fecha: Date;
  frecuencia: 'MENSUAL' | 'QUINCENAL' | 'SEMANAL';
  estado?: 'A' | 'I';
}
