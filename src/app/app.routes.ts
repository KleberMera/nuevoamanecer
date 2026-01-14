import { Routes } from '@angular/router';
import PAGES_ROUTES from './core/routes/pages.routes';
import { Layout } from './shared/layout/layout';

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
      // {
      //   path: PAGES_ROUTES.DASHBOARD.DASHBOARD,
      //   loadComponent: () => import('./features/dashboard/home/home').then(m => m.Home),
      // },
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
          // {
          //   path: PAGES_ROUTES.DASHBOARD.DEFAULT,
          //   loadChildren: () => import('./features/tablas/tablas.routes')
          // },
          //           {
          //   path: PAGES_ROUTES.DASHBOARD.DEFAULT,
          //   loadChildren: () => import('./features/registradores/registradores.routes')
          // },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: PAGES_ROUTES.AUTH.DEFAULT,
  },
];
