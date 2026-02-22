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
  categoryId: string;
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
  orderId?: string;
  firestoreId?: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total?: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  stockAdjusted?: StockAdjusted;
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
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

export type UserRole = "admin" | "customer";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
