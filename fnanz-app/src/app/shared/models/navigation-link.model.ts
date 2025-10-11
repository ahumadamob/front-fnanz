export interface NavigationLink {
  readonly label: string;
  readonly route: string;
  readonly icon: 'dashboard' | 'categories' | 'periods' | 'budgets';
  readonly exact?: boolean;
}
