import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export const Matieres: React.FC = () => {
  const { matieres, filieres, niveaux, semestres, enseignants, addMatiere, updateMatiere, deleteMatiere } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [idFiliere, setIdFiliere] = useState<number>(filieres[0]?.id || 1);
  const [idNiveau, setIdNiveau] = useState<number>(niveaux[0]?.id || 1);
  const [idSemestre, setIdSemestre] = useState<number>(semestres[0]?.id || 1);
  const [idEnseignant, setIdEnseignant] = useState<number>(enseignants[0]?.id || 1);
  const [code, setCode] = useState('');
  const [nom, setNom] = useState('');
  const [credits, setCredits] = useState(6);
  const [coefficient, setCoefficient] = useState(3);

  const openAdd = () => {
    setEditingId(null);
    setIdFiliere(filieres[0]?.id || 1);
    setIdNiveau(niveaux[0]?.id || 1);
    setIdSemestre(semestres[0]?.id || 1);
    setIdEnseignant(enseignants[0]?.id || 1);
    setCode('');
    setNom('');
    setCredits(6);
    setCoefficient(3);
    setIsModalOpen(true);
  };

  const openEdit = (m: any) => {
    setEditingId(m.id);
    setIdFiliere(m.id_filiere);
    setIdNiveau(m.id_niveau);
    setIdSemestre(m.id_semestre);
    setIdEnseignant(m.id_enseignant);
    setCode(m.code);
    setNom(m.nom);
    setCredits(m.credits);
    setCoefficient(m.coefficient);
    setIsModalOpen(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (editingId) {
      updateMatiere(editingId, { id_filiere: Number(idFiliere), id_niveau: Number(idNiveau), id_semestre: Number(idSemestre), id_enseignant: Number(idEnseignant), code, nom, credits: Number(credits), coefficient: Number(coefficient) });
    } else {
      addMatiere({ id_filiere: Number(idFiliere), id_niveau: Number(idNiveau), id_semestre: Number(idSemestre), id_enseignant: Number(idEnseignant), code, nom, credits: Number(credits), coefficient: Number(coefficient) });
    }
    setIsModalOpen(false);
  };

  const filtered = (matieres || []).filter(m =>
    m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Matières & Unités d'Enseignement</h1>
          <p className="text-xs text-gray-400 mt-1">Modules de cours rattachés aux filières, crédits ECTS et coefficients LMD</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Matière</span>
        </button>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par intitulé, code..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Affichage de <strong className="text-gray-900">{filtered.length}</strong> matière(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Intitulé de la Matière</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Filière</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Semestre</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Crédits ECTS</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Coeff.</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Enseignant Responsable</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(m => {
                const fil = (filieres || []).find(f => f.id === m.id_filiere);
                const sem = (semestres || []).find(s => s.id === m.id_semestre);
                const ens = (enseignants || []).find(e => e.id === m.id_enseignant);
                return (
                  <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-[#2563EB] font-mono">{m.code}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">{m.nom}</td>
                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">{fil?.code}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{sem?.code}</td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-600 font-mono">{m.credits} ECTS</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700 font-mono">{m.coefficient}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{ens ? `${ens.nom} ${ens.prenom}` : 'Non assigné'}</td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(m)}
                        className="p-1.5 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-[8px] transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMatiere(m.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[8px] transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier la Matière" : "Ajouter une Matière"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Filière</label>
              <select
                value={idFiliere}
                onChange={e => setIdFiliere(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(filieres || []).map(f => (
                  <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Niveau</label>
              <select
                value={idNiveau}
                onChange={e => setIdNiveau(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(niveaux || []).map(n => (
                  <option key={n.id} value={n.id}>{n.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Semestre</label>
              <select
                value={idSemestre}
                onChange={e => setIdSemestre(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(semestres || []).map(s => (
                  <option key={s.id} value={s.id}>{s.code} ({s.nom})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Code Matière</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
                placeholder="INF101"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enseignant Responsable</label>
              <select
                value={idEnseignant}
                onChange={e => setIdEnseignant(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(enseignants || []).map(e => (
                  <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Intitulé complet de la matière</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              placeholder="Algorithmique et Programmation C"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Crédits LMD (ECTS)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={credits}
                onChange={e => setCredits(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Coefficient</label>
              <input
                type="number"
                min="1"
                max="10"
                value={coefficient}
                onChange={e => setCoefficient(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
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

