import { useState, useEffect } from "react";
import { commercialApi } from "../../api/commercial.api";
import { X, Save, Calendar, Clock, DollarSign, Film, Theater, Layers } from "lucide-react";

import { createPortal } from "react-dom";

export default function AjouterSeance({ onClose, onSave, films, salles, categories, initialData }) {
    const [formData, setFormData] = useState({
        filmId: "",
        salleId: "",
        categorieId: "",
        date: "",
        heure: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            const dateObj = new Date(initialData.dateHeure);
            setFormData({
                filmId: initialData.filmId,
                salleId: initialData.salleId,
                categorieId: initialData.categorieId,
                date: dateObj.toISOString().split('T')[0],
                heure: dateObj.toTimeString().slice(0, 5)
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const dateHeure = `${formData.date}T${formData.heure}:00`;
            const selectedDate = new Date(dateHeure);
            const now = new Date();

            if (selectedDate < now) {
                setError("Impossible de programmer une séance dans le passé.");
                setLoading(false);
                return;
            }

            const payload = {
                filmId: formData.filmId,
                salleId: formData.salleId,
                categorieId: formData.categorieId,
                dateHeure: dateHeure
                // prixTicket is derived from category backend-side
            };

            if (initialData) {
                await commercialApi.updateSeance(initialData.id, payload);
            } else {
                await commercialApi.createSeance(payload);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Error saving seance", err);
            setError(err.response?.data?.message || err.response?.data?.error || "Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative flex items-center justify-center p-6 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white text-center">
                        {initialData ? "Modifier la Séance" : "Programmer une Séance"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
                        type="button"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Film Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <Film className="w-4 h-4" /> Film
                                </label>
                                <select
                                    name="filmId"
                                    value={formData.filmId}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Sélectionner un film</option>
                                    {films.map(f => <option key={f.id} value={f.id}>{f.titre} ({f.genre})</option>)}
                                </select>
                            </div>

                            {/* Salle Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <Theater className="w-4 h-4" /> Salle
                                </label>
                                <select
                                    name="salleId"
                                    value={formData.salleId}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Sélectionner une salle</option>
                                    {salles.map(s => <option key={s.id} value={s.id}>{s.nom} ({s.capacite} places)</option>)}
                                </select>
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                                />
                            </div>

                            {/* Heure */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Heure
                                </label>
                                <input
                                    type="time"
                                    name="heure"
                                    value={formData.heure}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                                />
                            </div>

                            {/* Categorie */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Catégorie
                                </label>
                                <select
                                    name="categorieId"
                                    value={formData.categorieId}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                                </select>
                            </div>

                            {/* Prix Display (Read-only) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Prix du Ticket (Automatique)
                                </label>
                                <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 min-h-[50px] flex items-center">
                                    {formData.categorieId
                                        ? `${categories.find(c => c.id == formData.categorieId)?.prixBase || 0} MAD`
                                        : ""}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-800 flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all font-medium shadow-lg shadow-red-900/20 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {initialData ? "Sauvegarder les modifications" : "Créer la Séance"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}
