'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent" />
      
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Produits disponibles à Abidjan
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-zinc-100 leading-[1.05] tracking-tight mb-6">
            La technologie
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              qu&apos;il vous faut.
            </span>
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-lg">
            Ordinateurs, équipements bureautiques et accessoires sélectionnés pour les particuliers et professionnels. Produits testés, garantis, livrés à Abidjan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalogue"
              className="btn-primary text-base px-8 py-4 shadow-lg shadow-emerald-500/20"
            >
              <ShoppingBag className="w-5 h-5" />
              Explorer le catalogue
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '22500000000'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-4"
            >
              <MessageCircle className="w-5 h-5" />
              Nous contacter
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: '100%', label: 'Testé & Contrôlé' },
              { value: '6-12 mois', label: 'Garantie' },
              { value: '24h', label: 'Réponse WhatsApp' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image / visual */}
        <div className="relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-lg ml-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-3xl scale-110" />
            
            <div className="relative rounded-3xl overflow-hidden border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm shadow-2xl h-[460px]">
              <Image
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=90"
                alt="Laptop premium HP EliteBook"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Floating cards */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl border border-zinc-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">Produit populaire</p>
                      <p className="font-semibold text-zinc-100">HP EliteBook 840 G8</p>
                      <p className="text-emerald-400 font-bold text-lg">225 000 FCFA</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs text-emerald-400 font-medium">En stock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
        <span className="text-xs tracking-widest uppercase">Découvrir</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  );
}
