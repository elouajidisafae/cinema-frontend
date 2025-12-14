import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';
import HistoriqueTable from '../../../components/admin/shared/HistoriqueTable';
import { UserPlus, Search, Calendar } from 'lucide-react';

export default function ListeClients() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        start: '',
        end: ''
    });

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.start) params.start = new Date(filters.start).toISOString();
            if (filters.end) params.end = new Date(filters.end).toISOString();

            const response = await adminApi.getFilteredClients(params);
            setData(response.data);
        } catch (error) {
            console.error("Erreur chargement clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchClients, 500);
        return () => clearTimeout(timeout);
    }, [filters]);

    const columns = [
        { header: "Nom", accessor: "nom" },
        { header: "Prénom", accessor: "prenom" },
        { header: "Email", accessor: "email" },
        { header: "Téléphone", accessor: "numeroTelephone" },
        { header: "Inscrit le", accessor: "createdAt", render: (row) => new Date(row.createdAt).toLocaleDateString('fr-FR') },
    ];

    return (
        <HistoriqueTable
            title="Clients Inscrits"
            icon={UserPlus}
            data={data}
            columns={columns}
            isLoading={isLoading}
            stats={[
                { label: "Total Clients", value: data.length, icon: UserPlus, colorBg: "bg-indigo-500/10", colorText: "text-indigo-500" }
            ]}
            filters={
                <>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher client..."
                            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-40"
                            value={filters.search}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <input type="datetime-local" className="bg-transparent text-sm text-white focus:outline-none w-32 md:w-auto" value={filters.start} onChange={(e) => setFilters(p => ({ ...p, start: e.target.value }))} />
                        <span className="text-zinc-600">-</span>
                        <input type="datetime-local" className="bg-transparent text-sm text-white focus:outline-none w-32 md:w-auto" value={filters.end} onChange={(e) => setFilters(p => ({ ...p, end: e.target.value }))} />
                    </div>
                </>
            }
        />
    );
}
