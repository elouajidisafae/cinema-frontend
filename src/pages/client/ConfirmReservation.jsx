import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientApi } from '../../api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ConfirmReservation() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        confirmReservation();
    }, [code]);

    const confirmReservation = async () => {
        try {
            await clientApi.confirmPresence(code);
            setStatus('success');
            setMessage('Votre présence a été confirmée avec succès !');

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 3000);
        } catch (error) {
            // Extract error message safely
            let errorMessage = 'Erreur lors de la confirmation. La réservation est peut-être déjà confirmée ou annulée.';

            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (data.error) {
                    errorMessage = data.error;
                }
            }

            // Check if it's already confirmed
            if (errorMessage === "Cette réservation est déjà confirmée.") {
                setStatus('already-confirmed');
                setMessage(errorMessage);
            } else {
                setStatus('error');
                setMessage(errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {status === 'loading' && (
                            <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                        )}
                        {status === 'success' && (
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        )}
                        {status === 'already-confirmed' && (
                            <CheckCircle className="w-16 h-16 text-blue-500" />
                        )}
                        {status === 'error' && (
                            <XCircle className="w-16 h-16 text-red-500" />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-black text-white text-center mb-4">
                        {status === 'loading' && 'Confirmation en cours...'}
                        {status === 'success' && 'Confirmation réussie !'}
                        {status === 'already-confirmed' && 'Déjà confirmé !'}
                        {status === 'error' && 'Erreur de confirmation'}
                    </h1>

                    {/* Message */}
                    <div className="text-zinc-400 text-center mb-6">
                        {status === 'loading' && 'Veuillez patienter pendant que nous confirmons votre réservation.'}
                        {status === 'success' && message}
                        {status === 'already-confirmed' && (
                            <div className="space-y-2">
                                <p>{message}</p>
                                <p className="text-sm">Vous pouvez accéder à votre ticket dans votre tableau de bord.</p>
                            </div>
                        )}
                        {status === 'error' && message}
                    </div>

                    {/* Code */}
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Code de réservation</p>
                        <p className="text-lg font-bold text-white font-mono">{code}</p>
                    </div>

                    {/* Actions */}
                    {(status === 'success' || status === 'already-confirmed') && (
                        <div className="text-center">
                            {status === 'success' && (
                                <p className="text-sm text-zinc-500 mb-4">
                                    Redirection vers votre tableau de bord dans 3 secondes...
                                </p>
                            )}
                            <button
                                onClick={() => navigate('/client/dashboard')}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all"
                            >
                                Accéder au tableau de bord
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/client/dashboard')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full transition-all"
                            >
                                Retour
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
