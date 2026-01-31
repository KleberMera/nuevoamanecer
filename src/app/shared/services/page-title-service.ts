import { inject, Injectable, signal } from '@angular/core';
import { Storage } from './storage';

export interface PageTitle {
  label: string;
  highlight?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
    protected readonly _storage = inject(Storage);
  private pageTitleSignal = signal<PageTitle>({ label: 'Hola,' , highlight: this._storage.getNombre() || 'Usuario' });

  setPageTitle(label: string, highlight?: string): void {
    this.pageTitleSignal.set({ label, highlight });
  }

  getPageTitle() {
    return this.pageTitleSignal.asReadonly();
  }
}
