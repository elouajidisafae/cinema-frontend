import { useState } from "react";
import { Theater, Users, Tag, ChevronDown, Grid3x3, Armchair } from "lucide-react";

export default function SalleForm({ salle, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        nom: salle?.nom || "",
        capacite: salle?.capacite || "",
        type: salle?.type || "",
        nombreRangees: salle?.nombreRangees || 10,
        siegesParRangee: salle?.siegesParRangee || 10
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Dynamically calculate capacity
        const calculatedCapacite = parseInt(formData.nombreRangees) * parseInt(formData.siegesParRangee);

        // Validation
        const newErrors = {};
        if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire";
        if (calculatedCapacite < 10) newErrors.capacite = "La capacité calculée doit être au moins 10 (Rangées * Sièges)";
        if (!formData.type.trim()) newErrors.type = "Le type est obligatoire";
        if (!formData.nombreRangees || formData.nombreRangees < 1) newErrors.nombreRangees = "Au moins 1 rangée requise";
        if (!formData.siegesParRangee || formData.siegesParRangee < 1) newErrors.siegesParRangee = "Au moins 1 siège par rangée requis";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                capacite: calculatedCapacite,
                nombreRangees: parseInt(formData.nombreRangees),
                siegesParRangee: parseInt(formData.siegesParRangee)
            };
            await onSubmit(dataToSubmit);
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            setErrors({ submit: error.response?.data || "Une erreur est survenue" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                    <Theater className="w-4 h-4" />
                    Nom de la salle
                </label>
                <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                    placeholder="Ex: Salle 1"
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dynamically Displayed Capacity */}
                <div className="relative group/cap">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                        <Users className="w-4 h-4" />
                        Capacité Totale (Calculée)
                    </label>
                    <div className="w-full px-4 py-3 bg-zinc-900/30 border border-zinc-800/50 rounded-xl text-white flex items-center justify-between group-hover/cap:border-zinc-700 transition-colors">
                        <span className="text-lg font-bold">
                            {parseInt(formData.nombreRangees || 0) * parseInt(formData.siegesParRangee || 0)}
                        </span>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Places</span>
                    </div>
                    {errors.capacite && <p className="text-red-500 text-xs mt-1">{errors.capacite}</p>}
                </div>

                {/* Type */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                        <Tag className="w-4 h-4" />
                        Type de salle
                    </label>
                    <div className="relative">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-zinc-900 text-zinc-400">Sélectionner un type</option>
                            <option value="Standard" className="bg-zinc-900">Standard</option>
                            <option value="VIP" className="bg-zinc-900">VIP</option>
                            <option value="IMAX" className="bg-zinc-900">IMAX</option>
                            <option value="3D" className="bg-zinc-900">3D</option>
                            <option value="4DX" className="bg-zinc-900">4DX</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>
            </div>

            {/* Configuration des Sièges */}
            <div className="p-5 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 space-y-4 relative overflow-hidden group/config">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-red-500" />
                    Configuration de la Grille
                </h3>

                <div className="grid grid-cols-2 gap-6 relative z-10">
                    {/* Nombre de rangées */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                            <Grid3x3 className="w-4 h-4" />
                            Nombre de rangées
                        </label>
                        <input
                            type="number"
                            name="nombreRangees"
                            value={formData.nombreRangees}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="10"
                            min="1"
                        />
                        {errors.nombreRangees && <p className="text-red-500 text-xs mt-1">{errors.nombreRangees}</p>}
                    </div>

                    {/* Sièges par rangée */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                            <Armchair className="w-4 h-4" />
                            Sièges par rangée
                        </label>
                        <input
                            type="number"
                            name="siegesParRangee"
                            value={formData.siegesParRangee}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="10"
                            min="1"
                        />
                        {errors.siegesParRangee && <p className="text-red-500 text-xs mt-1">{errors.siegesParRangee}</p>}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl">
                    <p className="text-red-500 text-sm">{errors.submit}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all"
                    >
                        Annuler
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all"
                >
                    {salle ? "Modifier" : "Ajouter"}
                </button>
            </div>
        </form>
    );
}
