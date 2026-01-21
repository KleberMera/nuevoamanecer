import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import PAGES_ROUTES from '@core/routes/pages.routes';
import { MenuItem } from '@core/models/menu';
import { TAB_ITEMS } from '@core/routes/menu.routes';

@Component({
  selector: 'app-tab',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
})
export class Tab {
  protected readonly PAGES_ROUTES = PAGES_ROUTES;
  protected readonly tabItems = signal<MenuItem[]>(TAB_ITEMS);
}
