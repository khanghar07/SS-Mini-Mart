import ProductCard from "@/components/products/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductContext";

const FeaturedProducts = () => {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isActive && p.stock > 0).slice(0, 8);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-bold text-ink-900">Featured Products</h2>
        <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-brand-700">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
