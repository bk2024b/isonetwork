import Link from 'next/link';
import { Monitor, MessageCircle, MapPin, Phone, Clock, Mail } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Ordinateurs portables', href: '/catalogue?category=Ordinateurs+portables' },
  { label: 'Ordinateurs de bureau', href: '/catalogue?category=Ordinateurs+de+bureau' },
  { label: 'Accessoires', href: '/catalogue?category=Accessoires' },
  { label: 'Matériel bureautique', href: '/catalogue?category=Mat%C3%A9riel+bureautique' },
  { label: 'Solutions Pro', href: '/#pro' },
  { label: 'Contact', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Monitor className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-lg text-zinc-100">
                  ISO <span className="text-emerald-400">Network</span>
                </span>
              </div>
            </Link>
            <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
              Votre boutique informatique de confiance à Abidjan. Ordinateurs, accessoires et matériel bureautique sélectionnés pour les particuliers et professionnels.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '22500000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@iso-network.ci"
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-zinc-100 mb-5">Catalogue</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-zinc-100 mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-400">
                  Abidjan, Côte d&apos;Ivoire<br />
                  Cocody, Angré
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="tel:+22500000000"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  +225 00 00 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '22500000000'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  WhatsApp disponible
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-zinc-100 mb-5">Horaires</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-sm text-zinc-400">
                  <div className="font-medium text-zinc-300">Lun — Ven</div>
                  <div>8h00 — 18h00</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
                <div className="text-sm text-zinc-400">
                  <div className="font-medium text-zinc-300">Samedi</div>
                  <div>9h00 — 16h00</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-zinc-700 mt-0.5 shrink-0" />
                <div className="text-sm text-zinc-500">
                  <div className="font-medium">Dimanche</div>
                  <div>Fermé</div>
                </div>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-emerald-400">WhatsApp actif 7j/7</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} ISO Network. Tous droits réservés.
          </p>
          <p className="text-sm text-zinc-600">
            Boutique informatique · Abidjan, Côte d&apos;Ivoire
          </p>
        </div>
      </div>
    </footer>
  );
}
