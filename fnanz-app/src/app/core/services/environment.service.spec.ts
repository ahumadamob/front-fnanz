import { environment } from '../../../environments/environment';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  it('should expose apiBaseUrl and environmentLabel', () => {
    const service = new EnvironmentService();
    expect(service.apiBaseUrl).toBe(environment.apiBaseUrl);
    expect(service.environmentLabel).toBe('Producción');
  });
});
