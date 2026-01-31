import { Component, computed, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { Router, NavigationStart } from '@angular/router';
import { PageTitleService } from '@shared/services/page-title-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('nuevoamanecer');
  private router = inject(Router);
  private pageTitleService = inject(PageTitleService);

  constructor() {
    this.setupPageTitleListener();
  }

  private setupPageTitleListener() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe(() => {
        // Resetea al defecto ANTES de cargar el componente
        this.pageTitleService.resetPageTitle();
      });
  }
}
