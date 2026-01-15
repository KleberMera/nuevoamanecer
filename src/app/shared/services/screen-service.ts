import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
   private readonly screenWidth = signal<number>(window.innerWidth);
  
  readonly isMobile = computed(() => this.screenWidth() < 768);
  readonly isTablet = computed(() => this.screenWidth() >= 768 && this.screenWidth() < 1024);
  readonly isDesktop = computed(() => this.screenWidth() >= 1024);
  
  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    }, { passive: true });
  }
}
