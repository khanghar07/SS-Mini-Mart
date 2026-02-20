import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Coca-Cola 1.5L",
    description: "Refreshing carbonated soft drink, perfect for any occasion.",
    price: 2.49,
    discount: 0,
    category: "beverages",
    imageUrl: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&h=800&fit=crop",
    stock: 50,
    isActive: true
  },
  {
    id: "2",
    name: "Fresh Whole Milk 1L",
    description: "Farm-fresh whole milk, pasteurized and packed with nutrients.",
    price: 1.89,
    discount: 10,
    category: "dairy",
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=800&fit=crop",
    stock: 30,
    isActive: true
  },
  {
    id: "3",
    name: "Lay's Classic Chips",
    description: "Crispy golden potato chips with classic salted flavor.",
    price: 3.29,
    discount: 15,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=800&fit=crop",
    stock: 45,
    isActive: true
  },
  {
    id: "4",
    name: "Jasmine Rice 5kg",
    description: "Premium long-grain jasmine rice with aromatic fragrance.",
    price: 8.99,
    discount: 0,
    category: "rice-grains",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop",
    stock: 20,
    isActive: true
  },
  {
    id: "5",
    name: "Extra Virgin Olive Oil 500ml",
    description: "Cold-pressed extra virgin olive oil. Perfect for salads and cooking.",
    price: 6.49,
    discount: 5,
    category: "cooking-oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop",
    stock: 25,
    isActive: true
  },
  {
    id: "7",
    name: "Antibacterial Hand Soap",
    description: "Gentle antibacterial hand soap with moisturizing formula.",
    price: 2.99,
    discount: 20,
    category: "toiletries",
    imageUrl: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=800&h=800&fit=crop",
    stock: 40,
    isActive: true
  },
  {
    id: "8",
    name: "Multi-Surface Cleaner 750ml",
    description: "Powerful cleaning spray for kitchen and bathroom.",
    price: 4.49,
    discount: 0,
    category: "household",
    imageUrl: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&h=800&fit=crop",
    stock: 35,
    isActive: true
  }
];
