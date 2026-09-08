import { Suspense } from 'react';
import { getProductsData } from '@/lib/blob';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CatalogueClient from '@/components/CatalogueClient';

export const revalidate = 30;

export const metadata = {
  title: 'Catalogue — ISO Network',
  description:
    'Retrouvez tous nos ordinateurs, accessoires et matériels bureautiques. Filtrez par catégorie, marque, prix et disponibilité.',
};

interface CataloguePageProps {
  searchParams: { search?: string; category?: string };
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const data = await getProductsData();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-zinc-100">Catalogue</h1>
            <p className="text-zinc-400 mt-2">
              {data.products.length} produits disponibles · Tous testés et garantis
            </p>
          </div>

          <Suspense fallback={<div className="text-zinc-400">Chargement...</div>}>
            <CatalogueClient
              products={data.products}
              initialSearch={searchParams.search || ''}
              initialCategory={searchParams.category || ''}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
