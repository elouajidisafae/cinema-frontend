import { useState, useEffect } from "react";
import { publicApi } from "../../api";
import { Tag, ShieldCheck, AlertCircle, Calendar, Clock, ArrowRight, Ticket, TrendingDown, Sparkles, Gift, Users, ChevronDown, Filter } from "lucide-react";
import { SkeletonOfferCard } from "../../components/ui/SkeletonCard";
import toast from 'react-hot-toast';

export default function Offres() {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [filmsPerMonth, setFilmsPerMonth] = useState(4);
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { id: 'all', name: 'Toutes', icon: '🎬' },
        { id: 'student', name: 'Étudiants', icon: '👨‍🎓' },
        { id: 'family', name: 'Familles', icon: '👨‍👩‍👧‍👦' },
        { id: 'senior', name: 'Seniors', icon: '👴' },
        { id: 'unlimited', name: 'Illimité', icon: '🎟️' },
    ];

    const staticOffres = [
        {
            id: 'static-senior',
            titre: "Pass Senior Gold",
            description: "Une expérience cinéma privilégiée pour nos aînés (+60 ans). Accueil personnalisé, accès prioritaire et confort optimal à chaque séance.",
            prix: 45,
            prixNormal: 60,
            dateFin: "2026-12-31",
            categorie: 'senior'
        },
        {
            id: 'static-unlimited',
            titre: "Carte CINÉMANA Illimitée",
            description: "Le Graal du cinéphile. Films à volonté 7j/7, -20% sur la confiserie, invitations aux avant-premières et 1 place offerte par mois pour un proche.",
            prix: 299,
            prixNormal: 800,
            dateFin: "2026-12-31",
            categorie: 'unlimited'
        }
    ];

    const faqs = [
        {
            question: "Comment utiliser une offre étudiant ?",
            answer: "Présentez votre carte d'étudiant valide à la caisse ou lors de la réservation en ligne. L'offre est valable tous les jours."
        },
        {
            question: "La carte illimitée est-elle vraiment illimitée ?",
            answer: "Oui ! Avec la carte illimitée, vous pouvez voir autant de films que vous le souhaitez, tous les jours, sans restriction."
        },
        {
            question: "Puis-je cumuler plusieurs offres ?",
            answer: "Non, les offres ne sont pas cumulables. Vous bénéficiez automatiquement de la meilleure réduction disponible."
        },
        {
            question: "Comment obtenir ma réduction confiserie ?",
            answer: "Présentez votre billet ou votre carte illimitée au bar à confiserie pour bénéficier de votre réduction."
        }
    ];

    useEffect(() => {
        const fetchOffres = async () => {
            try {
                const res = await publicApi.getOffres();
                setOffres(res.data);
            } catch (err) {
                console.error("Erreur chargement offres", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffres();
    }, []);

    const allOffres = [...offres, ...staticOffres];

    const filteredOffres = activeCategory === 'all'
        ? allOffres
        : allOffres.filter(offre => {
            const title = offre.titre.toLowerCase();
            const cat = (offre.categorie || '').toLowerCase();
            if (cat === activeCategory) return true;

            switch (activeCategory) {
                case 'student': return title.includes('étudiant');
                case 'family': return title.includes('famille') || title.includes('pack');
                case 'senior': return title.includes('senior') || cat === 'senior';
                case 'unlimited': return title.includes('illimité') || title.includes('carte') || cat === 'unlimited';
                default: return true;
            }
        });

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const savings = Math.max(0, filmsPerMonth * 80 - 299);

    return (
        <div className="bg-black min-h-screen font-sans selection:bg-red-600 selection:text-white pb-20">

            {/* HERO SECTION - Enhanced */}
            <div className="relative h-[60vh] w-full overflow-hidden flex items-center mb-16">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
                        alt="Cinema Experience"
                        className="w-full h-full object-cover object-center opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10 w-full h-full flex flex-col justify-center">
                    <div className="max-w-3xl animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md mb-6 inline-block shadow-lg shadow-red-900/40">
                            Offres Spéciales
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                            Profitez de nos <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Offres</span>
                        </h1>

                        <p className="text-zinc-200 text-base md:text-lg mb-8 line-clamp-3 leading-relaxed drop-shadow-md font-light">
                            Réductions étudiants, packs famille, carte illimitée... Trouvez l'offre qui vous correspond et profitez du cinéma à prix réduit.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">

                {/* CATEGORY FILTERS */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Filter className="text-red-500" size={24} />
                        <h2 className="text-2xl font-black text-white">Filtrer par catégorie</h2>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeCategory === cat.id
                                    ? 'bg-red-600 text-white scale-105'
                                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PRICING TABLE SECTION */}
                <div className="mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingDown className="text-red-500" size={28} />
                        <h2 className="text-3xl font-black text-white">Grille des Tarifs</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">Standard</h3>
                                    <p className="text-zinc-500 text-xs">Séance classique 2D</p>
                                </div>
                                <span className="text-2xl font-black text-white">50 <span className="text-xs text-zinc-500">DH</span></span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-red-600"></div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-red-600/20 rounded-2xl p-6 hover:border-red-600/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg text-white">POPULAIRE</div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">VIP</h3>
                                    <p className="text-zinc-500 text-xs">Salle premium avec service à table</p>
                                </div>
                                <span className="text-2xl font-black text-white">100 <span className="text-xs text-zinc-500">DH</span></span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-red-600"></div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">3D</h3>
                                    <p className="text-zinc-500 text-xs">Expérience immersive 3D</p>
                                </div>
                                <span className="text-2xl font-black text-white">70 <span className="text-xs text-zinc-500">DH</span></span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-red-600"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OFFERS GRID */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                        <h2 className="text-3xl font-black text-white">
                            {activeCategory === 'all' ? 'Toutes nos offres' : `Offres ${categories.find(c => c.id === activeCategory)?.name}`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonOfferCard key={i} />
                            ))}
                        </div>
                    ) : filteredOffres.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredOffres.map((offre, index) => {
                                const standardPrice = offre.prixNormal || 80;
                                const savings = standardPrice - offre.prix;

                                return (
                                    <div
                                        key={offre.id}
                                        className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-900/20 animate-in fade-in slide-in-from-bottom-4"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="h-32 bg-gradient-to-br from-red-900/20 to-black p-6 relative overflow-hidden">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/40 transition-all duration-500"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="relative z-10 flex justify-between items-start">
                                                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    SPÉCIAL
                                                </div>
                                                <Ticket className="text-red-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" size={32} />
                                            </div>
                                        </div>

                                        <div className="p-6 pt-2">
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-red-500 transition-colors">{offre.titre}</h3>
                                                <div className="h-1 w-12 bg-red-600/30 rounded-full group-hover:w-24 transition-all duration-500"></div>
                                            </div>

                                            <p className="text-zinc-400 text-sm leading-relaxed mb-4 h-20 line-clamp-3">
                                                {offre.description}
                                            </p>

                                            {savings > 0 && (
                                                <div className="flex items-center gap-2 mb-4 text-green-500 font-bold text-sm">
                                                    <TrendingDown size={16} className="animate-bounce" />
                                                    <span>Économisez {savings} DH</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-auto mb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Prix</span>
                                                    <div className="flex items-baseline gap-2">
                                                        {savings > 0 && (
                                                            <span className="text-sm text-zinc-600 line-through">{standardPrice} DH</span>
                                                        )}
                                                        <span className="text-2xl font-black text-white">{offre.prix} DH</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                                                        <Calendar size={12} className="text-red-500" />
                                                        Validité
                                                    </div>
                                                    <span className="text-xs font-medium text-zinc-300 bg-zinc-800 px-2 py-1 rounded border border-white/5">
                                                        {new Date(offre.dateFin).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    toast.success(`Offre "${offre.titre}" ajoutée ! Réservez maintenant.`, {
                                                        icon: '🎉',
                                                        duration: 3000,
                                                    });
                                                }}
                                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 flex items-center justify-center gap-2 group/btn"
                                            >
                                                <Sparkles size={18} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                                                Utiliser cette offre
                                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-zinc-900/50 p-12 rounded-2xl border border-dashed border-white/10 text-center text-zinc-500">
                            Aucune offre disponible dans cette catégorie.
                        </div>
                    )}
                </div>

                {/* SAVINGS CALCULATOR */}
                <div className="mb-16">
                    <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-900/30 rounded-2xl p-8 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-black text-white mb-6 text-center">
                            💰 Calculez vos économies
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-zinc-400 text-sm mb-2 block">
                                    Combien de films regardez-vous par mois ?
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={filmsPerMonth}
                                    onChange={(e) => setFilmsPerMonth(e.target.value)}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                                />
                                <div className="text-white text-3xl font-bold mt-2 text-center">
                                    {filmsPerMonth} film{filmsPerMonth > 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="bg-black/50 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-zinc-400">Sans carte illimitée</span>
                                    <span className="text-white font-bold">{filmsPerMonth * 80} DH</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-zinc-400">Avec carte illimitée</span>
                                    <span className="text-white font-bold">299 DH</span>
                                </div>
                                <div className="border-t border-zinc-800 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-500 font-bold text-xl">Économie mensuelle</span>
                                        <span className="text-green-500 font-black text-3xl">
                                            {savings} DH
                                        </span>
                                    </div>
                                    {savings > 0 && (
                                        <p className="text-zinc-500 text-sm mt-2 text-center">
                                            Soit {(savings * 12).toLocaleString()} DH économisés par an !
                                        </p>
                                    )}
                                </div>
                            </div>

                            {savings > 0 && (
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105">
                                    Souscrire à la carte illimitée
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* EXCLUSIVE BENEFITS */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                        <h2 className="text-3xl font-black text-white">Avantages Exclusifs</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900 rounded-2xl p-8 text-center group hover:bg-zinc-800 transition-all hover:scale-105">
                            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-all">
                                <Gift className="text-red-500 group-hover:text-white transition-colors" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Points de fidélité</h3>
                            <p className="text-zinc-400 text-sm">
                                Gagnez 10 points par séance et échangez-les contre des récompenses
                            </p>
                        </div>

                        <div className="bg-zinc-900 rounded-2xl p-8 text-center group hover:bg-zinc-800 transition-all hover:scale-105">
                            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-all">
                                <Calendar className="text-red-500 group-hover:text-white transition-colors" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Avant-premières</h3>
                            <p className="text-zinc-400 text-sm">
                                Accès prioritaire aux avant-premières et événements spéciaux
                            </p>
                        </div>

                        <div className="bg-zinc-900 rounded-2xl p-8 text-center group hover:bg-zinc-800 transition-all hover:scale-105">
                            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-all">
                                <Users className="text-red-500 group-hover:text-white transition-colors" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Parrainage</h3>
                            <p className="text-zinc-400 text-sm">
                                Parrainez un ami et recevez tous les deux une séance gratuite
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                        <h2 className="text-3xl font-black text-white">Questions fréquentes</h2>
                    </div>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600/30 transition-all"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-6 text-left flex justify-between items-center group"
                                >
                                    <span className="font-bold text-white group-hover:text-red-500 transition-colors">{faq.question}</span>
                                    <ChevronDown
                                        className={`text-red-500 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                        }`}
                                        size={20}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6 text-zinc-400 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIDEBAR - Policies */}
                <div className="max-w-md mx-auto">
                    <div className="bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>

                        <div className="space-y-8 relative z-10">
                            {/* Booking Rules */}
                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
                                    <Calendar size={20} className="text-red-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-red-500 transition-colors">Règles de Réservation</h3>
                                    <ul className="text-zinc-500 text-sm leading-relaxed space-y-1">
                                        <li>• Réservation jusqu'à 30 min avant la séance</li>
                                        <li>• Places numérotées garanties</li>
                                        <li>• Confirmation par email/SMS</li>
                                        <li>• Présentation du billet obligatoire</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
                                    <Ticket size={20} className="text-red-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-red-500 transition-colors">Billets & Remboursements</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">
                                        Ni échangeables ni remboursables, sauf annulation séance.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
                                    <AlertCircle size={20} className="text-red-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-red-500 transition-colors">Comportement</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">
                                        Silence requis. Téléphones éteints. Respectez les autres spectateurs.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
                                    <ShieldCheck size={20} className="text-red-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-red-500 transition-colors">Nourriture</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">
                                        Nourriture extérieure interdite. Profitez de notre bar à confiserie.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-red-400 text-xs font-medium bg-red-900/10 py-3 rounded-lg border border-red-900/20">
                                Service Client disponible 7j/7
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
