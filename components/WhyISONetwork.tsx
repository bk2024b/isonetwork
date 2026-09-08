import { CheckCircle2, Shield, Truck, MessageCircle } from 'lucide-react';

const REASONS = [
  {
    icon: CheckCircle2,
    title: 'Produits contrôlés',
    description:
      'Chaque appareil passe un contrôle technique en 25 points avant d\'être mis en vente. Aucune mauvaise surprise.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Shield,
    title: 'Garantie incluse',
    description:
      'Tous nos produits sont garantis. En cas de panne, nous prenons en charge la réparation ou l\'échange.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Truck,
    title: 'Livraison à Abidjan',
    description:
      'Nous livrons dans toute la commune d\'Abidjan. Inspection possible avant finalisation de l\'achat.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: MessageCircle,
    title: 'Support WhatsApp 7j/7',
    description:
      'Notre équipe est disponible sur WhatsApp pour répondre à vos questions, vous conseiller et traiter vos commandes rapidement.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

export default function WhyISONetwork() {
  return (
    <section id="about" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">Pourquoi ISO Network ?</h2>
          <p className="section-subtitle mx-auto">
            Notre engagement : vous proposer du matériel fiable, au meilleur prix, avec un service irréprochable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {REASONS.map(({ icon: Icon, title, description, color, bg, border }) => (
            <div key={title} className="card p-6 flex gap-5">
              <div
                className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
