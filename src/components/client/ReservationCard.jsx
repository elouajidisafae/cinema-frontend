import { Download, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { clientApi } from '../../api';

export default function ReservationCard({ reservation }) {
    const handleDownloadTicket = async () => {
        try {
            const response = await clientApi.downloadTicket(reservation.codeReservation);

            // Create blob and download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ticket-${reservation.codeReservation}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur téléchargement ticket:', error);
            alert('Erreur lors du téléchargement du ticket');
        }
    };

    const getStatusBadge = (statut) => {
        const badges = {
            VALIDEE: {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-500',
                border: 'border-emerald-500/20',
                icon: <CheckCircle size={14} className="animate-pulse" />,
                label: 'Validée'
            },
            EN_ATTENTE: {
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                border: 'border-amber-500/20',
                icon: <AlertCircle size={14} className="animate-pulse" />,
                label: 'En attente'
            },
            ANNULEE: {
                bg: 'bg-red-500/10',
                text: 'text-red-500',
                border: 'border-red-500/20',
                icon: <XCircle size={14} />,
                label: 'Annulée'
            }
        };

        const config = badges[statut] || {
            bg: 'bg-zinc-800',
            text: 'text-zinc-400',
            border: 'border-zinc-700',
            icon: null,
            label: statut
        };

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} border ${config.border} shadow-sm backdrop-blur-md`}>
                {config.icon}
                <span className="text-[10px] font-black uppercase tracking-wider">{config.label}</span>
            </div>
        );
    };

    const isPastSeance = new Date(reservation.seanceDateHeure) < new Date();

    return (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:bg-zinc-900/60 hover:border-zinc-700 transition-all group relative">
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex flex-col md:flex-row relative z-10">
                {/* Poster Container - Much wider for a more immersive feel */}
                <div className="hidden md:block w-72 flex-shrink-0 relative overflow-hidden bg-black border-r border-zinc-800/50">
                    {/* Actual Poster Image - Full size now */}
                    <img
                        src={getImageUrl(reservation.filmAfficheUrl)}
                        alt={reservation.filmTitre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x400?text=Film';
                        }}
                    />
                    {/* Gradient overlay to help text readability on the side and create depth */}
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-900 to-transparent z-20"></div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-white mb-2 leading-tight tracking-tighter group-hover:text-red-500 transition-colors duration-300">
                                    {reservation.filmTitre}
                                </h3>
                                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-950/50 border border-zinc-800 text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
                                    ID: {reservation.codeReservation?.split('-')[0]}...
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                {getStatusBadge(reservation.statut)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/30">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-red-500">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-200">
                                    {new Date(reservation.seanceDateHeure).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-red-500">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Heure</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-200">
                                    {new Date(reservation.seanceDateHeure).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-red-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Salle</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-200">{reservation.salleNom}</p>
                            </div>
                        </div>

                        {/* Seats with improved design */}
                        {reservation.sieges && reservation.sieges.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-4 h-px bg-zinc-800"></div>
                                        {reservation.sieges.length} Siège{reservation.sieges.length > 1 ? 's' : ''} Sélectionné{reservation.sieges.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {reservation.sieges.map((siege, idx) => (
                                        <div
                                            key={idx}
                                            className="min-w-[40px] h-10 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg group/seat hover:border-red-600/50 transition-colors"
                                        >
                                            <span className="text-[10px] text-zinc-600 font-bold group-hover/seat:text-red-500 transition-colors uppercase">Rang {String.fromCharCode(64 + siege.rangee)}</span>
                                            <span className="text-sm font-black text-white">{siege.numero}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Total à payer</span>
                            <div className="text-3xl font-black text-white tracking-tighter">
                                {reservation.montantTotal?.toFixed(2)}<span className="text-red-600 ml-1 text-sm uppercase tracking-normal">DH</span>
                            </div>
                        </div>

                        {(reservation.statut === 'VALIDEE' || reservation.statut === 'EN_ATTENTE' || reservation.statut === 'CONFIRMEE_CLIENT') && !isPastSeance && (
                            <button
                                onClick={handleDownloadTicket}
                                className="group/btn flex items-center gap-3 bg-white hover:bg-red-600 text-black hover:text-white px-6 py-3 rounded-xl font-black transition-all duration-300 shadow-xl hover:shadow-red-600/20 active:scale-95 translate-y-0 hover:-translate-y-1"
                            >
                                <Download size={18} className="group-hover/btn:scale-110 transition-transform" />
                                <span className="text-sm uppercase tracking-tight">Télécharger Ticket</span>
                            </button>
                        )}

                        {isPastSeance && (
                            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 text-xs text-zinc-500 font-bold uppercase tracking-widest italic">
                                Séance passée
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
