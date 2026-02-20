import { Link } from "react-router-dom";
import { useCategories } from "@/context/CategoryContext";

const CategoryScroll = () => {
  const { categories } = useCategories();
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-bold text-ink-900">Shop by Category</h2>
        <Link to="/products" className="text-sm font-semibold text-brand-700">Browse all</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group rounded-2xl border border-emerald-100 bg-white overflow-hidden shadow-soft hover:shadow-card transition-all"
          >
            <div className="relative h-28 w-full">
              <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-ink-700">{cat.icon}</div>
                <div className="text-sm font-semibold text-ink-900">{cat.name}</div>
              </div>
              <span className="text-xs text-ink-700">View</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryScroll;
