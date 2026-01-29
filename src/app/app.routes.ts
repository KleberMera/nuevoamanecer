import { Routes } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';
import { Layout } from '@shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PAGES_ROUTES.AUTH.DEFAULT,
      },
      {
        path: PAGES_ROUTES.AUTH.DEFAULT,
        loadChildren: () => import('./features/auth/auth.routes'),
      },
      {
        path: PAGES_ROUTES.DASHBOARD.DEFAULT,
        component: Layout,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: PAGES_ROUTES.DASHBOARD.DASHBOARD,
          },
          {
            path: PAGES_ROUTES.DASHBOARD.DASHBOARD,
            loadComponent: () => import('./features/dashboard/pages/home/home'),
          },
          {
            path: PAGES_ROUTES.DASHBOARD.DEFAULT,
            loadChildren: () => import('./features/usuarios/usuarios.routes')
          },
          {
            path: PAGES_ROUTES.DASHBOARD.DEFAULT,
            loadChildren: () => import('./features/accion/accion.routes')
          },
          {
            path: PAGES_ROUTES.DASHBOARD.DEFAULT,
            loadChildren: () => import('./features/prestamo/prestamos.route')
          }
                   
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: PAGES_ROUTES.AUTH.DEFAULT,
  },
];
