import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '@shared/services/auth-state-service';
import PAGES_ROUTES from '../routes/pages.routes';
import { BASE_PATHS } from '../routes/api.routes';

const handleUnauthorized = (router: Router, authState: AuthStateService) => {
  authState.signOut();
  router.navigateByUrl(PAGES_ROUTES.AUTH.LOGIN);
};

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // No añadir token a peticiones de login o registro
  if (request.url.includes(`/${BASE_PATHS.AUTH}/`)) {
    return next(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          handleUnauthorized(router, authState);
        }
        return throwError(() => error);
      })
    );
  }

  // Obtener token y adjuntarlo a la petición
  const token = authState.getSession();
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        handleUnauthorized(router, authState);
      }
      return throwError(() => error);
    })
  );
};