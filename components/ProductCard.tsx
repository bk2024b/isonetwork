'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, buildWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = product.images.length > 0;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const stockColors = {
    'En stock': 'badge-emerald',
    'Stock limité': 'badge-amber',
    'Rupture de stock': 'badge-red',
  };

  const conditionColors = {
    Neuf: 'badge-blue',
    'Occasion A+': 'badge-amber',
    Reconditionné: 'badge-amber',
  };

  return (
    <div className="card card-hover group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-zinc-800 overflow-hidden">
        {hasImages ? (
          <Image
            src={product.images[imgIdx].url}
            alt={product.images[imgIdx].alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-12 h-12 text-zinc-600" />
          </div>
        )}

        {/* Navigation arrows for multiple images */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setImgIdx((i) => (i === 0 ? product.images.length - 1 : i - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setImgIdx((i) => (i === product.images.length - 1 ? 0 : i + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={conditionColors[product.condition] + ' badge'}>
            {product.condition}
          </span>
          {discount && (
            <span className="badge bg-red-500/90 text-white border-0">-{discount}%</span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className={stockColors[product.stockStatus] + ' badge'}>
            {product.stockStatus}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-zinc-100 text-sm leading-snug mb-3 line-clamp-2">
            {product.name}
          </h3>

          {/* Key specs */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.specs.processor && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                {product.specs.processor.split(' ').slice(0, 3).join(' ')}
              </span>
            )}
            {product.specs.ram && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                {product.specs.ram.split(' ')[0]}
              </span>
            )}
            {product.specs.storage && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                {product.specs.storage.split(' ').slice(0, 3).join(' ')}
              </span>
            )}
            {product.specs.display && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                {product.specs.display.split('"')[0]}"
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-zinc-100">{formatPrice(product.price)}</span>
          </div>
          {product.originalPrice && (
            <span className="text-sm text-zinc-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView?.(product)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg border border-zinc-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Voir la fiche
          </button>
          <a
            href={buildWhatsAppLink(product, WHATSAPP_NUMBER)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            onClick={(e) => {
              if (product.stockStatus === 'Rupture de stock') e.preventDefault();
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Commander
          </a>
        </div>
      </div>
    </div>
  );
}
