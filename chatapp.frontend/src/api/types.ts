export interface Result<T = void> {
  data: T;
  errorMessage?: string;
  isSuccess: boolean;
}
