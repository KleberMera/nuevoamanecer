import { Routes } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';

export const prestamoRoutes: Routes = [
  {
    path: PAGES_ROUTES.PRESTAMO.DEFAULT,
    children: [
      {
        path: PAGES_ROUTES.PRESTAMO.LISTA,
        loadComponent: () => import('./pages/prestamo/prestamo'),
      },
    ],
  },
];

export default prestamoRoutes;
