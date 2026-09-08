'use client';

import { useState } from 'react';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import QuoteModal from './QuoteModal';

const FEATURES = [
  'Ordinateurs et serveurs d\'entreprise',
  'Équipement de parcs informatiques entiers',
  'Imprimantes et scanners multifonctions',
  'Onduleurs et protection électrique',
  'Maintenance et support technique',
  'Renouvellement de parc informatique',
];

export default function ProSection() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section id="pro" className="py-24 bg-zinc-900/40 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 mb-6">
                <Building2 className="w-3.5 h-3.5" />
                Solutions Professionnelles
              </span>
              
              <h2 className="section-title mb-4">
                Équipez votre
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  entreprise.
                </span>
              </h2>
              
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Ordinateurs, équipements bureautiques et accessoires pour vos besoins professionnels. Nous accompagnons PME, écoles, cabinets et startups dans leur équipement informatique.
              </p>

              <ul className="space-y-3 mb-10">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setQuoteOpen(true)}
                className="btn-primary bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 text-base px-8 py-4"
              >
                Demander un devis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl" />
              <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8">
                <div className="space-y-4">
                  {[
                    { label: 'Cabinet comptable', qty: '12 postes', status: 'Livré' },
                    { label: 'École informatique', qty: '30 ordinateurs', status: 'En cours' },
                    { label: 'Start-up tech', qty: '8 laptops premium', status: 'Devis envoyé' },
                    { label: 'Clinique médicale', qty: '6 all-in-one', status: 'Livré' },
                  ].map((order, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/50"
                    >
                      <div>
                        <p className="font-medium text-zinc-200 text-sm">{order.label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{order.qty}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Livré'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : order.status === 'En cours'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-blue-500/15 text-blue-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-zinc-600 mt-6">
                  Exemples de commandes professionnelles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
    </>
  );
}
