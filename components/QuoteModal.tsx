'use client';

import { useState } from 'react';
import { X, MessageCircle, Building2, User, Phone, Package } from 'lucide-react';
import { buildQuoteWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/utils';

interface QuoteModalProps {
  onClose: () => void;
}

const PRODUCT_TYPES = [
  'Ordinateurs portables',
  'Ordinateurs de bureau',
  'Accessoires bureautiques',
  'Imprimantes & Scanners',
  'Onduleurs & Parafoudres',
  'Pack complet (matériel + accessoires)',
];

export default function QuoteModal({ onClose }: QuoteModalProps) {
  const [form, setForm] = useState({
    company: '',
    name: '',
    phone: '',
    productType: '',
    quantity: 1,
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildQuoteWhatsAppLink(
      WHATSAPP_NUMBER,
      form.company,
      form.quantity,
      form.productType || 'Matériel informatique',
      form.name,
      form.phone
    );
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Solutions Professionnelles
            </span>
            <h2 className="text-2xl font-bold text-zinc-100">Demande de devis</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Remplissez le formulaire. Nous vous enverrons une offre personnalisée sous 24h.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  <Building2 className="inline w-3.5 h-3.5 mr-1" />
                  Entreprise / Organisation *
                </label>
                <input
                  required
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="SARL Exemple"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  <User className="inline w-3.5 h-3.5 mr-1" />
                  Votre nom *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jean Kouakou"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                <Phone className="inline w-3.5 h-3.5 mr-1" />
                Numéro WhatsApp *
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+225 07 00 00 00 00"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                <Package className="inline w-3.5 h-3.5 mr-1" />
                Type de matériel *
              </label>
              <select
                required
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
                className="input-field"
              >
                <option value="">Sélectionner...</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                Quantité de postes
              </label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-5 h-5" />
              Envoyer la demande sur WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
