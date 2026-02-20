import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCategories } from "@/context/CategoryContext";

const Products = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const activeCategory = searchParams.get("category") || "all";

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.isActive);

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategory, search, sort, products]);

  return (
    <main className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink-900">All Products</h1>
          <p className="text-sm text-ink-700">Browse essentials and daily favorites.</p>
        </div>
        <div className="flex gap-2">
          <select
            className="input"
            value={activeCategory}
            onChange={(e) => setSearchParams(e.target.value === "all" ? {} : { category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-700" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-700">
          <p className="text-lg">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Products;
