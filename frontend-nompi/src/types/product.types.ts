export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  deleted?: boolean;
  imageUrl?: string;
}
