import { Routes } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';

export const nominaRoutes: Routes = [
  {
    path: PAGES_ROUTES.NOMINA.DEFAULT,
    children: [
      // {
      //   path: PAGES_ROUTES.ACCION.REGISTRO,
      //   loadComponent: () => import('./pages/registrar-accion/registrar-accion'),
      // },
      {
        path: PAGES_ROUTES.NOMINA.REPORTE_PAGOSS,
        loadComponent: () => import('./pages/pagos/pagos'),
      },
    ],
  },
];

export default nominaRoutes;
