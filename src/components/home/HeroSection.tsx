import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mt-6 bg-hero">
      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr] items-center p-6 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Premium mini mart service</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-heading font-extrabold text-ink-900">
            Everyday essentials, delivered with care.
          </h1>
          <p className="mt-4 text-sm md:text-base text-ink-700">
            Shop premium staples, weekly specials, and same-day delivery across your neighborhood.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/products">
              <Button size="lg" className="gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/track-order">
              <Button variant="outline" size="lg">Track Order</Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-700">
            <span className="badge">Same-day delivery</span>
            <span className="badge">Premium quality</span>
            <span className="badge">Cash on delivery</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-brand-400/20 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1580915411954-282cb1ceefc3?w=1200&h=900&fit=crop"
            alt="Mini mart essentials"
            className="relative rounded-2xl shadow-soft object-cover w-full h-64 md:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
