export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
  message: string;
  errors: string[];
}

export interface PagedResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T[];
  message: string;
  errors: string[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
