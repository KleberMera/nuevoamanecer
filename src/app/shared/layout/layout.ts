import { Component, inject } from '@angular/core';
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";

import { SiderbarService } from '../services/siderbar-service';
import { ViewportService } from '../services/viewport-service';
import { RouterOutlet } from '@angular/router';
import { ScreenService } from '../services/screen-service';
import { Tab } from "./components/tab/tab";

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterOutlet, Tab],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  sidebarService = inject(SiderbarService);
  public readonly _viewportService = inject(ViewportService);
  public readonly _screenService = inject(ScreenService);

}
