import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SiderbarService } from '../../../services/siderbar-service';
import { ViewportService } from '../../../services/viewport-service';
import { MenuItem } from '../../../../core/models/menu';

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

  
  protected readonly menuItems = signal<MenuItem[]>([
    {
      id: 1,
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      route: 'dashboard',
    },
    {
      id: 2,
      label: 'Usuarios',
      icon: 'pi pi-users',
      subitems: [
        {
          id: 21,
          label: 'Lista de Usuarios',
          icon: 'pi pi-list',
          route: 'lista-usuarios',
        },
        {
          id: 22,
          label: 'Grupos',
          icon: 'pi pi-sitemap',
          route: 'grupos',
        },
        {
          id: 23,
          label: 'Permisos',
          icon: 'pi pi-shield',
          route: 'permisos',
        },
      ],
    },
    {
      id: 3,
      label: 'Configuración',
      icon: 'pi pi-cog',
      subitems: [
        {
          id: 31,
          label: 'General',
          icon: 'pi pi-sliders-v',
          route: 'configuracion',
        },
        {
          id: 32,
          label: 'Seguridad',
          icon: 'pi pi-lock',
          route: 'seguridad',
        },
      ],
    },
  ]);

  protected isItemActive(item: MenuItem): boolean {
    if (item.route && this.router.url.startsWith(item.route)) return true;
    return (
      item.subitems?.some((subitem) =>
        this.router.url.startsWith(subitem.route)
      ) ?? false
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
        const rutas = `home/${item.route}`;

        this.router.navigate([rutas]);
      }
    }
  }

  protected handleSubItemClick(): void {
    if (!this.viewportService.isDesktop()) {
      this.sidebarService.close();
    }
  }
}
