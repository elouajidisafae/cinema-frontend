import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import { Tag, Save, X } from "lucide-react";

export default function OffreEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        dateDebut: "",
        dateFin: "",
        prix: 0,
        actif: true
    });

    useEffect(() => {
        const fetchOffre = async () => {
            try {
                const res = await adminApi.getOffreById(id);
                // Ensure date format is YYYY-MM-DD for input[type="date"]
                const dStart = res.data.dateDebut ? res.data.dateDebut.split('T')[0] : "";
                const dEnd = res.data.dateFin ? res.data.dateFin.split('T')[0] : "";

                setFormData({
                    ...res.data,
                    dateDebut: dStart,
                    dateFin: dEnd
                });
            } catch (err) {
                console.error(err);
                alert("Erreur chargement offre");
            } finally {
                setLoading(false);
            }
        };
        fetchOffre();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateOffre(id, formData);
            navigate("/admin/offres");
        } catch (err) {
            console.error(err);
            alert("Erreur mise à jour");
        }
    };

    if (loading) return (
        <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-zinc-500 mt-4">Chargement...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                    <Tag className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Modifier l'Offre</h1>
                    <p className="text-sm text-zinc-500">{formData.titre}</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-medium">Titre de l'offre</label>
                            <input
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder-zinc-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-medium">Prix (DH)</label>
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder-zinc-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder-zinc-600 resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-medium">Date de début</label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-medium">Date de fin</label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                        <input
                            type="checkbox"
                            name="actif"
                            checked={formData.actif}
                            onChange={handleChange}
                            id="actif"
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-red-600 focus:ring-offset-0 accent-red-600"
                        />
                        <label htmlFor="actif" className="text-sm font-medium text-white cursor-pointer select-none">
                            Activer l'offre
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/offres")}
                            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium"
                        >
                            <X size={18} />
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-lg shadow-red-600/20"
                        >
                            <Save size={18} />
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
