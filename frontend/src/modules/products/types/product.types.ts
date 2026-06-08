export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  minimumStock: number;
  unitMeasure: string;
  categoryId: string;
  categoryName: string;
  currentStock: number;
}

export interface ProductListApiResponse {
  data: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductListResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
