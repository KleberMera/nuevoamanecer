import { Routes } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';

export const prestamoRoutes: Routes = [
  {
    path: PAGES_ROUTES.PRESTAMO.DEFAULT,
    children: [
      {
        path: PAGES_ROUTES.PRESTAMO.GESTIOM,
        loadComponent: () => import('./pages/prestamo/prestamo'),
      },
      {
        path: PAGES_ROUTES.PRESTAMO.SIMULADOR,
        loadComponent: () => import('./pages/simulador-amortizacion/simulador-amortizacion'),
      },
      {
        path: PAGES_ROUTES.PRESTAMO.CONTROL,
        loadComponent: () => import('./pages/control-prestamo/control-prestamo'),
      },
      {
        path: PAGES_ROUTES.PRESTAMO.USUARIO,
        loadComponent: () => import('./pages/lista-prestamo/lista-prestamo'),
      }
    ],
  },
];

export default prestamoRoutes;
