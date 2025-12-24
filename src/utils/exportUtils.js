import api from '../api/api';

/**
 * Télécharge un fichier Excel généré par le backend.
 * @param {string} url - L'URL de l'endpoint export (ex: /admin/historique/users/export/excel)
 * @param {object} params - Les filtres (search, operations, start, end, etc.)
 * @param {string} pageName - Le nom de la page pour le fichier (ex: "HistoriqueUtilisateurs")
 */
export const downloadExcelFromBackend = async (url, params = {}, pageName = 'Export') => {
    try {
        // Nettoyer les paramètres : enlever les chaînes vides, null ou undefined
        const cleanParams = {};
        if (params) {
            Object.keys(params).forEach(key => {
                const val = params[key];
                if (val !== undefined && val !== null && val !== '') {
                    cleanParams[key] = val;
                }
            });
        }

        console.log("Downloading from:", url, "with params:", cleanParams);
        const response = await api.get(url, {
            params: cleanParams,
            responseType: 'blob'
        });

        // Générer le nom de fichier avec date et heure (format: NomPage_YYYY-MM-DD_HH-mm.xlsx)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const filename = `${pageName}_${year}-${month}-${day}_${hours}-${minutes}.xlsx`;
        console.log("Generated filename:", filename);

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'Excel:', error);
        throw error;
    }
};

// Fonctions obsolètes (supprimées comme demandé)
export const exportToExcel = () => { console.warn('Fonction obsolète. Utilisez downloadExcelFromBackend.'); };
export const exportToPDF = () => { console.warn('Fonction PDF supprimée.'); };
