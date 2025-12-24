import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';
import HistoriqueTable from '../../../components/admin/shared/HistoriqueTable';
import { UserPlus, Search, Calendar, User, Mail, Phone } from 'lucide-react';

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
            if (filters.start) params.start = filters.start;
            if (filters.end) params.end = filters.end;

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
        {
            header: "Client",
            accessor: "nom",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <User className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-red-500">{row.nom} {row.prenom}</span>
                </div>
            )
        },
        {
            header: "Email",
            accessor: "email",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span className="text-zinc-300">{row.email}</span>
                </div>
            )
        },
        {
            header: "Téléphone",
            accessor: "numeroTelephone",
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span className="text-zinc-300">{row.numeroTelephone || '---'}</span>
                </div>
            )
        },
        {
            header: "Inscrit le",
            accessor: "createdAt",
            align: 'right',
            render: (row) => (
                <div className="flex items-center justify-start gap-3">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>{new Date(row.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
            )
        },
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
            pageName="ListeClients"
            exportEndpoint="/admin/clients/export/excel"
            exportParams={{
                search: filters.search,
                start: filters.start || undefined,
                end: filters.end || undefined
            }}
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
