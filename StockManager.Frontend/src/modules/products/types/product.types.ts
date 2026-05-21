export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  price: number;
  minimumStock: number;
  unitMeasure: number; // 0 para Unidade, 1 para Kg, etc (seguindo a spec e o Insomnia)
  sku: string;
  barcode: string;
  active: boolean;
  currentStock?: number;
}

export interface Category {
  id: string;
  name: string;
}
