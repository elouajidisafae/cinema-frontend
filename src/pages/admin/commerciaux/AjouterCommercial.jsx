import { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserForm from "../../../components/admin/shared/UserForm";

export default function AjouterCommercial() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (data) => {
        setIsSubmitting(true);
        try {
            await adminApi.createUser({ ...data, role: "COMMERCIAL" });
            navigate('/admin/commerciaux');
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Erreur lors de la création: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20">
                        <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Ajouter Commercial</h2>
                        <p className="text-zinc-500 text-sm">Créez un nouveau compte commercial</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/admin/commerciaux')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 backdrop-blur-sm">
                <UserForm
                    role="COMMERCIAL"
                    onSubmit={handleCreate}
                    onCancel={() => navigate('/admin/commerciaux')}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
