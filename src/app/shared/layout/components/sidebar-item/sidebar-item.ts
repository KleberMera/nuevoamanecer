import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SiderbarService } from '../../../services/siderbar-service';
import { ViewportService } from '../../../services/viewport-service';
import { MenuItem } from '../../../../core/models/menu';
import PAGES_ROUTES from '../../../../core/routes/pages.routes';

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
      route: PAGES_ROUTES.DASHBOARD.DASHBOARD,
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
          route: PAGES_ROUTES.DASHBOARD.USUARIOS.LISTA,
        },
        // {
        //   id: 22,
        //   label: 'Grupos',
        //   icon: 'pi pi-sitemap',
        //   route: PAGES_ROUTES.DASHBOARD.USUARIOS.GRUPOS,
        // },
        // {
        //   id: 23,
        //   label: 'Permisos',
        //   icon: 'pi pi-shield',
        //   route: PAGES_ROUTES.DASHBOARD.USUARIOS.PERMISOS,
        // },
      ],
    },
    {
      id: 3,
      label: 'Configuración',
      icon: 'pi pi-cog',
      subitems: [
        // {
        //   id: 31,
        //   label: 'General',
        //   icon: 'pi pi-sliders-v',
        //   route: PAGES_ROUTES.DASHBOARD.CONFIGURACION.GENERAL,
        // },
        // {
        //   id: 32,
        //   label: 'Seguridad',
        //   icon: 'pi pi-lock',
        //   route: PAGES_ROUTES.DASHBOARD.CONFIGURACION.SEGURIDAD,
        // },
      ],
    },
  ]);

  protected isItemActive(item: MenuItem): boolean {
    if (!item.route) return false;
    const currentRoute = this.router.url.replace('/', '');
    if (currentRoute === item.route) return true;
    return (
      item.subitems?.some((subitem) => {
        const subRoute = this.router.url.replace('/', '');
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
