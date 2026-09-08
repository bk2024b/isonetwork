'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Monitor,
  Package,
  TrendingUp,
  AlertTriangle,
  Search,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import ProductFormModal from './ProductFormModal';

interface AdminDashboardProps {
  initialProducts: Product[];
}

export default function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleSave = async (data: Partial<Product>) => {
    setLoading(true);
    try {
      const method = editProduct ? 'PUT' : 'POST';
      const body = editProduct ? { ...data, id: editProduct.id } : data;

      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Erreur');
      const savedProduct = await res.json();

      if (editProduct) {
        setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? savedProduct : p)));
        showToast('Produit mis à jour avec succès');
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
        showToast('Produit ajouté avec succès');
      }
      setFormOpen(false);
      setEditProduct(null);
    } catch {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur');
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Produit supprimé');
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stockStatus === 'En stock').length,
    outOfStock: products.filter((p) => p.stockStatus === 'Rupture de stock').length,
    featured: products.filter((p) => p.featured).length,
  };

  const stockColors = {
    'En stock': 'badge-emerald',
    'Stock limité': 'badge-amber',
    'Rupture de stock': 'badge-red',
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <Monitor className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-zinc-100 text-sm sm:text-base">
                ISO <span className="text-emerald-400">Network</span>
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] sm:text-xs bg-zinc-800 text-zinc-400 font-medium">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Voir le site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total produits', value: stats.total, icon: Package, color: 'text-zinc-400' },
            { label: 'En stock', value: stats.inStock, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Rupture', value: stats.outOfStock, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Mis en avant', value: stats.featured, icon: TrendingUp, color: 'text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="card p-3.5 sm:p-5">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-wider truncate">
                  {stat.label}
                </span>
                <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color} shrink-0`} />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-zinc-100">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit, marque..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>
          <button
            onClick={() => {
              setEditProduct(null);
              setFormOpen(true);
            }}
            className="btn-primary w-full sm:w-auto justify-center text-sm py-2.5 sm:py-3 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </button>
        </div>

        {/* Mobile View: Product Cards (shown on small screens) */}
        <div className="block md:hidden space-y-3">
          {filtered.map((product) => (
            <div key={product.id} className="card p-3.5 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      fill
                      unoptimized={product.images[0].url.startsWith('data:')}
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-zinc-100 text-sm leading-snug line-clamp-2">
                      {product.name}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {product.brand} · <span className="text-zinc-500">{product.category}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-zinc-100">
                      {formatPrice(product.price)}
                    </span>
                    <span className={`badge text-[10px] ${stockColors[product.stockStatus]}`}>
                      {product.stockStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setEditProduct(product);
                    setFormOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                  Modifier
                </button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg border border-zinc-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="card p-8 text-center text-zinc-500 text-sm">
              Aucun produit trouvé
            </div>
          )}
        </div>

        {/* Desktop View: Table (hidden on mobile) */}
        <div className="hidden md:block card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              fill
                              unoptimized={product.images[0].url.startsWith('data:')}
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="w-4 h-4 text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-zinc-200 text-sm truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-400">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-zinc-200">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${stockColors[product.stockStatus]}`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditProduct(product);
                            setFormOpen(true);
                          }}
                          className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-zinc-600 mt-4 text-center">
          {filtered.length} produit{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
        </p>
      </main>

      {/* Product form modal */}
      {formOpen && (
        <ProductFormModal
          product={editProduct}
          onClose={() => {
            setFormOpen(false);
            setEditProduct(null);
          }}
          onSave={handleSave}
          loading={loading}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-semibold text-zinc-100">Supprimer le produit</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              Cette action est irréversible. Le produit sera définitivement supprimé du catalogue.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400'
              : 'bg-zinc-900 border-red-500/30 text-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium text-zinc-200">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
