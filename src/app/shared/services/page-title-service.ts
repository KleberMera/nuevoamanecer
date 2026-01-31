import { Injectable, signal } from '@angular/core';

export interface PageTitle {
  label: string;
  highlight?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private pageTitleSignal = signal<PageTitle>({ label: 'Nueva Pantalla' });

  setPageTitle(label: string, highlight?: string): void {
    this.pageTitleSignal.set({ label, highlight });
  }

  getPageTitle() {
    return this.pageTitleSignal.asReadonly();
  }
}
