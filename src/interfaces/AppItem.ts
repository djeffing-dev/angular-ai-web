export interface AppItem {
    id: string;
    name: string;
    icon: string;
    iconClass: string;
    badge?: 'NEW' | 'PRO';
    active: boolean;
  }