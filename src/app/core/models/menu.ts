export interface SubMenuItem {
  id: number;
  label: string;
  route: string;
  icon?: string;
}

export interface MenuItem {
  id: number;
  label: string;
  icon: string;
  route?: string;
  subitems?: SubMenuItem[];
}
