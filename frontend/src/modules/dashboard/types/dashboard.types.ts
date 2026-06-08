export interface ProductDto {
  id: string;
  name: string;
  sku: string;
  minimumStock: number;
  currentStock: number;
}

export interface StockEntryDto {
  productId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
}

export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
