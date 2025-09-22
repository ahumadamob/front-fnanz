import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { CategoriaFinancieraService } from '../../core/services/categoria-financiera.service';
import { GastoReservadoService } from '../../core/services/gasto-reservado.service';

const apiEnvelope = <T>(data: T) => ({ message: 'ok', data, timestamp: new Date().toISOString() });

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            me: () => of(apiEnvelope({
              id: 1,
              nombre: 'Usuario Demo',
              email: 'demo@fnanz.test',
              monedaBase: 'ARS',
              creadoEn: new Date().toISOString(),
              actualizadoEn: new Date().toISOString()
            })),
            list: () => of(apiEnvelope([]))
          }
        },
        {
          provide: CategoriaFinancieraService,
          useValue: {
            list: () => of(apiEnvelope([]))
          }
        },
        {
          provide: GastoReservadoService,
          useValue: {
            list: () => of(apiEnvelope([]))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
