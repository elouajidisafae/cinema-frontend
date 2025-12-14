import { useState } from "react";
import {
    Film, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
    Shield, Briefcase, UserCog, Check
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../api";

export default function LoginInternal() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await authApi.loginInternal(email, motDePasse);
            const data = res.data;

            login(data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            if (data.role === "ADMIN") navigate("/admin/dashboard");
            else if (data.role === "COMMERCIAL") navigate("/commercial/dashboard");
            else if (data.role === "CAISSIER") navigate("/caissier/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Accès refusé");
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
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
                </div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <header className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white tracking-tight">CINEMANA</h1>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Espace Personnel</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full">
                            <Sparkles className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                                Admin • Commercial • Caissier
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-8">
                    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left side info */}
                        <div className="space-y-6 hidden lg:block">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full">
                                <Sparkles className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Espace du Personnel</span>
                            </div>

                            <div>
                                <h2 className="text-6xl font-black text-white leading-none mb-2">Gestion</h2>
                                <h2 className="text-6xl font-black text-red-600 leading-none mb-2">des opérations</h2>
                                <h2 className="text-6xl font-black text-red-600 leading-none mb-6">internes</h2>

                                <p className="text-gray-400 text-sm max-w-lg">
                                    Accédez à vos outils de gestion interne : administration, gestion commerciale et caisse.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Espace Administrateur</h3>
                                        <p className="text-gray-500 text-xs">Gestion des utilisateurs et films</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Espace Commercial</h3>
                                        <p className="text-gray-500 text-xs">Gestion offres, promotions, ventes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <UserCog className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Espace Caissier</h3>
                                        <p className="text-gray-500 text-xs">Gestion caisse et paiements</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side — Login Form */}
                        <div className="w-full max-w-md mx-auto lg:mx-0">
                            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">

                                <div className="mb-5">
                                    <h3 className="text-2xl font-black text-white mb-1">Connexion Personnel</h3>
                                    <p className="text-gray-500 text-xs">Accès réservé au personnel interne</p>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                        <p className="text-red-400 text-xs">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs mb-2 font-medium">Email professionnel</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white text-xs placeholder-gray-600 focus:border-red-600"
                                                placeholder="prenom.nom@cinemana.com"
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
                                                Connexion
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                                    <Link
                                        to="/login/client"
                                        className="text-gray-600 hover:text-gray-500 text-[10px] flex items-center justify-center gap-1"
                                    >
                                        <Lock className="w-3 h-3" />
                                        Espace Client
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-2 text-gray-600 text-[10px]">
                                <Check className="w-3 h-3 text-red-500" />
                                <span>Authentification sécurisé — JWT</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-8 py-3">
                    <p className="text-center text-gray-700 text-[10px]">
                        © 2024 Cinemana - Accès Personnel Interne.
                    </p>
                </footer>
            </div>
        </div>
    );
}
