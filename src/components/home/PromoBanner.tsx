import { Truck, Shield, Clock, Tag } from "lucide-react";

const PromoBanner = () => {
  const promos = [
    { icon: Truck, title: "Free Delivery", desc: "On orders over PKR 5000" },
    { icon: Shield, title: "Secure Checkout", desc: "Cash on delivery" },
    { icon: Clock, title: "Same Day", desc: "Order before 2 PM" },
    { icon: Tag, title: "Best Prices", desc: "Weekly price drops" }
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {promos.map((promo) => (
          <div key={promo.title} className="card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-800 text-brand-200">
              <promo.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-heading font-semibold text-ink-900">{promo.title}</p>
              <p className="text-xs text-ink-700">{promo.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
