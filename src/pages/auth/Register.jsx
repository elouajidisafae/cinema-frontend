import { useState } from "react";
import { Film, Mail, Lock, User, Phone, Calendar, Eye, EyeOff, Check, ArrowRight, Sparkles, Ticket, Clock } from "lucide-react";

export default function CinemanaRegister() {
    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        motDePasse: "",
        numeroTelephone: "",
        dateNaissance: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Appel API vers Spring Boot backend
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de l'inscription");
            }

            console.log("Inscription réussie:", data);

            // Redirection directe vers la page de connexion
            window.location.href = "/login/client";

        } catch (err) {
            console.error("Erreur inscription:", err);
            setError(err.message || "Erreur lors de l'inscription. Vérifiez vos données.");
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = () => {
        const password = form.motDePasse;
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 6) return { strength: 1, label: "Faible", color: "bg-red-500" };
        if (password.length < 10) return { strength: 2, label: "Moyen", color: "bg-amber-500" };
        return { strength: 3, label: "Fort", color: "bg-emerald-500" };
    };

    const strength = passwordStrength();

    return (
        <div className="h-screen bg-black relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
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
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">RÉSERVATION EN LIGNE</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full">
                            <Sparkles className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Billets PDF</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-8">
                    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Hero */}
                        <div className="space-y-6 hidden lg:block">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full">
                                <Sparkles className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Réservation Instantanée</span>
                            </div>

                            <div>
                                <h2 className="text-6xl font-black text-white leading-none mb-2">
                                    Votre
                                </h2>
                                <h2 className="text-6xl font-black text-red-600 leading-none mb-2">
                                    cinéma
                                </h2>
                                <h2 className="text-6xl font-black text-red-600 leading-none mb-6">
                                    digital
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                                    Consultez les films, choisissez votre séance, réservez vos places et recevez vos billets PDF avec QR code par email.
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
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Ticket className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Billets avec QR Code</h3>
                                        <p className="text-gray-500 text-xs">PDF sécurisé envoyé par email</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">Séances 2D, 3D & IMAX</h3>
                                        <p className="text-gray-500 text-xs">Consultez horaires et prix en temps réel</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full max-w-md mx-auto lg:mx-0">
                            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
                                {/* Header */}
                                <div className="mb-5">
                                    <h3 className="text-2xl font-black text-white mb-1">
                                        Créer un compte
                                    </h3>
                                    <p className="text-gray-500 text-xs">
                                        Accédez à vos réservations et billets
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                        <p className="text-red-400 text-xs">{error}</p>
                                    </div>
                                )}

                                {/* Form */}
                                <div className="space-y-3">
                                    {/* Nom & Prénom */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="text"
                                                name="nom"
                                                value={form.nom}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all text-xs"
                                                placeholder="Nom"
                                            />
                                        </div>

                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="text"
                                                name="prenom"
                                                value={form.prenom}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all text-xs"
                                                placeholder="Prénom"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all text-xs"
                                            placeholder="Adresse email"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="motDePasse"
                                                value={form.motDePasse}
                                                onChange={handleChange}
                                                minLength={6}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all text-xs"
                                                placeholder="Mot de passe"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {form.motDePasse && (
                                            <div className="mt-2 space-y-1.5">
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-1 flex-1 rounded-full transition-all ${
                                                                level <= strength.strength ? strength.color : 'bg-zinc-800'
                                                            }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Téléphone & Date */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="tel"
                                                name="numeroTelephone"
                                                value={form.numeroTelephone}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all text-xs"
                                                placeholder="Téléphone"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="date"
                                                name="dateNaissance"
                                                value={form.dateNaissance}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={acceptTerms}
                                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                                required
                                                className="w-4 h-4 rounded bg-black border-2 border-zinc-800 checked:bg-red-600 checked:border-red-600 cursor-pointer transition appearance-none"
                                            />
                                            {acceptTerms && (
                                                <Check className="w-2.5 h-2.5 text-white absolute pointer-events-none" />
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-500 leading-relaxed">
                                            J'accepte les{" "}
                                            <a href="#" className="text-blue-500 hover:text-blue-400">
                                                conditions d'utilisation
                                            </a>{" "}
                                            et la{" "}
                                            <a href="#" className="text-blue-500 hover:text-blue-400">
                                                politique de confidentialité
                                            </a>
                                        </span>
                                    </label>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Création en cours...
                                            </>
                                        ) : (
                                            <>
                                                Créer mon compte
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

                                {/* Login Link */}
                                <div className="text-center">
                                    <p className="text-gray-500 text-xs">
                                        Vous avez déjà un compte ?{" "}
                                        <a href="/login/client" className="text-blue-500 hover:text-blue-400 font-semibold">
                                            Se connecter
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Trust Badge */}
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
                        © 2024 Cinemana - Système de réservation en ligne. Propulsé par Spring Boot.
                    </p>
                </footer>
            </div>
        </div>
    );
}