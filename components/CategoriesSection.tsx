import Link from 'next/link';
import { Laptop, Monitor, Keyboard, Printer, ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '@/types';

interface CategoriesSectionProps {
  products: Product[];
}

const CATEGORIES: {
  label: ProductCategory;
  icon: React.ElementType;
  href: string;
  description: string;
}[] = [
  {
    label: 'Ordinateurs portables',
    icon: Laptop,
    href: '/catalogue?category=Ordinateurs+portables',
    description: 'Ultrabooks, professionnels, reconditionné certifié',
  },
  {
    label: 'Ordinateurs de bureau',
    icon: Monitor,
    href: '/catalogue?category=Ordinateurs+de+bureau',
    description: 'PC compacts, tours, all-in-one pour entreprises',
  },
  {
    label: 'Accessoires',
    icon: Keyboard,
    href: '/catalogue?category=Accessoires',
    description: 'Souris, claviers, sacoches, hubs USB-C, casques',
  },
  {
    label: 'Matériel bureautique',
    icon: Printer,
    href: '/catalogue?category=Mat%C3%A9riel+bureautique',
    description: 'Imprimantes, onduleurs, scanners, téléphones IP',
  },
];

export default function CategoriesSection({ products }: CategoriesSectionProps) {
  const countByCategory = (cat: ProductCategory) =>
    products.filter((p) => p.category === cat).length;

  return (
    <section id="categories" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">Nos catégories</h2>
          <p className="section-subtitle mx-auto text-center">
            Tout le matériel informatique dont vous avez besoin, sélectionné et testé par nos techniciens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(({ label, icon: Icon, href, description }) => (
            <Link key={label} href={href} className="group card card-hover p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-zinc-100 mb-1.5">{label}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  {countByCategory(label)}{' '}
                  {countByCategory(label) > 1 ? 'produits' : 'produit'}
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
