import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, CheckCircle2, Calendar } from 'lucide-react';

export const AnneesAcademiques: React.FC = () => {
  const { annees, activeAnnee, toggleActiveAnnee, addAnnee } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [libelle, setLibelle] = useState('2026-2027');
  const [dateDebut, setDateDebut] = useState('2026-10-01');
  const [dateFin, setDateFin] = useState('2027-07-31');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnee({ libelle, date_debut: dateDebut, date_fin: dateFin, active: false });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Années Académiques</h1>
          <p className="text-xs text-gray-400 mt-1">Gestion des périodes scolaires. Une seule année académique active à la fois.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Année Académique</span>
        </button>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Libellé</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date Début</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date Fin</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(annees || []).map(a => (
                <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-mono text-sm">{a.libelle}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-mono">{a.date_debut}</td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-mono">{a.date_fin}</td>
                  <td className="px-6 py-4 text-xs">
                    {a.active ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active actuellement</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-[8px] text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!a.active && (
                      <button
                        onClick={() => toggleActiveAnnee(a.id)}
                        className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-[10px] text-xs font-semibold transition-colors"
                      >
                        Définir comme Active
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Année Académique">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Libellé (Ex: 2026-2027)</label>
            <input
              type="text"
              value={libelle}
              onChange={e => setLibelle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              placeholder="2026-2027"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date Début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={e => setDateDebut(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date Fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={e => setDateFin(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[12px] text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

