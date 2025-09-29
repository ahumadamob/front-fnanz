import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  readonly apiBaseUrl = environment.apiBaseUrl;
  readonly environmentLabel = environment.production ? 'Producción' : 'Desarrollo';
}
