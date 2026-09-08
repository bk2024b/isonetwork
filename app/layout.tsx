import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ISO Network — Boutique Informatique | Abidjan',
  description:
    'Ordinateurs portables, PC de bureau, accessoires et matériel bureautique sélectionnés pour les particuliers et professionnels. Livraison à Abidjan.',
  keywords: [
    'ordinateur Abidjan',
    'PC portable Côte d\'Ivoire',
    'boutique informatique Abidjan',
    'HP Dell Lenovo Abidjan',
    'accessoires informatiques',
    'ISO Network',
  ],
  openGraph: {
    title: 'ISO Network — Boutique Informatique',
    description: 'La technologie qu\'il vous faut. Ordinateurs et accessoires premium à Abidjan.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
