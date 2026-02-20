import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative rounded-2xl border border-emerald-100 bg-white shadow-soft hover:shadow-card transition-all overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-emerald-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-amber-400 text-white">
              -{product.discount}%
            </Badge>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-ink-900/50 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-md text-sm font-semibold text-ink-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm text-ink-900 truncate hover:text-brand-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-heading font-bold text-ink-900">
            {formatCurrency(discountedPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-ink-700 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        {lowStock && (
          <p className="text-xs text-amber-600 font-medium mt-1">Only {product.stock} left!</p>
        )}
        <Button
          size="sm"
          className="w-full mt-3"
          disabled={outOfStock}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {outOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
