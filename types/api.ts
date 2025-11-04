export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errorSources?: Array<{
    path: string;
    message: string;
  }>;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}
