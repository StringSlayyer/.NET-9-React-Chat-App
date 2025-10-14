export interface Result<T> {
  data: T;
  errorMessage?: string;
  isSuccess: boolean;
}
