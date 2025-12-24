import { useState } from "react";
import {
    Film, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
    Ticket, Clock, Check, X
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../api";

export default function LoginClient() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth(); // important !!!!!

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await authApi.loginClient(email, motDePasse);
            const data = res.data;

            // Enregistrer dans AuthProvider
            login({
                token: data.token,
                role: data.role,
                userId: data.userId,
                nomComplet: data.nomComplet
            });

            // Stockage manuel
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                role: data.role,
                userId: data.userId,
                nomComplet: data.nomComplet
            }));

            const redirectUrl = searchParams.get("redirect");
            if (redirectUrl) {
                navigate(decodeURIComponent(redirectUrl));
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Identifiants incorrects");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <header className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white tracking-tight">CINÉMANA</h1>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">RÉSERVATION EN LIGNE</p>
                            </div>
                        </Link>

                        <Link to="/" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-red-600 hover:text-red-500 rounded-full transition-all group">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">Retour au site</span>
                            <div className="w-5 h-5 rounded-full bg-zinc-800 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                                <X className="w-3 h-3 text-white" />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-8">
                    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Side */}
                        <div className="space-y-6 hidden lg:block">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full">
                                <Sparkles className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Connexion Rapide</span>
                            </div>

                            <div>
                                <h2 className="text-6xl font-black text-white leading-none mb-2">Bienvenue</h2>
                                <h2 className="text-6xl font-black text-red-600 leading-none mb-2">sur votre</h2>
                                <h2 className="text-6xl font-black text-red-600 leading-none mb-6">espace</h2>

                                <p className="text-gray-400 text-sm max-w-lg">
                                    Connectez-vous pour accéder à vos réservations, consulter l'historique et réserver vos séances.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <div className="text-4xl font-black text-white mb-1">1000+</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Clients</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-white mb-1">250+</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Films</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-white mb-1">4.8 ⭐</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Satisfaction</div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <Ticket className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Historique des Billets</h3>
                                        <p className="text-gray-500 text-xs">Téléchargez vos billets facilement</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Réservation Express</h3>
                                        <p className="text-gray-500 text-xs">En quelques clics</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side — Login Form */}
                        <div className="w-full max-w-md mx-auto lg:mx-0">
                            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">

                                <div className="mb-5">
                                    <h3 className="text-2xl font-black text-white mb-1">Se connecter</h3>
                                    <p className="text-gray-500 text-xs">Accédez à votre espace client</p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                        <p className="text-red-400 text-xs">{error}</p>
                                    </div>
                                )}

                                {/* Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs mb-2 font-medium">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white text-xs placeholder-gray-600 focus:border-red-600"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-xs mb-2 font-medium">Mot de passe</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={motDePasse}
                                                onChange={(e) => setMotDePasse(e.target.value)}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-10 py-2.5 text-white text-xs placeholder-gray-600 focus:border-red-600"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <a className="text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer">Mot de passe oublié ?</a>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Connexion…
                                            </>
                                        ) : (
                                            <>
                                                Se connecter
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-zinc-800"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 bg-zinc-900/50 text-gray-600 text-[10px] uppercase tracking-widest">OU</span>
                                    </div>
                                </div>

                                {/* Register */}
                                <div className="text-center mt-6">
                                    <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
                                        Pas encore de compte ?
                                        <Link to="/register" className="text-red-600 hover:text-red-500 font-medium text-xs hover:underline transition-all ml-1">
                                            Créer un compte gratuitement
                                        </Link>
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                                    <Link
                                        to="/login/internal"
                                        className="text-gray-600 hover:text-gray-500 text-[10px] flex items-center justify-center gap-1"
                                    >
                                        <Lock className="w-3 h-3" />
                                        Accès Personnel
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-2 text-gray-600 text-[10px]">
                                <Check className="w-3 h-3 text-red-500" />
                                <span>Authentification JWT sécurisée</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-8 py-3">
                    <p className="text-center text-gray-700 text-[10px]">
                        © 2025 CINÉMANA - Système de réservation en ligne. Propulsé par Spring Boot.
                    </p>
                </footer>
            </div>
        </div>
    );
}
