import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SiderbarService } from '../../../services/siderbar-service';
import { ViewportService } from '../../../services/viewport-service';
import { MenuItem } from '../../../../core/models/menu';
import MENU_ITEMS from '../../../../core/routes/menu.routes';

@Component({
  selector: 'app-sidebar-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
 protected readonly router = inject(Router);
  private readonly sidebarService = inject(SiderbarService);
  private readonly viewportService = inject(ViewportService);
  readonly expandedItems = signal<Record<number, boolean>>({});
  protected readonly menuItems = signal<MenuItem[]>(MENU_ITEMS);

  protected isItemActive(item: MenuItem): boolean {
    if (!item.route) return false;
    const currentRoute = this.router.url.substring(1); // Remove leading /
    if (currentRoute === item.route) return true;
    return (
      item.subitems?.some((subitem) => {
        const subRoute = this.router.url.substring(1); // Remove leading /
        return subRoute === subitem.route;
      }) ?? false
    );
  }

  protected manejarClickItem(item: MenuItem): void {
    if (item.subitems?.length) {
      this.expandedItems.update((state) => ({
        ...state,
        [item.id]: !state[item.id],
      }));
    } else {
      if (!this.viewportService.isDesktop()) {
        this.sidebarService.close();
      }
      if (item.route) {
        this.router.navigate([item.route]);
      }
    }
  }

  protected handleSubItemClick(subitemRoute?: string): void {
    if (!this.viewportService.isDesktop()) {
      this.sidebarService.close();
    }
    if (subitemRoute) {
      this.router.navigate([subitemRoute]);
    }
  }
}
