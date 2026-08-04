import React from 'react';
import { useApp } from '../context/AppContext';

export const EtudiantNotes: React.FC = () => {
  const { currentEtudiant, activeAnnee, matieres, notes } = useApp();

  if (!currentEtudiant) return null;

  const activeAnneeId = activeAnnee?.id || 1;
  const myNotes = (notes || []).filter(n => n.id_etudiant === currentEtudiant.id && n.id_annee_academique === activeAnneeId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Mes Notes & Évaluations</h1>
        <p className="text-xs text-gray-400 mt-1">Relevé détaillé des notes de Contrôle Continu (CC) et Examen pour l'année {activeAnnee?.libelle}</p>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matière</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Crédits</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Coeff.</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Note CC (/20)</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Examen (/20)</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Moyenne Finale</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myNotes.map(n => {
                const mat = matieres.find(m => m.id === n.id_matiere);
                return (
                  <tr key={n.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono font-bold text-[#2563EB]">{mat?.code}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-gray-900">{mat?.nom}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-emerald-600 font-mono">{mat?.credits} ECTS</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-600 font-mono">{mat?.coefficient}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-700 font-mono">{n.note_cc}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-700 font-mono">{n.note_exam}</td>
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

