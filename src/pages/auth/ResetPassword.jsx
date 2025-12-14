import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetInitialPassword(password);
            setSuccess(true);
            setTimeout(() => {
                // Remove token to force re-login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login/internal');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de la réinitialisation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />


            <div className="relative w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-red-600/20 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Première Connexion</h2>
                    <p className="text-zinc-400">Veuillez définir votre nouveau mot de passe pour continuer.</p>
                </div>

                {success ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3 text-green-500 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle className="w-6 h-6 shrink-0" />
                        <p className="font-medium">Mot de passe mis à jour ! Redirection...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Nouveau mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-zinc-600 pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Confirmer le mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-zinc-600 pr-10"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Valider
                                    <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
