import { Component, inject, signal } from '@angular/core';
import { SiderbarService } from '../../../services/siderbar-service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, MenuModule, AvatarModule, DividerModule, BadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public readonly _sidebarService = inject(SiderbarService);
  unreadNotifications = signal<number>(2);
  userName = signal<string>('Usuario Admin');
  userRole = signal<string>('Administrador');
}
