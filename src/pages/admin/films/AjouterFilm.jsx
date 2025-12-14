import { Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import FilmForm from "../../../components/admin/shared/FilmForm";

export default function AjouterFilm() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await adminApi.createFilm(data);
            navigate("/admin/films");
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                    <Film className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Ajouter un Film</h1>
                    <p className="text-sm text-zinc-500">Créer un nouveau film</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <FilmForm onSubmit={handleSubmit} onCancel={() => navigate("/admin/films")} />
            </div>
        </div>
    );
}
