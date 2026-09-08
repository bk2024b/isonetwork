'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, MessageCircle, Monitor } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Portables', href: '/catalogue?category=Ordinateurs+portables' },
  { label: 'Bureaux', href: '/catalogue?category=Ordinateurs+de+bureau' },
  { label: 'Accessoires', href: '/catalogue?category=Accessoires' },
  { label: 'Bureautique', href: '/catalogue?category=Mat%C3%A9riel+bureautique' },
  { label: 'Solutions Pro', href: '#pro' },
  { label: 'À propos', href: '#about' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Monitor className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-zinc-100">
                  ISO <span className="text-emerald-400">Network</span>
                </span>
                <div className="text-xs text-zinc-500 leading-none">Boutique Informatique</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '22500000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400"></span>
                </span>
              </a>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden glass border-t border-zinc-800">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '22500000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 px-4 py-2.5 bg-emerald-500 text-zinc-950 font-semibold rounded-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Contacter sur WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value;
                if (q) {
                  window.location.href = `/catalogue?search=${encodeURIComponent(q)}`;
                }
                setSearchOpen(false);
              }}
              className="flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Rechercher un produit, une marque..."
                className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 outline-none text-lg"
              />
              <kbd className="hidden sm:block px-2 py-1 bg-zinc-800 text-zinc-500 text-xs rounded border border-zinc-700">
                ESC
              </kbd>
            </form>
            <div className="mt-3 pt-3 border-t border-zinc-800 flex flex-wrap gap-2">
              {['HP EliteBook', 'Dell Latitude', 'ThinkPad', 'Imprimante HP', 'Souris Logitech'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    window.location.href = `/catalogue?search=${encodeURIComponent(s)}`;
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-sm rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
