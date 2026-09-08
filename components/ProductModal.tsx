'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Shield,
  Package,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Wifi,
  MemoryStick,
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, buildWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/utils';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const SPEC_ICONS: Record<string, React.ReactNode> = {
  processor: <Cpu className="w-4 h-4" />,
  ram: <MemoryStick className="w-4 h-4" />,
  storage: <HardDrive className="w-4 h-4" />,
  display: <Monitor className="w-4 h-4" />,
  battery: <Battery className="w-4 h-4" />,
  connectivity: <Wifi className="w-4 h-4" />,
};

const SPEC_LABELS: Record<string, string> = {
  processor: 'Processeur',
  ram: 'Mémoire vive (RAM)',
  storage: 'Stockage',
  display: 'Écran',
  graphics: 'Carte graphique',
  battery: 'Autonomie',
  os: 'Système d\'exploitation',
  connectivity: 'Connectivité',
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [imgIdx, setImgIdx] = useState(0);

  const stockColors = {
    'En stock': 'text-emerald-400',
    'Stock limité': 'text-amber-400',
    'Rupture de stock': 'text-red-400',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Gallery */}
          <div className="relative">
            <div className="relative aspect-square bg-zinc-800 rounded-tl-2xl rounded-tr-2xl lg:rounded-tr-none lg:rounded-bl-2xl overflow-hidden">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[imgIdx].url}
                  alt={product.images[imgIdx].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-20 h-20 text-zinc-600" />
                </div>
              )}

              {/* Gallery Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 p-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === imgIdx ? 'border-emerald-500' : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <div className="flex-1">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
                {product.brand} · {product.category}
              </p>
              <h2 className="text-2xl font-bold text-zinc-100 mb-3">{product.name}</h2>

              {/* Status row */}
              <div className="flex flex-wrap gap-3 mb-5">
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    stockColors[product.stockStatus]
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {product.stockStatus}
                </span>
                <span className="px-2.5 py-0.5 bg-zinc-800 text-zinc-400 text-sm rounded-full border border-zinc-700">
                  {product.condition}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-zinc-100">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-zinc-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-sm text-emerald-400 mt-1">
                    Économie :{' '}
                    {formatPrice(product.originalPrice - product.price)}
                  </p>
                )}
              </div>

              {/* Specs */}
              {Object.entries(product.specs).some(([, v]) => v) && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
                    Caractéristiques techniques
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(product.specs).map(([key, value]) =>
                      value ? (
                        <div
                          key={key}
                          className="flex items-start gap-3 py-2 border-b border-zinc-800 last:border-0"
                        >
                          <span className="mt-0.5 text-zinc-500">
                            {SPEC_ICONS[key] || <Cpu className="w-4 h-4" />}
                          </span>
                          <div className="flex-1 flex justify-between gap-4 min-w-0">
                            <span className="text-sm text-zinc-500 shrink-0">
                              {SPEC_LABELS[key] || key}
                            </span>
                            <span className="text-sm text-zinc-200 text-right">{value}</span>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Included */}
              {product.included.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
                    Contenu du pack
                  </h3>
                  <ul className="space-y-1.5">
                    {product.included.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warranty */}
              <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-800/40 px-4 py-3 rounded-lg border border-zinc-700/50">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garantie : <span className="text-zinc-200 font-medium">{product.warranty}</span></span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <a
                href={buildWhatsAppLink(product, WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-lg font-bold transition-all duration-200 active:scale-95 ${
                  product.stockStatus === 'Rupture de stock'
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed pointer-events-none'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/25'
                }`}
              >
                <MessageCircle className="w-6 h-6" />
                {product.stockStatus === 'Rupture de stock'
                  ? 'Indisponible'
                  : 'Commander sur WhatsApp'}
              </a>
              <p className="text-center text-xs text-zinc-500 mt-2">
                Réponse rapide · Livraison à Abidjan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
