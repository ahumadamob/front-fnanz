import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoriasFinancierasComponent } from './features/categorias-financieras/categorias-financieras.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'categorias-financieras',
    component: CategoriasFinancierasComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
