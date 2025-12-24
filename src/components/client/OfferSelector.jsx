import { useState, useEffect } from 'react';
import { Tag, Percent, Users, Calendar } from 'lucide-react';

export default function OfferSelector({
                                          nbPersonnes,
                                          seanceDate,
                                          seanceId,
                                          categorieNom,
                                          selectedOffer,
                                          onOfferSelect,
                                          basePrice = 10
                                      }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (nbPersonnes > 0) {
            fetchOffers();
        }
    }, [nbPersonnes, seanceDate, seanceId, categorieNom]);

    const fetchOffers = async () => {
        // Only fetch offers if category is Standard
        if (categorieNom && categorieNom.toLowerCase() !== 'standard') {
            setOffers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { publicApi } = await import('../../api');
            const response = await publicApi.getApplicableOffers(nbPersonnes, seanceDate, seanceId);
            setOffers(response.data || []);
        } catch (error) {
            console.error('Erreur chargement offres:', error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateFinalPrice = (offer) => {
        if (!offer || !offer.prix) {
            return basePrice * nbPersonnes;
        }
        // offer.prix is the price per person with the offer applied
        return offer.prix * nbPersonnes;
    };

    const calculateDiscount = (offer) => {
        if (!offer || !offer.prix) return 0;
        const normalTotal = basePrice * nbPersonnes;
        const offerTotal = offer.prix * nbPersonnes;
        return Math.max(0, normalTotal - offerTotal);
    };

    if (nbPersonnes === 0) {
        return (
            <div className="text-center py-8 text-zinc-500">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Sélectionnez des sièges pour voir les offres disponibles</p>
            </div>
        );
    }

    // Show message if not Standard category
    if (categorieNom && categorieNom.toLowerCase() !== 'standard') {
        return (
            <div className="text-center py-8 text-zinc-500 bg-zinc-950 border border-zinc-800 rounded-xl">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="mb-2">Les offres sont uniquement disponibles pour la catégorie Standard</p>
                <p className="text-sm text-zinc-600">Catégorie actuelle : <span className="text-red-500 font-semibold">{categorieNom}</span></p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* No Offer Option */}
            <button
                onClick={() => onOfferSelect(null)}
                className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${!selectedOffer
                    ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }
                `}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white mb-1">Sans offre</h4>
                        <p className="text-sm text-zinc-400">Tarif normal</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                            {(basePrice * nbPersonnes).toFixed(2)} DH
                        </div>
                        <div className="text-xs text-zinc-500">
                            {basePrice} DH × {nbPersonnes}
                        </div>
                    </div>
                </div>
            </button>

            {/* Available Offers */}
            {offers.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <Tag className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Aucune offre disponible pour cette sélection</p>
                </div>
            ) : (
                offers.map((offer) => {
                    const isSelected = selectedOffer?.id === offer.id;
                    const discount = calculateDiscount(offer);
                    const finalPrice = calculateFinalPrice(offer);
                    const savings = (basePrice * nbPersonnes) - finalPrice;

                    return (
                        <button
                            key={offer.id}
                            onClick={() => onOfferSelect(offer)}
                            className={`
                                w-full p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden
                                ${isSelected
                                ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                                : 'bg-zinc-950 border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900'
                            }
                            `}
                        >
                            {/* Badge if selected */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    SÉLECTIONNÉ
                                </div>
                            )}

                            <div className="mb-3">
                                <div className="flex items-start gap-2 mb-2">
                                    <Percent className="text-red-500 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{offer.nom}</h4>
                                        {offer.description && (
                                            <p className="text-sm text-zinc-400 mt-1">{offer.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Offer Details */}
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-zinc-500">
                                    {offer.nbPersonnesMin && (
                                        <div className="flex items-center gap-1">
                                            <Users size={14} />
                                            <span>Min. {offer.nbPersonnesMin} pers.</span>
                                        </div>
                                    )}
                                    {offer.dateDebut && offer.dateFin && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>
                                                Valide jusqu'au {new Date(offer.dateFin).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-end justify-between pt-3 border-t border-zinc-800">
                                <div>
                                    <div className="text-xs text-zinc-500 mb-1">Prix final</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-red-500">
                                            {finalPrice.toFixed(2)} DH
                                        </span>
                                        <span className="text-sm text-zinc-500 line-through">
                                            {(basePrice * nbPersonnes).toFixed(2)} DH
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-600/30">
                                        -{savings.toFixed(2)} DH
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        Prix offre: {offer.prix} DH/pers
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })
            )}
        </div>
    );
}
