export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
  message: string;
  errors: string[];
}

export interface PagedData<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: PagedData<T>;
  message: string;
  errors: string[];
}
