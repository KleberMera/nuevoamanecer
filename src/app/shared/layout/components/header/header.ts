import { Component, inject, signal } from '@angular/core';
import { SiderbarService } from '@shared/services/siderbar-service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Storage } from '../../../services/storage';
import { ViewportService } from '@app/shared/services/viewport-service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, MenuModule, AvatarModule, DividerModule, BadgeModule, OverlayBadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public readonly _sidebarService = inject(SiderbarService);
  public readonly _storage = inject(Storage);
  protected readonly _viewPort = inject(ViewportService);
  unreadNotifications = signal<number>(2);
  userNameProfile = signal<string>(this._storage.getNombreUsuario() || 'Usuario');
  userRole = signal<string>(this._storage.getNombreRol() || 'Rol');
  userName = signal<string>(this._storage.getNombre() || 'Usuario');
  userLabelAvatar = signal<string>(this._storage.getLabelAvatar() || 'U');
}
