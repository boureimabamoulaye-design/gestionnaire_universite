import React from 'react';
import { useApp } from '../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    etudiants,
    enseignants,
    filieres,
    classes,
    matieres,
    inscriptions,
    paiements,
    activeAnnee,
    notes
  } = useApp();

  const activeAnneeId = activeAnnee?.id || 1;

  const totalPaiementsMois = (paiements || [])
    .filter(p => p.id_annee_academique === activeAnneeId)
    .reduce((acc, p) => acc + p.montant, 0);

  const activeInscriptions = (inscriptions || []).filter(i => i.id_annee_academique === activeAnneeId);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Aperçu Général des Activités</h1>
          <p className="text-xs text-gray-400 mt-1">Données consolidées pour l'année académique active {activeAnnee?.libelle || '2025-2026'}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Étudiants</p>
          <p className="text-3xl font-bold text-gray-900">{etudiants.length}</p>
          <p className="text-[11px] text-emerald-600 mt-2 font-semibold">+{activeInscriptions.length} cette session</p>
        </div>
        <div className="bg-white p-6 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Enseignants</p>
          <p className="text-3xl font-bold text-gray-900">{enseignants.length}</p>
          <p className="text-[11px] text-gray-400 mt-2">Vacataires et Titulaires</p>
        </div>
        <div className="bg-white p-6 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Filières</p>
          <p className="text-3xl font-bold text-gray-900">{filieres.length}</p>
          <p className="text-[11px] text-gray-400 mt-2">{classes.length} Classes &bull; {matieres.length} Matières</p>
        </div>
        <div className="bg-white p-6 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Paiements (Mois)</p>
          <p className="text-3xl font-bold text-gray-900 font-mono">{(totalPaiementsMois / 1000000).toFixed(1)}M FCFA</p>
          <p className="text-[11px] text-gray-400 mt-2 font-mono">{totalPaiementsMois.toLocaleString()} FCFA récoltés</p>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières Inscriptions */}
        <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Dernières Inscriptions</h3>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase font-mono">{activeInscriptions.length} AU TOTAL</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matricule</th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Étudiant</th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Filière</th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeInscriptions.slice(0, 5).map(ins => {
                  const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
                  const fil = (filieres || []).find(f => f.id === ins.id_filiere);
                  return (
                    <tr key={ins.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-3.5 text-xs font-mono text-[#2563EB] font-bold">{etu?.matricule}</td>
                      <td className="px-6 py-3.5 text-xs font-bold text-gray-900">{etu?.nom} {etu?.prenom}</td>
                      <td className="px-6 py-3.5 text-xs text-gray-600">{fil?.code}</td>
                      <td className="px-6 py-3.5 text-[10px]">
                        <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] rounded-[8px] font-bold uppercase border border-blue-100">
                          Inscrit
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dernières Évaluations */}
        <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Dernières Évaluations</h3>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase font-mono">{notes.length} SAISIES</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Étudiant</th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matière</th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Note</th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(notes || []).slice(0, 5).map(n => {
                  const etu = (etudiants || []).find(e => e.id === n.id_etudiant);
                  const mat = (matieres || []).find(m => m.id === n.id_matiere);
                  return (
                    <tr key={n.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-3.5 text-xs font-bold text-gray-900">{etu?.nom} {etu?.prenom}</td>
                      <td className="px-6 py-3.5 text-xs text-gray-600">{mat?.nom}</td>
                      <td className="px-6 py-3.5 text-xs font-bold text-gray-900 font-mono">{n.note_finale} / 20</td>
                      <td className="px-6 py-3.5 text-[10px]">
                        <span className={`px-2.5 py-1 rounded-[8px] font-bold uppercase border ${
                          n.valide ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {n.valide ? 'Validé' : 'Ajourné'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

