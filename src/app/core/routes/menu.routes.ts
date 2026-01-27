import { MenuItem } from '../models/menu';
import PAGES_ROUTES from './pages.routes';

// Helper functions para construir rutas automáticamente
const buildRoute = (parent: string, child: string): string => `${parent}/${child}`;
const buildUsuariosRoute = (child: string): string => buildRoute(PAGES_ROUTES.USUARIOS.DEFAULT, child);
const buildAccionRoute = (child: string): string => buildRoute(PAGES_ROUTES.ACCION.DEFAULT, child);

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    label: 'Inicio',
    icon: 'pi pi-home',
    route: PAGES_ROUTES.DASHBOARD.DASHBOARD,
  },
  {
    id: 2,
    label: 'Usuarios',
    icon: 'pi pi-users',
      route: buildUsuariosRoute(PAGES_ROUTES.USUARIOS.LISTA),
    // subitems: [
    //   {
    //     id: 21,
    //     label: 'Lista de Usuarios',
    //     icon: 'pi pi-list',
    //     route: buildUsuariosRoute(PAGES_ROUTES.USUARIOS.LISTA),
    //   },
    // ],
  },
  {
    id: 3,
    label: 'Acciones',
    icon: 'pi pi-bolt',
    subitems: [
      {
        id: 31,
        label: 'Registro de Acciones',
        icon: 'pi pi-plus-circle',
        route:  buildAccionRoute(PAGES_ROUTES.ACCION.REGISTRO),
      },
      {
        id: 32,
        label: 'Historial de Acciones',
        icon: 'pi pi-history',
        route: buildAccionRoute(PAGES_ROUTES.ACCION.HISTORIAL),
      },
      {
        id: 33,
        label: 'Historial',
        icon: 'pi pi-clock',
        route: buildAccionRoute(PAGES_ROUTES.ACCION.HISTORIAL_USUARIO),
      }
    ],
  },
];

// Items para la barra de tabs (mobile)
export const TAB_ITEMS: MenuItem[] = [
  {
    id: 1,
    label: 'Inicio',
    icon: 'pi pi-home',
    route: PAGES_ROUTES.DASHBOARD.DASHBOARD,
  },
  {
    id: 33,
    label: 'Historial',
    icon: 'pi pi-clock',
    route: buildAccionRoute(PAGES_ROUTES.ACCION.HISTORIAL_USUARIO),
  },
  {
    id: 21,
    label: 'Usuarios',
    icon: 'pi pi-list',
    route: buildUsuariosRoute(PAGES_ROUTES.USUARIOS.LISTA),
  },
  {
    id: 31,
    label: 'Registro',
    icon: 'pi pi-plus-circle',
    route: buildAccionRoute(PAGES_ROUTES.ACCION.REGISTRO),
  },
];

export default MENU_ITEMS;
