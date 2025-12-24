import { Ticket, MapPin, Clock, Calendar, Tag } from 'lucide-react';

export default function BookingSummary({
                                           film,
                                           seance,
                                           selectedSeats = [],
                                           selectedOffer,
                                           basePrice = 10,
                                           onConfirm,
                                           loading = false
                                       }) {
    const calculateTotal = () => {
        if (!selectedOffer || !selectedOffer.prix) {
            return basePrice * selectedSeats.length;
        }
        // offer.prix is the price per person with the offer applied
        return selectedOffer.prix * selectedSeats.length;
    };

    const total = calculateTotal();
    const subtotal = basePrice * selectedSeats.length;
    const discount = subtotal - total;

    if (!film || !seance) {
        return (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500">
                Chargement...
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 border border-red-900/30 rounded-xl overflow-hidden sticky top-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Ticket size={20} />
                    Récapitulatif
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {/* Film Info */}
                <div>
                    <h4 className="text-white font-bold text-xl mb-3">{film.titre}</h4>
                    <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-red-500" />
                            <span>
                                {new Date(seance.dateHeure).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-red-500" />
                            <span>
                                {new Date(seance.dateHeure).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-red-500" />
                            <span>{seance.salleNom || 'Salle'}</span>
                        </div>
                    </div>
                </div>

                {/* Selected Seats */}
                {selectedSeats.length > 0 && (
                    <div className="border-t border-zinc-800 pt-4">
                        <h5 className="text-white font-semibold mb-2 text-sm">
                            Sièges sélectionnés ({selectedSeats.length})
                        </h5>
                        <div className="flex flex-wrap gap-2">
                            {selectedSeats.map((seat, idx) => (
                                <span
                                    key={idx}
                                    className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-600/30"
                                >
                                    {String.fromCharCode(64 + seat.rangee)}{seat.numero}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Offer */}
                {selectedOffer && (
                    <div className="border-t border-zinc-800 pt-4">
                        <h5 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                            <Tag size={16} className="text-green-500" />
                            Offre appliquée
                        </h5>
                        <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                            <div className="text-green-400 font-medium">{selectedOffer.titre}</div>
                            <div className="text-xs text-zinc-400 mt-1">
                                Prix offre: {selectedOffer.prix} DH/pers
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Breakdown */}
                <div className="border-t border-zinc-800 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-zinc-400">
                        <span>Sous-total ({selectedSeats.length} × {basePrice} DH)</span>
                        <span>{subtotal.toFixed(2)} DH</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-400">
                            <span>Réduction</span>
                            <span>-{discount.toFixed(2)} DH</span>
                        </div>
                    )}

                    <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-zinc-800">
                        <span>Total</span>
                        <span className="text-red-500">{total.toFixed(2)} DH</span>
                    </div>
                </div>

                {/* Confirm Button */}
                <button
                    onClick={onConfirm}
                    disabled={selectedSeats.length === 0 || loading}
                    className={`
                        w-full py-4 rounded-xl font-bold text-white transition-all
                        ${selectedSeats.length === 0 || loading
                        ? 'bg-zinc-800 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02]'
                    }
                    `}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Confirmation...
                        </div>
                    ) : (
                        'Confirmer la réservation'
                    )}
                </button>

                {selectedSeats.length === 0 && (
                    <p className="text-center text-xs text-zinc-500">
                        Sélectionnez au moins un siège pour continuer
                    </p>
                )}
            </div>
        </div>
    );
}
