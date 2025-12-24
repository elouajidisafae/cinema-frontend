import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { CheckCircle2, XCircle, AlertTriangle, Info, ScanLine, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const API_URL = "http://localhost:8080/api/caissier";

export default function ScannerPage() {
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const scannerRef = useRef(null);
    const isLockedRef = useRef(false);

    useEffect(() => {
        let scanner = null;
        const timeoutId = setTimeout(() => {
            const element = document.getElementById('qr-reader');
            if (element) {
                scanner = new Html5QrcodeScanner('qr-reader', {
                    qrbox: { width: 250, height: 250 },
                    fps: 10
                });
                scanner.render(onScanSuccess, onScanError);
                scannerRef.current = scanner;
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (scanner) {
                try {
                    scanner.clear();
                } catch (e) { }
            }
        };
    }, []);

    const onScanSuccess = (decodedText) => {
        if (isLockedRef.current) return;
        isLockedRef.current = true;
        handleVerification(decodedText);
    };

    const onScanError = (err) => { };

    // Helper to strip emojis from messages
    const cleanMessage = (msg) => {
        if (!msg) return '';
        return msg.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
    };

    const handleVerification = async (code) => {
        setLoading(true);
        setVerificationResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${API_URL}/verifier`,
                { code },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setVerificationResult(res.data);
            playSound(res.data.success);

        } catch (err) {
            const errorData = err.response?.data || {};
            setVerificationResult({
                success: false,
                canValidate: false,
                message: errorData.message || 'Erreur de vérification',
                ...errorData
            });
            playSound(false);
        } finally {
            setLoading(false);
        }
    };

    const handleManualVerification = () => {
        if (manualCode.trim()) {
            handleVerification(manualCode.trim());
        }
    };

    const handleValidation = async () => {
        if (!verificationResult || !verificationResult.reservationId) return;

        setValidating(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/valider/${verificationResult.reservationId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setVerificationResult(prev => ({
                ...prev,
                validated: true,
                finalMessage: 'Entrée validée avec succès'
            }));

            playSound(true);

            setTimeout(() => {
                handleReset();
            }, 3000);

        } catch (err) {
            toast.error('Erreur lors de la validation : ' +
                (err.response?.data?.message || 'Erreur inconnue'));
        } finally {
            setValidating(false);
        }
    };

    const handleCancellation = async () => {
        setCancelling(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/annuler/${verificationResult.reservationId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setVerificationResult(prev => ({
                ...prev,
                validated: true,
                cancelled: true,
                finalMessage: 'Réservation annulée'
            }));

            toast.success('Réservation annulée avec succès');

            setTimeout(() => {
                handleReset();
            }, 3000);

        } catch (err) {
            toast.error('Erreur lors de l\'annulation : ' +
                (err.response?.data?.message || 'Erreur inconnue'));
        } finally {
            setCancelling(false);
            setShowConfirmCancel(false);
        }
    };

    const handleReset = () => {
        setVerificationResult(null);
        setManualCode('');
        isLockedRef.current = false;
    };

    const playSound = (success) => {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gain = context.createGain();

            // Success: bip aigu et court | Error: bip grave et un peu plus long
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(success ? 880 : 220, context.currentTime);

            gain.gain.setValueAtTime(0, context.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + (success ? 0.2 : 0.4));

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + (success ? 0.2 : 0.4));
        } catch (e) {
            console.error("Audio feedback error:", e);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Scanner QR Code</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Scanner */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <ScanLine className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Caméra</h2>
                    </div>

                    <div id="qr-reader" className="overflow-hidden rounded-2xl mb-6 bg-black border border-zinc-800 shadow-inner"></div>

                    <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800/50">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Saisie manuelle</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Code réservation..."
                                className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                            />
                            <button
                                onClick={handleManualVerification}
                                disabled={loading || !manualCode}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Result */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-semibold text-white mb-6">Détails Réservation</h2>

                        {!verificationResult && !loading && (
                            <div className="h-80 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
                                <ScanLine className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-medium">En attente de scan...</p>
                            </div>
                        )}

                        {loading && (
                            <div className="h-80 flex flex-col items-center justify-center text-red-500">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="font-medium text-white">Vérification en cours...</p>
                            </div>
                        )}

                        {verificationResult && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* STATUS ALERT */}
                                <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all duration-300 ${verificationResult.cancelled
                                    ? 'bg-red-500/10 border-red-500/20'
                                    : verificationResult.validated
                                        ? 'bg-white/5 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                        : verificationResult.success
                                            ? 'bg-white/5 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                            : 'bg-red-500/10 border-red-500/20'
                                }`}>

                                    <div className={`p-2 rounded-full ${verificationResult.validated ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)]' :
                                        verificationResult.success ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-red-500 text-white'
                                    }`}>
                                        {verificationResult.validated ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : verificationResult.success ? (
                                            <Info className="w-6 h-6" />
                                        ) : (
                                            <XCircle className="w-6 h-6" />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className={`text-lg font-bold leading-tight ${verificationResult.cancelled ? 'text-red-500' :
                                            verificationResult.validated ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                verificationResult.success ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'text-red-500'
                                        }`}>
                                            {cleanMessage(verificationResult.validated ? verificationResult.finalMessage : verificationResult.message)}
                                        </h3>
                                        {verificationResult.warning && (
                                            <p className="text-orange-500 text-sm mt-2 font-medium flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                {cleanMessage(verificationResult.warning)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {verificationResult.success && (
                                    <div className="space-y-6">
                                        {/* DATA GRID */}
                                        <div className="flex flex-col gap-6">
                                            {/* CARD 1: INFO CLIENT */}
                                            <div className="bg-zinc-950/50 p-5 rounded-3xl border border-zinc-800 flex flex-col gap-4">
                                                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                                    <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                                                    <h4 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Info Client</h4>
                                                </div>

                                                <div className="bg-black p-4 rounded-2xl border border-zinc-800/80">
                                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Client</p>
                                                    <p className="text-zinc-200 font-bold text-2xl truncate leading-tight">{verificationResult.client}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-black p-4 rounded-2xl border border-zinc-800/80">
                                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Places</p>
                                                        <p className="text-white font-bold text-2xl leading-tight">{verificationResult.places}</p>
                                                    </div>
                                                    <div className="bg-black p-4 rounded-2xl border border-zinc-800/80">
                                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Montant</p>
                                                        <p className="text-red-600 font-bold text-2xl leading-tight drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">{verificationResult.montant} DH</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CARD 2: INFO FILM */}
                                            <div className="bg-zinc-950/50 p-5 rounded-3xl border border-zinc-800 flex flex-col gap-4">
                                                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                                    <h4 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Info Film</h4>
                                                </div>

                                                <div className="bg-black p-4 rounded-2xl border border-zinc-800/80">
                                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Film</p>
                                                    <p className="text-red-600 font-bold text-2xl truncate leading-tight">{verificationResult.film}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-black p-4 rounded-2xl border border-zinc-800/80">
                                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Séance</p>
                                                        <p className="text-white font-bold text-2xl leading-tight">{verificationResult.horaire}</p>
                                                    </div>
                                                    <div className="bg-black p-4 rounded-2xl border border-zinc-800/80">
                                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Salle</p>
                                                        <p className="text-white font-bold text-2xl leading-tight">{verificationResult.salle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        {verificationResult.canValidate && !verificationResult.validated && (
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <button
                                                    onClick={handleValidation}
                                                    disabled={validating || cancelling}
                                                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Valider l\'entrée'}
                                                </button>

                                                <button
                                                    onClick={() => setShowConfirmCancel(true)}
                                                    disabled={validating || cancelling}
                                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    {cancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Annuler'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleReset}
                                    className="w-full bg-zinc-200 hover:bg-zinc-100 text-zinc-900 font-bold py-4 rounded-2xl transition border border-zinc-300 hover:border-zinc-200 flex items-center justify-center gap-2"
                                >
                                    {verificationResult.validated ? 'Scanner le suivant' : 'Réinitialiser'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmCancel}
                onClose={() => setShowConfirmCancel(false)}
                onConfirm={handleCancellation}
                title="Annuler la réservation"
                message="Êtes-vous sûr de vouloir ANNULER cette réservation ? Cette action est irréversible et supprimera le billet de la séance."
                type="danger"
            />
        </div>
    );
}
