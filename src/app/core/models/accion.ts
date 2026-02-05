import { Usuario } from "./usuario";

export interface accionInterface {
  id?: number;
  usuarioId: number;
  periodo: string;
  numero: number;
  valor: number;
  acumulado?: number;
  utilidadAccion?: number;
  utilidadTotal?: number;
  fecha: Date;
  estado: string;
  usuario?: Usuario;
}
