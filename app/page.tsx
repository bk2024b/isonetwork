import { getProductsData } from '@/lib/blob';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyISONetwork from '@/components/WhyISONetwork';
import ProSection from '@/components/ProSection';

export const revalidate = 60; // ISR: refresh every 60 seconds

export default async function HomePage() {
  const data = await getProductsData();
  const featured = data.products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection products={data.products} />
        <FeaturedProducts products={featured} />
        <WhyISONetwork />
        <ProSection />
      </main>
      <Footer />
    </>
  );
}
