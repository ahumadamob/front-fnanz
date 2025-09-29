import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { EnvironmentService } from '../../core/services/environment.service';

const environmentMock = {
  apiBaseUrl: 'http://localhost:3000/api',
  environmentLabel: 'Desarrollo'
};

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardService,
        {
          provide: EnvironmentService,
          useValue: {
            apiBaseUrl: environmentMock.apiBaseUrl,
            environmentLabel: environmentMock.environmentLabel
          }
        }
      ]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call the system health endpoint when refreshing', () => {
    const expected = `${environmentMock.apiBaseUrl}/system/health`;

    service.refresh();
    service.loadSystemHealth().subscribe();

    const request = httpMock.expectOne(expected);
    request.flush([]);
  });
});
