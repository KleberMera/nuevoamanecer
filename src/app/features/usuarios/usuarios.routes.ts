import { Routes } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';


export const usuariosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: PAGES_ROUTES.USUARIOS.GESTIOM,
        loadComponent: () => import('./pages/lista-usuario/lista-usuario'),
      },
    ],
  },
];

export default usuariosRoutes;

