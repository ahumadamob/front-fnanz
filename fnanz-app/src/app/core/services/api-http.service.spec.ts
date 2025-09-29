import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { EnvironmentService } from './environment.service';

describe('ApiHttpService', () => {
  let service: ApiHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, EnvironmentService]
    });

    service = TestBed.inject(ApiHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should perform GET requests with the environment base URL', () => {
    service.get('health').subscribe();

    const request = httpMock.expectOne('https://api.fnanz.local/health');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });
});
