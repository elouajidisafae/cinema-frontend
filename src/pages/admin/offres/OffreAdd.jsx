import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import { Tag, Save, X } from "lucide-react";

export default function OffreAdd() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        dateDebut: "",
        dateFin: "",
        prix: 0,
        actif: true
    });

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
            await adminApi.createOffre(formData);
            navigate("/admin/offres");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                    <Tag className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Ajouter une Offre</h1>
                    <p className="text-sm text-zinc-500">Créer une nouvelle offre promotionnelle</p>
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
                                placeholder="Ex: Pack Famille"
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
                            placeholder="Détails de l'offre..."
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
                            Créer l'offre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
