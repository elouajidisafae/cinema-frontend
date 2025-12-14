import { Theater } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import SalleForm from "../../../components/admin/shared/SalleForm";

export default function AjouterSalle() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await adminApi.createSalle(data);
            navigate("/admin/salles");
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                    <Theater className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Ajouter une Salle</h1>
                    <p className="text-sm text-zinc-500">Créer une nouvelle salle</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <SalleForm onSubmit={handleSubmit} onCancel={() => navigate("/admin/salles")} />
            </div>
        </div>
    );
}
