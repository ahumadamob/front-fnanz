import { HttpParams } from '@angular/common/http';

import { PageRequestParams } from '../models/pageable.model';

export function buildPageRequestParams(params?: PageRequestParams): HttpParams {
  let httpParams = new HttpParams();

  if (!params) {
    return httpParams;
  }

  if (params.q) {
    httpParams = httpParams.set('q', params.q);
  }

  const pageable = params.pageable;
  if (pageable) {
    if (typeof pageable.page === 'number') {
      httpParams = httpParams.set('page', String(pageable.page));
    }

    if (typeof pageable.size === 'number') {
      httpParams = httpParams.set('size', String(pageable.size));
    }

    if (pageable.sort?.length) {
      pageable.sort.forEach((sortValue) => {
        httpParams = httpParams.append('sort', sortValue);
      });
    }
  }

  return httpParams;
}
