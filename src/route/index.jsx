// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";

import LoginClient from "../pages/auth/LoginClient.jsx";
import LoginInternal from "../pages/auth/LoginInternal.jsx";
import Register from "../pages/auth/Register.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

import ClientDashboard from "../pages/client/Dashboard.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import CommercialDashboard from "../pages/commercial/Dashboard.jsx";
import CaissierDashboard from "../pages/caissier/Dashboard.jsx";

// Caissier Pages
import AfficherCaissiersActifs from "../pages/admin/caissiers/AfficherCaissiersActifs.jsx";
import AfficherCaissiersDesactives from "../pages/admin/caissiers/AfficherCaissiersDesactives.jsx";
import AjouterCaissier from "../pages/admin/caissiers/AjouterCaissier.jsx";
import ModifierCaissier from "../pages/admin/caissiers/ModifierCaissier.jsx";
import DetailsCaissier from "../pages/admin/caissiers/DetailsCaissier.jsx";

// Commercial Pages
import AfficherCommerciauxActifs from "../pages/admin/commerciaux/AfficherCommerciauxActifs.jsx";
import AfficherCommerciauxDesactives from "../pages/admin/commerciaux/AfficherCommerciauxDesactives.jsx";
import AjouterCommercial from "../pages/admin/commerciaux/AjouterCommercial.jsx";
import ModifierCommercial from "../pages/admin/commerciaux/ModifierCommercial.jsx";
import DetailsCommercial from "../pages/admin/commerciaux/DetailsCommercial.jsx";

// Film Pages
import AfficherFilmsActifs from "../pages/admin/films/AfficherFilmsActifs.jsx";
import AfficherFilmsDesactives from "../pages/admin/films/AfficherFilmsDesactives.jsx";
import AjouterFilm from "../pages/admin/films/AjouterFilm.jsx";
import ModifierFilm from "../pages/admin/films/ModifierFilm.jsx";
import DetailsFilm from "../pages/admin/films/DetailsFilm.jsx";

// Salle Pages
import AfficherSallesActives from "../pages/admin/salles/AfficherSallesActives.jsx";
import AfficherSallesDesactivees from "../pages/admin/salles/AfficherSallesDesactivees.jsx";
import AjouterSalle from "../pages/admin/salles/AjouterSalle.jsx";
import ModifierSalle from "../pages/admin/salles/ModifierSalle.jsx";
import DetailsSalle from "../pages/admin/salles/DetailsSalle.jsx";

// Historique & Monitoring Pages
import HistoriqueUtilisateurs from "../pages/admin/historique/HistoriqueUtilisateurs.jsx";
import HistoriqueFilms from "../pages/admin/historique/HistoriqueFilms.jsx";
import HistoriqueSalles from "../pages/admin/historique/HistoriqueSalles.jsx";
import HistoriqueSeances from "../pages/admin/historique/HistoriqueSeances.jsx";
import HistoriqueReservations from "../pages/admin/historique/HistoriqueReservations.jsx";
import ListeClients from "../pages/admin/clients/ListeClients.jsx";

import { RoleRoute } from "../route/RoleRoute.jsx";

export const router = createBrowserRouter([
    { path: "/", element: <LoginClient /> },
    { path: "/login/client", element: <LoginClient /> },
    { path: "/login/internal", element: <LoginInternal /> },
    { path: "/register", element: <Register /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/unauthorized", element: <Unauthorized /> },

    // CLIENT
    {
        path: "/client",
        element: <RoleRoute allowedRoles="CLIENT" />,
        children: [
            { path: "dashboard", element: <ClientDashboard /> },
        ],
    },

    // ADMIN
    {
        path: "/admin",
        element: <RoleRoute allowedRoles="ADMIN" />,
        children: [
            {
                element: <AdminDashboard />,
                children: [
                    // Dashboard Home (Stats)
                    { path: "dashboard", element: null },

                    // Gestion Caissiers
                    { path: "caissiers", element: <AfficherCaissiersActifs /> },
                    { path: "caissiers/archives", element: <AfficherCaissiersDesactives /> },
                    { path: "caissiers/ajouter", element: <AjouterCaissier /> },
                    { path: "caissiers/modifier/:id", element: <ModifierCaissier /> },
                    { path: "caissiers/details/:id", element: <DetailsCaissier /> },

                    // Gestion Commerciaux
                    { path: "commerciaux", element: <AfficherCommerciauxActifs /> },
                    { path: "commerciaux/archives", element: <AfficherCommerciauxDesactives /> },
                    { path: "commerciaux/ajouter", element: <AjouterCommercial /> },
                    { path: "commerciaux/modifier/:id", element: <ModifierCommercial /> },
                    { path: "commerciaux/details/:id", element: <DetailsCommercial /> },

                    // Gestion Films
                    { path: "films", element: <AfficherFilmsActifs /> },
                    { path: "films/archives", element: <AfficherFilmsDesactives /> },
                    { path: "films/ajouter", element: <AjouterFilm /> },
                    { path: "films/modifier/:id", element: <ModifierFilm /> },
                    { path: "films/details/:id", element: <DetailsFilm /> },

                    // Gestion Salles
                    { path: "salles", element: <AfficherSallesActives /> },
                    { path: "salles/archives", element: <AfficherSallesDesactivees /> },
                    { path: "salles/ajouter", element: <AjouterSalle /> },
                    { path: "salles/modifier/:id", element: <ModifierSalle /> },
                    { path: "salles/details/:id", element: <DetailsSalle /> },
                    { path: "salles/modifier/:id", element: <ModifierSalle /> },
                    { path: "salles/details/:id", element: <DetailsSalle /> },

                    // Historique & Monitoring
                    { path: "hist-users", element: <HistoriqueUtilisateurs /> },
                    { path: "hist-films", element: <HistoriqueFilms /> },
                    { path: "hist-salles", element: <HistoriqueSalles /> },
                    { path: "hist-seances", element: <HistoriqueSeances /> },
                    { path: "hist-reservations", element: <HistoriqueReservations /> },
                    { path: "hist-clients", element: <ListeClients /> },
                    { path: "clients", element: <ListeClients /> }, // Alias for search consistency
                ]
            }
        ],
    },

    // COMMERCIAL
    {
        path: "/commercial",
        element: <RoleRoute allowedRoles="COMMERCIAL" />,
        children: [
            { path: "dashboard", element: <CommercialDashboard /> },
        ],
    },

    // CAISSIER
    {
        path: "/caissier",
        element: <RoleRoute allowedRoles="CAISSIER" />,
        children: [
            { path: "dashboard", element: <CaissierDashboard /> },
        ],
    },

    { path: "*", element: <div className="p-20 text-6xl text-center">404 - Page non trouvée</div> },
]);
