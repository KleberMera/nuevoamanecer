import { Component, computed, inject } from '@angular/core';
import { SiderbarService } from '@shared/services/siderbar-service';
import { ViewportService } from '@shared/services/viewport-service';
import { SidebarItem } from "../sidebar-item/sidebar-item";

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
 public _sidebarService = inject(SiderbarService);

   private readonly viewportService = inject(ViewportService);

  protected readonly showOverlay = computed(() => 
    !this.viewportService.isDesktop() && this._sidebarService.isOpen()
  );
}
