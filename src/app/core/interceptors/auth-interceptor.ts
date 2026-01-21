import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '@shared/services/auth-state-service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // No añadir token a peticiones de login o registro
  if (request.url.includes('/autenticacion/')) {
    return next(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          authState.signOut();
          router.navigateByUrl('/auth');
        }
        return throwError(() => error);
      })
    );
  }

  try {
    const token = authState.getSession();

    // Si existe token válido, añadirlo a la petición
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Error al obtener sesión:', error);
  }

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authState.signOut();
        router.navigateByUrl('/auth');
      }

      return throwError(() => error);
    })
  );
};