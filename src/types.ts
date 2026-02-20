export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export type StockAdjusted = "none" | "deducted" | "restored";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  stockAdjusted?: StockAdjusted;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
}
