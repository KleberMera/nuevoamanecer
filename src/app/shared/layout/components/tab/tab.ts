import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';
import { MenuItem, SubMenuItem } from '@core/models/menu';
import { TAB_ITEMS, MENU_ITEMS } from '@core/routes/menu.routes';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-tab',
  imports: [RouterLink, RouterLinkActive, DrawerModule],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
})
export class Tab {
  protected readonly router = inject(Router);
  protected readonly PAGES_ROUTES = PAGES_ROUTES;
  protected readonly tabItems = signal<MenuItem[]>(TAB_ITEMS);
  protected menuVisible = signal(false);
  
  // Obtener todos los items del menú incluyendo subitems
  protected allMenuItems = computed(() => {
    const items: Array<MenuItem | SubMenuItem> = [];
    MENU_ITEMS.forEach(item => {
      if (item.subitems && item.subitems.length > 0) {
        items.push(...item.subitems);
      } else if (item.route) {
        items.push(item);
      }
    });
    return items;
  });

  protected toggleMenu(): void {
    this.menuVisible.update(v => !v);
  }

  protected closeMenu(): void {
    this.menuVisible.set(false);
  }

  protected navigateTo(route?: string): void {
    if (route) {
      this.router.navigate([route]);
      this.closeMenu();
    }
  }
}
