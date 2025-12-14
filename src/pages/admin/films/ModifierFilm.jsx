import { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import FilmForm from "../../../components/admin/shared/FilmForm";

export default function ModifierFilm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const [actifsRes, inactifsRes] = await Promise.all([
                    adminApi.getFilms(true),
                    adminApi.getFilms(false)
                ]);
                const allFilms = [...actifsRes.data, ...inactifsRes.data];
                const foundFilm = allFilms.find(f => f.id === id);
                setFilm(foundFilm);
            } catch (error) {
                console.error("Error fetching film:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilm();
    }, [id]);

    const handleSubmit = async (data) => {
        try {
            await adminApi.updateFilm(id, data);
            navigate("/admin/films");
        } catch (error) {
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-zinc-500 mt-4">Chargement...</p>
            </div>
        );
    }

    if (!film) {
        return (
            <div className="text-center py-12 text-zinc-500">
                Film non trouvé
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                    <Film className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Modifier le Film</h1>
                    <p className="text-sm text-zinc-500">{film.titre}</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <FilmForm
                    film={film}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/films")}
                />
            </div>
        </div>
    );
}
