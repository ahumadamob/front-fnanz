import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoriasFinancierasComponent } from './features/categorias-financieras/categorias-financieras.component';
import { GastosReservadosComponent } from './features/gastos-reservados/gastos-reservados.component';
import { PeriodosFinancierosComponent } from './features/periodos-financieros/periodos-financieros.component';

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
    path: 'periodos-financieros',
    component: PeriodosFinancierosComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
