import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';

import { AdminDashboard } from './pages/AdminDashboard';
import { Filieres } from './pages/Filieres';
import { Classes } from './pages/Classes';
import { Etudiants } from './pages/Etudiants';
import { Enseignants } from './pages/Enseignants';
import { Matieres } from './pages/Matieres';
import { AnneesAcademiques } from './pages/AnneesAcademiques';
import { Inscriptions } from './pages/Inscriptions';
import { Notes } from './pages/Notes';
import { Bulletins } from './pages/Bulletins';
import { Paiements } from './pages/Paiements';
import { Rapports } from './pages/Rapports';
import { Parametres } from './pages/Parametres';
import { Utilisateurs } from './pages/Utilisateurs';

import { EtudiantDashboard } from './pages/EtudiantDashboard';
import { EtudiantProfil } from './pages/EtudiantProfil';
import { EtudiantNotes } from './pages/EtudiantNotes';
import { EtudiantBulletins } from './pages/EtudiantBulletins';
import { EtudiantPaiements } from './pages/EtudiantPaiements';

const MainContent: React.FC = () => {
  const { currentUser, activeTab } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  const renderAdminPage = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'filieres': return <Filieres />;
      case 'classes': return <Classes />;
      case 'etudiants': return <Etudiants />;
      case 'enseignants': return <Enseignants />;
      case 'matieres': return <Matieres />;
      case 'annees': return <AnneesAcademiques />;
      case 'inscriptions': return <Inscriptions />;
      case 'notes': return <Notes />;
      case 'bulletins': return <Bulletins />;
      case 'paiements': return <Paiements />;
      case 'rapports': return <Rapports />;
      case 'parametres': return <Parametres />;
      case 'utilisateurs': return <Utilisateurs />;
      default: return <AdminDashboard />;
    }
  };

  const renderEtudiantPage = () => {
    switch (activeTab) {
      case 'etudiant-dashboard': return <EtudiantDashboard />;
      case 'etudiant-profil': return <EtudiantProfil />;
      case 'etudiant-notes': return <EtudiantNotes />;
      case 'etudiant-bulletins': return <EtudiantBulletins />;
      case 'etudiant-paiements': return <EtudiantPaiements />;
      default: return <EtudiantDashboard />;
    }
  };

  return (
    <Layout>
      {currentUser.type === 'admin' ? renderAdminPage() : renderEtudiantPage()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
