import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoriasFinancierasComponent } from './features/categorias-financieras/categorias-financieras.component';
import { PartidasPresupuestariasComponent } from './features/partidas-presupuestarias/partidas-presupuestarias.component';
import { PeriodosFinancierosComponent } from './features/periodos-financieros/periodos-financieros.component';
import { ReservasResumenComponent } from './features/periodos-financieros/reservas-resumen/reservas-resumen.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'categorias',
    component: CategoriasFinancierasComponent
  },
  {
    path: 'presupuestos',
    component: PartidasPresupuestariasComponent
  },
  {
    path: 'periodos',
    component: PeriodosFinancierosComponent
  },
  {
    path: 'periodos/:id/reservas-resumen',
    component: ReservasResumenComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
