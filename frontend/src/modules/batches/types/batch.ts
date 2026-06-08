export interface Batch {
  productId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
}

export interface ExpiredBatch extends Batch {
  productName?: string; // Optional if we want to fetch and display the product name
}
