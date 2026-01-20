import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import MyTheme from './core/types/apptheme';
//import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    //  provideHttpClient(withFetch(), withInterceptors([handleErrorInterceptor, authInterceptor])),
    provideRouter(routes),
    // provideAnimationsAsync(), Deprecado
    // providePrimeNG({
    //   theme: {
    //     preset: Aura,
    //   },
    // }),
    providePrimeNG({ theme: MyTheme, ripple: true }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
