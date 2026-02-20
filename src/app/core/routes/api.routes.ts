import { environment } from '@environments/environment';

const apiUrl = environment.apiUrl;
const route = (path: string) => `${apiUrl}${path}`;

// Base paths de los módulos
export const BASE_PATHS = {
  AUTH: 'autenticacion',
  USUARIO: 'usuario',
  ACCION: 'accion',
  ROL: 'rol',
  PRESTAMO: 'prestamo',
  DETTALLE_PRESTAMO: 'dett-prestamo',
  NOMINA: 'nomina',
} as const;

// Helper para crear rutas sin repetir el base path
const createRoutes = <T extends Record<string, string>>(
  basePath: string,
  endpoints: T,
): Record<keyof T, string> => {
  const routes = {} as Record<keyof T, string>;
  Object.entries(endpoints).forEach(([key, endpoint]) => {
    routes[key as keyof T] = route(`/${basePath}/${endpoint}`);
  });
  return routes;
};

export const API_ROUTES = {
  AUTH: createRoutes(BASE_PATHS.AUTH, {
    LOGIN: 'login',
    REGISTER: 'register',
  }),
  USUARIO: createRoutes(BASE_PATHS.USUARIO, {
    LISTAR_USUARIOS: 'estado',
    CREAR: '',
    ACTUALIZAR: '',
  }),
  ACCION: createRoutes(BASE_PATHS.ACCION, {
    CREAR_ACCION: '',
    LISTAR_ACCIONES_USUARIO: 'usuario',
    LISTAR_ACCIONES_PERIODO: 'periodo',
    TOTAL_ACCIONES: 'total',
  }),
  ROL: createRoutes(BASE_PATHS.ROL, {
    LISTAR_ROLES: '',
  }),
  PRESTAMO: createRoutes(BASE_PATHS.PRESTAMO, {
    CREAR: '',
    DETALLE_PRESTAMOS_USUARIOS: 'estado',
    USUARIO_PRESTAMOS: 'usuario',
  }),
  DETTALLE_PRESTAMO: createRoutes(BASE_PATHS.DETTALLE_PRESTAMO, {
    CREAR: '',
    ACTUALIZAR_ESTADO: '',
  }),
  NOMINA: createRoutes(BASE_PATHS.NOMINA, {
    REPORTE_PAGOS: '',
    DISTRIBUCION_PAGOS: 'distribucion',
  }),
};

export default API_ROUTES;
