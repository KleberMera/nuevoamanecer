import { Component, inject, signal } from '@angular/core';
import { SiderbarService } from '../../../services/siderbar-service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, MenuModule, AvatarModule, DividerModule, BadgeModule, OverlayBadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public readonly _sidebarService = inject(SiderbarService);
  unreadNotifications = signal<number>(2);
  userName = signal<string>('Usuario Admin');
  userRole = signal<string>('Administrador');
  userImage = signal<string>('https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png');
}
