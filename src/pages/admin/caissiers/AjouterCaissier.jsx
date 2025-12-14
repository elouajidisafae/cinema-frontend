import { useState } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserForm from "../../../components/admin/shared/UserForm";

export default function AjouterCaissier() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (data) => {
        setIsSubmitting(true);
        try {
            await adminApi.createUser({ ...data, role: "CAISSIER" });
            navigate('/admin/caissiers');
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
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <CreditCard className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Ajouter Caissier</h2>
                        <p className="text-zinc-500 text-sm">Créez un nouveau compte caissier</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/admin/caissiers')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 backdrop-blur-sm">
                <UserForm
                    role="CAISSIER"
                    onSubmit={handleCreate}
                    onCancel={() => navigate('/admin/caissiers')}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
