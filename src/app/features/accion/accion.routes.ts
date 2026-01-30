import { Routes } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';

export const accionesRoutes: Routes = [
  {
    path: PAGES_ROUTES.ACCION.DEFAULT,
    children: [
      // {
      //   path: PAGES_ROUTES.ACCION.REGISTRO,
      //   loadComponent: () => import('./pages/registrar-accion/registrar-accion'),
      // },
      {
        path: PAGES_ROUTES.ACCION.HISTORIAL,
        loadComponent: () => import('./pages/historial-accion/historial-accion'),
      },
      {
        path: PAGES_ROUTES.ACCION.HISTORIAL_USUARIO,
        loadComponent: () => import('./pages/historial-accion-usuario/historial-accion-usuario'),
      },
    ],
  },
];

export default accionesRoutes;
