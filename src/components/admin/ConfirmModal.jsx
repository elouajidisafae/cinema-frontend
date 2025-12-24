import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-1">
                    <div className="bg-zinc-900/50 rounded-[22px] p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${type === 'danger' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                {type === 'danger' ? (
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                ) : (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                {title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button
                                onClick={onClose}
                                className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`px-4 py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-black/20 ${type === 'danger'
                                    ? 'bg-red-600 hover:bg-red-500 shadow-red-600/10'
                                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10'
                                }`}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
