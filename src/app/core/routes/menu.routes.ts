import { MenuItem } from '../models/menu';
import PAGES_ROUTES from './pages.routes';

// Helper functions para construir rutas automáticamente
const buildRoute = (parent: string, child: string): string => `${parent}/${child}`;
const buildUsuariosRoute = (child: string): string => buildRoute(PAGES_ROUTES.USUARIOS.DEFAULT, child);
const buildConfiguracionRoute = (child: string): string => buildRoute(PAGES_ROUTES.DASHBOARD.CONFIGURACION.DEFAULT, child);

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
    label: 'Configuración',
    icon: 'pi pi-cog',
    subitems: [
      // {
      //   id: 31,
      //   label: 'General',
      //   icon: 'pi pi-sliders-v',
      //   route: PAGES_ROUTES.DASHBOARD.CONFIGURACION.GENERAL,
      // },
      // {
      //   id: 32,
      //   label: 'Seguridad',
      //   icon: 'pi pi-lock',
      //   route: PAGES_ROUTES.DASHBOARD.CONFIGURACION.SEGURIDAD,
      // },
    ],
  },
];

export default MENU_ITEMS;
