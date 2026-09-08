'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  ImagePlus,
  Trash2,
  Loader2,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import { Product, ProductCategory, ProductCondition, StockStatus } from '@/types';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
  loading: boolean;
}

const CATEGORIES: ProductCategory[] = [
  'Ordinateurs portables',
  'Ordinateurs de bureau',
  'Accessoires',
  'Matériel bureautique',
];

const CONDITIONS: ProductCondition[] = ['Neuf', 'Occasion A+', 'Reconditionné'];
const STOCK_STATUSES: StockStatus[] = ['En stock', 'Stock limité', 'Rupture de stock'];

interface ImageItem {
  url: string;
  alt: string;
  uploading?: boolean;
}

export default function ProductFormModal({
  product,
  onClose,
  onSave,
  loading,
}: ProductFormModalProps) {
  const isEdit = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || ('' as ProductCategory),
    condition: product?.condition || ('' as ProductCondition),
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    description: product?.description || '',
    warranty: product?.warranty || '',
    stockStatus: product?.stockStatus || ('En stock' as StockStatus),
    featured: product?.featured || false,
    images: (product?.images || []) as ImageItem[],
    included: product?.included?.join('\n') || '',
    // Specs
    processor: product?.specs?.processor || '',
    ram: product?.specs?.ram || '',
    storage: product?.specs?.storage || '',
    display: product?.specs?.display || '',
    graphics: product?.specs?.graphics || '',
    battery: product?.specs?.battery || '',
    os: product?.specs?.os || '',
    connectivity: product?.specs?.connectivity || '',
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError('');
    const fileArr = Array.from(files);
    
    // Add placeholder items while uploading
    const placeholders: ImageItem[] = fileArr.map((f) => ({
      url: URL.createObjectURL(f),
      alt: f.name,
      uploading: true,
    }));
    setForm((f) => ({ ...f, images: [...f.images, ...placeholders] }));

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok) {
          setUploadError(data.error || 'Erreur upload');
          // Remove failed placeholder
          setForm((f) => ({
            ...f,
            images: f.images.filter((img) => img.alt !== file.name || !img.uploading),
          }));
          continue;
        }

        // Replace placeholder with real URL
        setForm((f) => ({
          ...f,
          images: f.images.map((img) =>
            img.alt === file.name && img.uploading
              ? { url: data.url, alt: file.name, uploading: false }
              : img
          ),
        }));
      } catch {
        setUploadError('Erreur lors de l\'upload');
      }
    }
    setUploading(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specs: Record<string, string> = {};
    if (form.processor) specs.processor = form.processor;
    if (form.ram) specs.ram = form.ram;
    if (form.storage) specs.storage = form.storage;
    if (form.display) specs.display = form.display;
    if (form.graphics) specs.graphics = form.graphics;
    if (form.battery) specs.battery = form.battery;
    if (form.os) specs.os = form.os;
    if (form.connectivity) specs.connectivity = form.connectivity;

    const data: Partial<Product> = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      condition: form.condition,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      description: form.description,
      warranty: form.warranty,
      stockStatus: form.stockStatus,
      featured: form.featured,
      images: form.images.filter((i) => !i.uploading).map((i) => ({ url: i.url, alt: i.alt })),
      included: form.included
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      specs,
    };

    await onSave(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-100">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Images */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                Photos du produit
              </label>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <p className="text-sm text-zinc-400">Upload en cours...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImagePlus className="w-8 h-8 text-zinc-500" />
                    <p className="text-sm font-medium text-zinc-400">
                      Glissez-déposez des photos ici
                    </p>
                    <p className="text-xs text-zinc-600">ou cliquez pour sélectionner</p>
                    <p className="text-xs text-zinc-700">JPEG, PNG, WebP · max 5 Mo</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}

              {/* Image previews */}
              {form.images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 group">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className={`object-cover ${img.uploading ? 'opacity-50' : ''}`}
                        sizes="120px"
                      />
                      {img.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                        </div>
                      )}
                      {!img.uploading && (
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Nom du produit *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="HP EliteBook 840 G8"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Marque *
                </label>
                <input
                  required
                  type="text"
                  value={form.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  placeholder="HP, Dell, Lenovo..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Catégorie *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => set('category', e.target.value as ProductCategory)}
                  className="input-field"
                >
                  <option value="">Sélectionner...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  État *
                </label>
                <select
                  required
                  value={form.condition}
                  onChange={(e) => set('condition', e.target.value as ProductCondition)}
                  className="input-field"
                >
                  <option value="">Sélectionner...</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Disponibilité
                </label>
                <select
                  value={form.stockStatus}
                  onChange={(e) => set('stockStatus', e.target.value as StockStatus)}
                  className="input-field"
                >
                  {STOCK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Prix (FCFA) *
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.price || ''}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="225000"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Prix barré (FCFA)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.originalPrice || ''}
                  onChange={(e) => set('originalPrice', e.target.value)}
                  placeholder="280000 (optionnel)"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Garantie
                </label>
                <input
                  type="text"
                  value={form.warranty}
                  onChange={(e) => set('warranty', e.target.value)}
                  placeholder="6 mois pièces et main-d'œuvre"
                  className="input-field"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="text-sm text-zinc-300 cursor-pointer">
                  Mettre en avant sur la page d&apos;accueil
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Description commerciale du produit..."
                className="input-field resize-none"
              />
            </div>

            {/* Specs */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                Caractéristiques techniques
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'processor', label: 'Processeur', placeholder: 'Intel Core i5-1135G7' },
                  { key: 'ram', label: 'RAM', placeholder: '16 Go DDR4' },
                  { key: 'storage', label: 'Stockage', placeholder: '512 Go SSD NVMe' },
                  { key: 'display', label: 'Écran', placeholder: '14" Full HD IPS' },
                  { key: 'graphics', label: 'Carte graphique', placeholder: 'Intel Iris Xe' },
                  { key: 'battery', label: 'Autonomie', placeholder: "Jusqu'à 12h" },
                  { key: 'os', label: 'Système', placeholder: 'Windows 11 Pro' },
                  { key: 'connectivity', label: 'Connectivité', placeholder: 'Wi-Fi 6, USB-C...' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-zinc-600 mb-1">{label}</label>
                    <input
                      type="text"
                      value={(form as Record<string, unknown>)[key] as string}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      className="input-field py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Included items */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                Contenu du pack (un élément par ligne)
              </label>
              <textarea
                rows={3}
                value={form.included}
                onChange={(e) => set('included', e.target.value)}
                placeholder={`Chargeur d'origine HP\nSacoche de transport offerte\nSouris sans fil offerte`}
                className="input-field resize-none text-sm"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 p-6 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 btn-primary justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>{isEdit ? 'Mettre à jour' : 'Ajouter le produit'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
