import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Trash2, Search, UserCheck } from 'lucide-react';

export const Enseignants: React.FC = () => {
  const { enseignants, addEnseignant, updateEnseignant, deleteEnseignant } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [grade, setGrade] = useState('Professeur Titulaire');
  const [statut, setStatut] = useState<'permanent' | 'vacataire'>('permanent');

  const openAdd = () => {
    setEditingId(null);
    setMatricule(`ENS-${Math.floor(100 + Math.random() * 900)}`);
    setNom('');
    setPrenom('');
    setEmail('');
    setTelephone('+223 ');
    setSpecialite('');
    setGrade('Professeur Titulaire');
    setStatut('permanent');
    setIsModalOpen(true);
  };

  const openEdit = (e: any) => {
    setEditingId(e.id);
    setMatricule(e.matricule);
    setNom(e.nom);
    setPrenom(e.prenom);
    setEmail(e.email);
    setTelephone(e.telephone);
    setSpecialite(e.specialite);
    setGrade(e.grade);
    setStatut(e.statut);
    setIsModalOpen(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (editingId) {
      updateEnseignant(editingId, { matricule, nom, prenom, email, telephone, specialite, grade, statut });
    } else {
      addEnseignant({ matricule, nom, prenom, email, telephone, specialite, grade, statut, date_embauche: '2020-01-01' });
    }
    setIsModalOpen(false);
  };

  const filtered = (enseignants || []).filter(e =>
    e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.specialite.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Gestion du Corps Enseignant</h1>
          <p className="text-xs text-gray-400 mt-1">Professeurs titulaires, maîtres de conférences et intervenants vacataires</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Enseignant</span>
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
              placeholder="Filtrer par nom, matricule, spécialité..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Affichage de <strong className="text-gray-900">{filtered.length}</strong> enseignant(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matricule</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Nom & Prénom</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Grade</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Spécialité</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#2563EB] font-mono">{e.matricule}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{e.nom} {e.prenom}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-700">{e.grade}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{e.specialite}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{e.telephone} &bull; {e.email}</td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <span className={`px-2.5 py-1 rounded-[8px] border text-[11px] capitalize ${
                      e.statut === 'permanent'
                        ? 'bg-blue-50 text-[#2563EB] border-blue-100'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {e.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(e)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1 transition-colors mr-2"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => deleteEnseignant(e.id)}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier l'Enseignant" : "Ajouter un Enseignant"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Matricule</label>
              <input
                type="text"
                value={matricule}
                onChange={e => setMatricule(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Statut Contractuel</label>
              <select
                value={statut}
                onChange={e => setStatut(e.target.value as 'permanent' | 'vacataire')}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                <option value="permanent">Permanent</option>
                <option value="vacataire">Vacataire</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="COULIBALY"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="Ousmane"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Grade Académique</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                <option value="Professeur Titulaire">Professeur Titulaire</option>
                <option value="Maître de Conférences">Maître de Conférences</option>
                <option value="Assistant">Assistant</option>
                <option value="Chargé de cours">Chargé de cours</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Spécialité</label>
              <input
                type="text"
                value={specialite}
                onChange={e => setSpecialite(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="Algorithmique & BD"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="o.coulibaly@usttb.edu.ml"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone</label>
              <input
                type="text"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="+223 76 12 34 56"
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

