import { Routes } from '@angular/router';
import PAGES_ROUTES from '../../core/routes/pages.routes';



export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PAGES_ROUTES.AUTH.LOGIN,
      },
      {
        path: PAGES_ROUTES.AUTH.LOGIN,
        loadComponent: () => import('./pages/login/login'),
      },
    //   {
    //     path: AUTH_PAGES.SIGNUP,
    //     loadComponent: () => import('./pages/sign-up/sign-up.component'),
    //   },
    //   {
    //     path: '',
    //     loadChildren: () => import('./forgot-password.routes'),
    //   },

    ],
  },
  {
    path: '**',
    redirectTo: PAGES_ROUTES.AUTH.LOGIN,
  },
];


export default authRoutes;