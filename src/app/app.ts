import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppConfigService } from './shared/services/appconfigservice';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('nuevoamanecer');

  checked1 = signal<boolean>(true);
  value = signal<string>('');
  showLoginDialog = signal<boolean>(false);

  protected readonly configService = inject(AppConfigService);
  ///private readonly router = inject(Router);

  toggleDarkMode() {
    this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  isDarkMode = computed(() => this.configService.appState().darkTheme);

  /* onLogin() {
    this.showLoginDialog.set(true);
    
    // Simular proceso de login
    setTimeout(() => {
      this.showLoginDialog.set(false);
      // Redirigir al dashboard después del login exitoso
      this.router.navigate([PAGES_ROUTES.DASHBOARD.DASHBOARD]);
    }, 2000);
  }*/
}
