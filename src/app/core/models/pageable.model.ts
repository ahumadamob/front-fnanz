export interface PageableRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageRequestParams {
  q?: string;
  pageable?: PageableRequest;
}
