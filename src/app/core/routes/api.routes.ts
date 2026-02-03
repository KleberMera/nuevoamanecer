import { environment } from '@environments/environment';

const apiUrl = environment.apiUrl;
const route = (path: string) => `${apiUrl}${path}`;

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
  AUTH: createRoutes('autenticacion', {
    LOGIN: 'login',
    REGISTER: 'register',
  }),
  USUARIO: createRoutes('usuario', {
    LISTAR_USUARIOS: 'estado',
    CREAR: '',
    ACTUALIZAR: '',
  }),
  ACCION: createRoutes('accion', {
    CREAR_ACCION: '',
    LISTAR_ACCIONES_USUARIO: 'usuario',
    LISTAR_ACCIONES_PERIODO: 'periodo',
    TOTAL_ACCIONES: 'total',
  }),
  ROL: createRoutes('rol', {
    LISTAR_ROLES: '',
  }),
  PRESTAMO: createRoutes('prestamo', {
    CREAR: '',
    DETALLE_PRESTAMOS_USUARIOS: 'estado'
  }),
  DETTALLE_PRESTAMO: createRoutes('dett-prestamo', {
    CREAR: '',
    ACTUALIZAR_ESTADO: '',
    
  }),
};

export default API_ROUTES;
