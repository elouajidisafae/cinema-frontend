import { useState } from "react";
import { Upload, Film as FilmIcon, Calendar, Clock, Tag, FileText, Youtube, X, Image } from "lucide-react";
import { adminApi } from "../../../api/admin.api";

const GENRES = [
    "Action", "Aventure", "Comédie", "Drame", "Fantastique",
    "Horreur", "Policier", "Romance", "Science-Fiction", "Thriller", "Animation", "Documentaire"
];

export default function FilmForm({ film, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        titre: film?.titre || "",
        description: film?.description || "",
        duree: film?.duree || "",
        genre: film?.genre || "",
        dateSortie: film?.dateSortie || "",
        afficheUrl: film?.afficheUrl || "",
        trailerUrl: film?.trailerUrl || "",
        ageLimite: film?.ageLimite || ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        film?.afficheUrl
            ? (film.afficheUrl.startsWith('/uploads')
                ? `http://localhost:8080${film.afficheUrl}`
                : film.afficheUrl)
            : null
    );
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validation
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: "Format non supporté. Utilisez PNG ou JPG" }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: "Fichier trop volumineux (max 5MB)" }));
                return;
            }

            setImageFile(file);
            setErrors(prev => ({ ...prev, image: "" }));

            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.titre.trim()) newErrors.titre = "Le titre est obligatoire";
        if (!formData.description.trim()) newErrors.description = "La description est obligatoire";
        if (!formData.duree || formData.duree <= 0) newErrors.duree = "La durée doit être supérieure à 0";
        if (!formData.genre.trim()) newErrors.genre = "Le genre est obligatoire";
        if (!formData.dateSortie) newErrors.dateSortie = "La date de sortie est obligatoire";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            let afficheUrl = formData.afficheUrl;

            // Upload image if new file selected
            if (imageFile) {
                setUploading(true);
                const uploadResponse = await adminApi.uploadFilmPoster(imageFile);
                afficheUrl = uploadResponse.data.url;
                setUploading(false);
            }

            const dataToSubmit = {
                ...formData,
                duree: parseInt(formData.duree),
                ageLimite: formData.ageLimite,
                afficheUrl
            };

            await onSubmit(dataToSubmit);
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            const errorMessage = typeof error.response?.data === 'string'
                ? error.response.data
                : error.response?.data?.message || error.message || "Une erreur est survenue";
            setErrors({ submit: errorMessage });
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Titre */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                            <FilmIcon className="w-4 h-4" />
                            Titre du film
                        </label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                            placeholder="Ex: Inception"
                        />
                        {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                            <FileText className="w-4 h-4" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all resize-none"
                            placeholder="Synopsis du film..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Durée, Genre et Age Limite */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                                <Clock className="w-4 h-4" />
                                Durée (min)
                            </label>
                            <input
                                type="number"
                                name="duree"
                                value={formData.duree}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="120"
                            />
                            {errors.duree && <p className="text-red-500 text-xs mt-1">{errors.duree}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                                <Tag className="w-4 h-4" />
                                Genre
                            </label>
                            <select
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none"
                            >
                                <option value="" disabled>Sélectionner un genre</option>
                                {GENRES.map(g => (
                                    <option key={g} value={g} className="bg-zinc-900">{g}</option>
                                ))}
                            </select>
                            {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                                <Tag className="w-4 h-4" />
                                Age Limite
                            </label>
                            <input
                                type="text"
                                name="ageLimite"
                                value={formData.ageLimite}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                                placeholder="Ex: 12+"
                            />
                        </div>
                    </div>

                    {/* Date de sortie */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                            <Calendar className="w-4 h-4" />
                            Date de sortie
                        </label>
                        <input
                            type="date"
                            name="dateSortie"
                            value={formData.dateSortie}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        />
                        {errors.dateSortie && <p className="text-red-500 text-xs mt-1">{errors.dateSortie}</p>}
                    </div>

                    {/* Trailer URL */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                            <Youtube className="w-4 h-4" />
                            URL Bande-annonce (YouTube)
                        </label>
                        <input
                            type="url"
                            name="trailerUrl"
                            value={formData.trailerUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                        <Image className="w-4 h-4" />
                        Affiche du film
                    </label>
                    <div className="relative">
                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-96 object-cover rounded-xl border border-zinc-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setImageFile(null);
                                        setFormData(prev => ({ ...prev, afficheUrl: "" }));
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-red-600 transition-colors bg-zinc-900/30">
                                <Upload className="w-12 h-12 text-zinc-600 mb-2" />
                                <p className="text-sm text-zinc-500">Cliquez pour uploader</p>
                                <p className="text-xs text-zinc-600 mt-1">PNG, JPG (max 5MB)</p>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </label>
                        )}
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
                    disabled={uploading}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Upload en cours...
                        </>
                    ) : (
                        film ? "Modifier" : "Ajouter"
                    )}
                </button>
            </div>
        </form>
    );
}
