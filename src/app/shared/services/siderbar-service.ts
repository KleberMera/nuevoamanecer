import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ViewportService } from './viewport-service';

@Injectable({
  providedIn: 'root',
})
export class SiderbarService {
   private readonly _isForceOpen = signal<boolean | null>(null);
  private readonly viewportService = inject(ViewportService);

  constructor() {
    // Efecto para resetear el estado forzado cuando cambia el viewport
    effect(() => {
      this.viewportService.width();
      this._isForceOpen.set(null);
    });
  }

  readonly isOpen = computed(() => {
    const forceState = this._isForceOpen();
    if (forceState !== null) return forceState;
    return this.viewportService.isDesktop();
  });

  toggle() {
    this._isForceOpen.update((state) =>
      state === null ? !this.isOpen() : !state
    );
  }

  close() {
    this._isForceOpen.set(false);
  }

  open() {
    this._isForceOpen.set(true);
  }
}
