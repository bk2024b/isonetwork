import { Product } from '@/types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export function buildWhatsAppLink(product: Product, phoneNumber: string = '22500000000'): string {
  const specLines = [];
  if (product.specs.processor) specLines.push(`• Processeur : ${product.specs.processor}`);
  if (product.specs.ram) specLines.push(`• RAM : ${product.specs.ram}`);
  if (product.specs.storage) specLines.push(`• Stockage : ${product.specs.storage}`);
  if (product.specs.display) specLines.push(`• Écran : ${product.specs.display}`);

  const message = `Bonjour ISO Network 👋

Je suis intéressé(e) par le produit suivant :

📦 *${product.name}*
${specLines.join('\n')}
💰 Prix : *${formatPrice(product.price)}*
🔖 État : ${product.condition}

Pourriez-vous me confirmer la disponibilité et me donner plus d'informations ?

Merci !`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildQuoteWhatsAppLink(
  phoneNumber: string = '22500000000',
  company: string,
  quantity: number,
  productType: string,
  name: string,
  contactPhone: string
): string {
  const message = `Bonjour ISO Network 👋

Je souhaite obtenir un devis pour équiper mon entreprise :

🏢 *Entreprise/Organisation :* ${company}
👤 *Contact :* ${name}
📞 *Téléphone :* ${contactPhone}
💻 *Type de matériel :* ${productType}
📦 *Quantité souhaitée :* ${quantity} poste(s)

Merci de me faire parvenir une offre personnalisée.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '22500000000';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'isonetwork2024';
