export interface ApiResponseSuccess<T> {
  message: string;
  data: T;
  timestamp: string;
}
