import { inject } from '@angular/core';
import { Router, CanActivateFn, CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '@shared/services/auth-state-service';
import PAGES_ROUTES from '../routes/pages.routes';

/**
 * Guard para proteger rutas que requieren autenticación
 * Si no hay sesión válida, redirige al login
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const token = authState.getSession();
  
  if (token) {
    // Sesión válida, acceso permitido
    return true;
  }

  // Sin sesión válida, redirige al login
  router.navigateByUrl(PAGES_ROUTES.AUTH.LOGIN);
  return false;
};

/**
 * Guard para rutas de autenticación (login, signup)
 * Si ya hay sesión válida, redirige al dashboard
 */
export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const token = authState.getSession();
  
  if (token) {
    // Ya tiene sesión válida, redirige al dashboard
    router.navigateByUrl(PAGES_ROUTES.DASHBOARD.DEFAULT);
    return false;
  }

  // Sin sesión, acceso permitido al login
  return true;
};
