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
      {
        path: PAGES_ROUTES.PRESTAMO.SIMULADOR,
        loadComponent: () => import('./pages/simulador-amortizacion/simulador-amortizacion'),
      }
    ],
  },
];

export default prestamoRoutes;
