import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoriasFinancierasComponent } from './features/categorias-financieras/categorias-financieras.component';
import { GastosReservadosComponent } from './features/gastos-reservados/gastos-reservados.component';

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
    path: 'gastos-reservados',
    component: GastosReservadosComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
