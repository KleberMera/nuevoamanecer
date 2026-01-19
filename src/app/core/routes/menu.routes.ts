import { MenuItem } from '../models/menu';
import PAGES_ROUTES from './pages.routes';

// Helper functions para construir rutas automáticamente
const buildRoute = (parent: string, child: string): string => `${parent}/${child}`;
const buildUsuariosRoute = (child: string): string => buildRoute(PAGES_ROUTES.USUARIOS.DEFAULT, child);
const buildAccionRoute = (child: string): string => buildRoute(PAGES_ROUTES.ACCION.DEFAULT, child);

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    label: 'Dashboard',
    icon: 'pi pi-chart-bar',
    route: PAGES_ROUTES.DASHBOARD.DASHBOARD,
  },
  {
    id: 2,
    label: 'Usuarios',
    icon: 'pi pi-users',
    subitems: [
      {
        id: 21,
        label: 'Lista de Usuarios',
        icon: 'pi pi-list',
        route: buildUsuariosRoute(PAGES_ROUTES.USUARIOS.LISTA),
      },
      // {
      //   id: 22,
      //   label: 'Grupos',
      //   icon: 'pi pi-sitemap',
      //   route: buildUsuariosRoute(PAGES_ROUTES.DASHBOARD.USUARIOS.GRUPOS),
      // },
      // {
      //   id: 23,
      //   label: 'Permisos',
      //   icon: 'pi pi-shield',
      //   route: buildUsuariosRoute(PAGES_ROUTES.DASHBOARD.USUARIOS.PERMISOS),
      // },
    ],
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
        label: 'Historial por Usuario',
        icon: 'pi pi-user',
        route: buildAccionRoute(PAGES_ROUTES.ACCION.HISTORIAL_USUARIO),
      }

    ],
  },
];

export default MENU_ITEMS;
