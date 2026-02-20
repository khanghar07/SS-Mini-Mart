import { Order } from "@/types";

export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    phone: "555-0101",
    address: "123 Main St, Springfield",
    notes: "Leave at the door",
    items: [
      { productId: "1", name: "Coca-Cola 1.5L", quantity: 2, price: 2.49 },
      { productId: "4", name: "Jasmine Rice 5kg", quantity: 1, price: 8.99 }
    ],
    subtotal: 13.97,
    deliveryFee: 2.5,
    totalAmount: 16.47,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stockAdjusted: "none"
  }
];
