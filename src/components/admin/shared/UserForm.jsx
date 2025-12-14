import { useState, useEffect } from "react";
import { Save, Lock, Mail, User } from "lucide-react";

export default function UserForm({ user, role, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        cin: "",
        dateNaissance: "",
        dateEmbauche: "",
        motDePasse: "",
        role: role || "CAISSIER"
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || "",
                prenom: user.prenom || "",
                email: user.email || "",
                cin: user.cin || "",
                dateNaissance: user.dateNaissance || "",
                dateEmbauche: user.dateEmbauche || "",
                motDePasse: "",
                role: user.role || role
            });
        }
    }, [user, role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (!payload.motDePasse) {
            delete payload.motDePasse;
        }
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Nom</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                            placeholder="Entrez le nom"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Prénom</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                            placeholder="Entrez le prénom"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">CIN</label>
                <div className="relative group">
                    <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                        placeholder="Numéro de CIN"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Date de Naissance</label>
                    <input
                        type="date"
                        name="dateNaissance"
                        value={formData.dateNaissance}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Date d'Embauche</label>
                    <input
                        type="date"
                        name="dateEmbauche"
                        value={formData.dateEmbauche}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email Professionnel</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                        placeholder="exemple@cinemana.com"
                    />
                </div>
            </div>

            {user && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                        Nouveau mot de passe (optionnel)
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                        <input
                            type="password"
                            name="motDePasse"
                            value={formData.motDePasse}
                            onChange={handleChange}
                            minLength={8}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-700"
                            placeholder="Laisser vide pour conserver"
                        />
                    </div>
                </div>
            )}

            <div className="pt-6 flex gap-3 justify-end border-t border-zinc-800/50 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm font-medium"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium shadow-lg shadow-red-900/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {user ? "Mettre à jour" : "Créer le compte"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
