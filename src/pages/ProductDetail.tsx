import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useProducts } from "@/context/ProductContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="container py-16 text-center">
        <p className="text-lg text-ink-700">Product not found</p>
        <Link to="/products" className="text-brand-700 text-sm">? Back to products</Link>
      </main>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const outOfStock = product.stock === 0;

  return (
    <main className="container py-6">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-emerald-50 shadow-soft">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          {product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-amber-400 text-white">-{product.discount}% OFF</Badge>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink-900">{product.name}</h1>
          <p className="text-ink-700 mt-2">{product.description}</p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-heading font-bold text-ink-900">
              {formatCurrency(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-lg text-ink-700 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>
          <div className="mt-3">
            {outOfStock ? (
              <Badge className="bg-rose-500 text-white">Out of Stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge className="bg-amber-400 text-white">Only {product.stock} left</Badge>
            ) : (
              <Badge className="bg-brand-600 text-white">In Stock</Badge>
            )}
          </div>
          {!outOfStock && (
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border border-emerald-100 rounded-xl">
                <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-ink-900">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1 gap-2" onClick={() => addToCart(product, quantity)}>
                <ShoppingCart className="h-4 w-4" /> Add to Cart — {formatCurrency(discountedPrice * quantity)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
