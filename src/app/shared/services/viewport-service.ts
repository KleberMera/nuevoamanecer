import { computed, Injectable, signal } from '@angular/core';
import { fromEvent, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
    private readonly DESKTOP_BREAKPOINT = signal<number>(768);
  readonly width = signal(window.innerWidth);

  readonly isDesktop = computed(
    () => this.width() >= this.DESKTOP_BREAKPOINT()
  );

  constructor() {
    fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        this.width.set(window.innerWidth);
      });
  }
}
