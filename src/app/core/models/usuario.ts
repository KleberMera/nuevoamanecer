import { Rol } from "./rol";

export interface Usuario {
  id: number;
  nombre1: string;
  nombre2?: string | null;
  apellido1: string;
  apellido2?: string | null;
  telefono: string;
  nombreUsuario: string;
  email?: string | null;
  password: string;
  cedula?: string | null;
  rolId: number;
  estado?: string | null;
  rol? : Rol;
}