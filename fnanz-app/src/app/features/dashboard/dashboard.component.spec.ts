import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PeriodoFinancieroService } from '../../core/services/periodo-financiero.service';
import { PeriodoFinancieroPartidasResumen } from '../../shared/models/periodo-financiero.model';
import { DashboardComponent } from './dashboard.component';

const resumenMock: PeriodoFinancieroPartidasResumen = {
  ingresos: [],
  totalIngresos: { montoReservado: 0, montoAplicado: 0 },
  egresos: [],
  totalEgresos: { montoReservado: 0, montoAplicado: 0 },
  totalGeneral: { montoReservado: 0, montoAplicado: 0 }
};

class PeriodoFinancieroServiceStub {
  dropdown() {
    return of([{ id: 1, nombre: '2024' }]);
  }

  getPartidasResumen() {
    return of(resumenMock);
  }
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: PeriodoFinancieroService, useClass: PeriodoFinancieroServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
