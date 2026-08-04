import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const EtudiantDashboard: React.FC = () => {
  const { currentEtudiant, activeAnnee, inscriptions, matieres, notes, paiements, getEtudiantStats } = useApp();

  if (!currentEtudiant) return null;

  const stats = getEtudiantStats(currentEtudiant.id);
  const activeAnneeId = activeAnnee?.id || 1;
  const myInscription = (inscriptions || []).find(i => i.id_etudiant === currentEtudiant.id && i.id_annee_academique === activeAnneeId);
  const myNotes = (notes || []).filter(n => n.id_etudiant === currentEtudiant.id && n.id_annee_academique === activeAnneeId);
  const myPaiements = (paiements || []).filter(p => p.id_etudiant === currentEtudiant.id && p.id_annee_academique === activeAnneeId);

  const totalPaid = myPaiements.reduce((acc, p) => acc + p.montant, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-[18px] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#2563EB] tracking-wider block">Portail Étudiant</span>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Bienvenue, {currentEtudiant.prenom} {currentEtudiant.nom}</h1>
          <p className="text-xs text-gray-400">
            Matricule : <span className="font-mono font-bold text-gray-700">{currentEtudiant.matricule}</span> &bull; Session Universitaire {activeAnnee?.libelle}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-100 rounded-[12px] text-emerald-700 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Inscription Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Moyenne Générale</div>
          <div className="text-2xl font-bold text-[#2563EB] font-mono mt-1.5">{stats.moyenneGeneral} / 20</div>
          <div className="text-[11px] text-gray-400 mt-1 font-medium">Mention : {stats.mention}</div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Crédits Capitalisés</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1.5">{stats.creditsValides} ECTS</div>
          <div className="text-[11px] text-gray-400 mt-1 font-medium">Validés sur l'année</div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Scolarité Réglée</div>
          <div className="text-xl font-bold text-gray-900 font-mono mt-1.5">{totalPaid.toLocaleString()} FCFA</div>
          <div className="text-[11px] text-gray-400 mt-1 font-mono">
            Reste : {(myInscription ? myInscription.montant_total - totalPaid : 0).toLocaleString()} FCFA
          </div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Résultat Académique</div>
          <div className="text-xl font-bold text-gray-900 mt-1.5">{stats.decision}</div>
          <div className="text-[11px] text-gray-400 mt-1 font-medium">Avis Officiel du Jury</div>
        </div>
      </div>

      {/* Current Academic Notes Summary */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E5E7EB] bg-white">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Aperçu de mes Dernières Notes Saisies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matière</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Note CC</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Examen</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Moyenne</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myNotes.map(n => {
                const mat = matieres.find(m => m.id === n.id_matiere);
                return (
                  <tr key={n.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono font-bold text-[#2563EB]">{mat?.code}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-gray-900">{mat?.nom}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">{n.note_cc} / 20</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">{n.note_exam} / 20</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-gray-900 font-mono">{n.note_finale} / 20</td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold uppercase border ${
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
  );
};

