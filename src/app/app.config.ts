import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import MyTheme from './core/types/apptheme';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // providePrimeNG({
    //   theme: {
    //     preset: Aura,
    //   },
    // }),
        providePrimeNG({ theme: MyTheme, ripple: true }),
  ],
};
