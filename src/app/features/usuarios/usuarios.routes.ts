import { Routes } from '@angular/router';
import PAGES_ROUTES from '../../core/routes/pages.routes';


export const usuariosRoutes: Routes = [
  {
    path: PAGES_ROUTES.DASHBOARD.USUARIOS.DEFAULT,
    children: [
      {
        path: PAGES_ROUTES.DASHBOARD.USUARIOS.LISTA,
        loadComponent: () => import('./pages/lista-usuario/lista-usuario')
      },
    ],
  },
];

export default usuariosRoutes;

