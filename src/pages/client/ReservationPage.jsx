import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { publicApi, clientApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { getImageUrl } from '../../utils/imageUtils';
import SeatSelector from '../../components/client/SeatSelector.jsx';
import OfferSelector from '../../components/client/OfferSelector.jsx';
import BookingSummary from '../../components/client/BookingSummary.jsx';

export default function ReservationPage() {
    const { seanceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [seance, setSeance] = useState(null);
    const [film, setFilm] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Get dynamic price from seance category (not hardcoded)
    const basePrice = seance?.prixTicket || 0;

    useEffect(() => {
        if (!user) {
            navigate(`/login/client?redirect=${encodeURIComponent(`/reservation/${seanceId}`)}`);
            return;
        }
        fetchReservationData();
    }, [seanceId, user]);

    const fetchReservationData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch seance details
            const seanceRes = await publicApi.getSeanceById(seanceId);
            const seanceData = seanceRes.data;
            console.log("Données séance reçues:", seanceData);
            console.log("Dimensions salle:", seanceData.nombreRangees, "x", seanceData.siegesParRangee);

            // Check if seance is bookable (must be > 4 hours before start)
            const seanceDate = new Date(seanceData.dateHeure);
            const now = new Date();
            const hoursUntilSeance = (seanceDate - now) / (1000 * 60 * 60);

            if (hoursUntilSeance < 3) {
                const seanceTimeStr = seanceDate.toLocaleString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const remainingHours = Math.max(0, hoursUntilSeance).toFixed(1);
                setError(`Cette séance (${seanceTimeStr}) n'est plus disponible à la réservation. Il reste ${remainingHours}h avant le début, mais les réservations doivent être effectuées au moins 3 heures à l'avance.`);
                setLoading(false);
                return;
            }

            setSeance(seanceData);

            // Fetch film details
            const filmRes = await publicApi.getFilmById(seanceData.filmId);
            setFilm(filmRes.data);

            // Fetch occupied seats
            const seatsRes = await publicApi.getReservedSeats(seanceId);
            setOccupiedSeats(seatsRes.data || []);
        } catch (err) {
            console.error('Erreur chargement données:', err);
            setError('Impossible de charger les informations de la séance');
        } finally {
            setLoading(false);
        }
    };

    const handleSeatToggle = (seat) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.rangee === seat.rangee && s.numero === seat.numero);
            if (exists) {
                return prev.filter(s => !(s.rangee === seat.rangee && s.numero === seat.numero));
            } else {
                return [...prev, seat];
            }
        });
    };

    const handleConfirmReservation = async () => {
        if (selectedSeats.length === 0) return;

        setSubmitting(true);
        setError(null);

        try {
            const reservationData = {
                seanceId: parseInt(seanceId),
                nombrePlaces: selectedSeats.length,
                offreId: selectedOffer?.id || null,
                sieges: selectedSeats.map(seat => ({
                    rangee: seat.rangee,
                    numero: seat.numero
                }))
            };

            const response = await clientApi.createReservation(reservationData);

            setSuccess(true);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 2000);
        } catch (err) {
            console.error('Erreur création réservation:', err);
            setError(err.response?.data?.message || 'Erreur lors de la création de la réservation');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Chargement de la séance...</p>
                </div>
            </div>
        );
    }

    if (error && !seance) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="bg-zinc-950 border border-red-600/30 rounded-xl p-8 max-w-md text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Erreur</h2>
                    <p className="text-zinc-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Retour au catalogue
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="bg-zinc-950 border border-green-600/30 rounded-xl p-8 max-w-md text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Réservation confirmée !</h2>
                    <p className="text-zinc-400 mb-6">
                        Votre réservation a été créée avec succès. Vous allez recevoir un email de confirmation.
                    </p>
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-zinc-500 mt-4">Redirection vers votre tableau de bord...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Header with Film Info */}
            <div className="relative h-64 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(film?.afficheUrl)}
                        alt={film?.titre}
                        className="w-full h-full object-cover opacity-30 blur-sm"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/1920x400?text=Cinema';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-end pb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 w-fit"
                    >
                        <ArrowLeft size={20} />
                        Retour
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                        {film?.titre}
                    </h1>
                    <p className="text-zinc-400">
                        {seance && new Date(seance.dateHeure).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Seat Selection & Offers */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Seat Selection */}
                        <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Sélection des sièges
                            </h2>
                            <div className="mb-2 p-2 bg-yellow-900/20 text-yellow-500 text-xs rounded font-mono">
                                DEBUG: Dimensions {seance?.nombreRangees}x{seance?.siegesParRangee} | Occupés: {occupiedSeats.length}
                            </div>
                            <SeatSelector
                                nombreRangees={seance?.nombreRangees || 10}
                                siegesParRangee={seance?.siegesParRangee || 15}
                                occupiedSeats={occupiedSeats}
                                selectedSeats={selectedSeats}
                                onSeatToggle={handleSeatToggle}
                                maxSeats={10}
                            />
                        </section>

                        {/* Offer Selection */}
                        <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Offres disponibles
                            </h2>
                            <OfferSelector
                                nbPersonnes={selectedSeats.length}
                                seanceDate={seance?.dateHeure}
                                seanceId={seance?.id}
                                categorieNom={seance?.categorieNom}
                                selectedOffer={selectedOffer}
                                onOfferSelect={setSelectedOffer}
                                basePrice={basePrice}
                            />
                        </section>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 flex items-start gap-3">
                                <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-red-500 font-semibold mb-1">Erreur</h4>
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <BookingSummary
                            film={film}
                            seance={seance}
                            selectedSeats={selectedSeats}
                            selectedOffer={selectedOffer}
                            basePrice={basePrice}
                            onConfirm={handleConfirmReservation}
                            loading={submitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
