import HeroSection from "@/components/home/HeroSection";
import CategoryScroll from "@/components/home/CategoryScroll";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import HorizontalAds from "@/components/home/VerticalAds";

const Index = () => {
  return (
    <main className="container pb-8">
      <HeroSection />
      <PromoBanner />
      <HorizontalAds />
      <CategoryScroll />
      <FeaturedProducts />
    </main>
  );
};

export default Index;
