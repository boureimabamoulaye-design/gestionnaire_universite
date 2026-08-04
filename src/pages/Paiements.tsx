import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, DollarSign, Download, Search } from 'lucide-react';
import jsPDF from 'jspdf';

export const Paiements: React.FC = () => {
  const { paiements, etudiants, inscriptions, activeAnnee, parametres, addPaiement } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAnneeId = activeAnnee?.id || 1;
  const [idEtudiant, setIdEtudiant] = useState<number>((etudiants || [])[0]?.id || 1);
  const [typeFrais, setTypeFrais] = useState<'inscription' | 'scolarite' | 'examen' | 'autre'>('scolarite');
  const [montant, setMontant] = useState(75000);
  const [modePaiement, setModePaiement] = useState<'especes' | 'orange_money' | 'moov_money' | 'virement' | 'cheque'>('orange_money');
  const [referenceTransaction, setReferenceTransaction] = useState('OM-882910');

  const activePaiements = (paiements || []).filter(p => p.id_annee_academique === activeAnneeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentInscription = (inscriptions || []).find(i => i.id_etudiant === idEtudiant && i.id_annee_academique === activeAnneeId);

    addPaiement({
      id_etudiant: Number(idEtudiant),
      id_inscription: studentInscription?.id || 1,
      id_annee_academique: activeAnneeId,
      type_frais: typeFrais,
      montant: Number(montant),
      date_paiement: new Date().toISOString().split('T')[0],
      mode_paiement: modePaiement,
      reference_transaction: referenceTransaction,
      statut: 'valide'
    });

    setIsModalOpen(false);
  };

  // Download PDF Receipt
  const downloadReceipt = (p: any) => {
    const etu = (etudiants || []).find(e => e.id === p.id_etudiant);
    const doc = new jsPDF({ format: 'a5', orientation: 'landscape' });

    doc.setFontSize(10);
    doc.text('RÉPUBLIQUE DU MALI - MESRS', 14, 15);
    doc.text(parametres.nom_universite, 14, 20);

    doc.setFontSize(14);
    doc.text(`REÇU DE PAIEMENT N° ${p.numero_recu}`, 14, 32);

    doc.setFontSize(9);
    doc.text(`Reçu de M./Mme : ${etu?.nom} ${etu?.prenom} (${etu?.matricule})`, 14, 42);
    doc.text(`Motif du Paiement : Frais de ${p.type_frais.toUpperCase()}`, 14, 48);
    doc.text(`Montant Réglé : ${p.montant.toLocaleString()} FCFA`, 14, 54);
    doc.text(`Mode de Règlement : ${p.mode_paiement.toUpperCase()} (Réf: ${p.reference_transaction})`, 14, 60);
    doc.text(`Date d'Encaissement : ${p.date_paiement}`, 14, 66);

    doc.text('Le Caissier Général', 120, 80);
    doc.text('Arouna SIDIBÉ', 120, 95);

    doc.save(`Recu_${p.numero_recu}.pdf`);
  };

  const filtered = activePaiements.filter(p => {
    const etu = (etudiants || []).find(e => e.id === p.id_etudiant);
    return (
      etu?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etu?.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.numero_recu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference_transaction.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Comptabilité & Encaissements</h1>
          <p className="text-xs text-gray-400 mt-1">Recouvrement des frais de scolarité, éditions des reçus officiels et suivi de trésorerie</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Paiement</span>
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
              placeholder="Rechercher par n° reçu, étudiant, réf..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Affichage de <strong className="text-gray-900">{filtered.length}</strong> encaissement(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">N° Reçu</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Étudiant</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Type de Frais</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Montant Versé</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Mode & Référence</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date Encaissement</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const etu = (etudiants || []).find(e => e.id === p.id_etudiant);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-[#2563EB] font-mono">{p.numero_recu}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">{etu?.nom} {etu?.prenom} ({etu?.matricule})</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase">{p.type_frais}</td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-600 font-mono">{p.montant.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{p.mode_paiement} ({p.reference_transaction})</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{p.date_paiement}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => downloadReceipt(p)}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Reçu PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enregistrer un Paiement">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Étudiant</label>
            <select
              value={idEtudiant}
              onChange={e => setIdEtudiant(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              {(etudiants || []).map(e => (
                <option key={e.id} value={e.id}>{e.matricule} - {e.nom} {e.prenom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type de Frais</label>
              <select
                value={typeFrais}
                onChange={e => setTypeFrais(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                <option value="scolarite">Scolarité / Inscription</option>
                <option value="examen">Frais d'Examen / Soutenance</option>
                <option value="autre">Autres Frais Académiques</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Montant Versé (FCFA)</label>
              <input
                type="number"
                value={montant}
                onChange={e => setMontant(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mode de Règlement</label>
              <select
                value={modePaiement}
                onChange={e => setModePaiement(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                <option value="orange_money">Orange Money</option>
                <option value="moov_money">Moov Money / Seneea</option>
                <option value="especes">Espèces (Caisse)</option>
                <option value="virement">Virement BDM / BNDA</option>
                <option value="cheque">Chèque Bancaire</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Référence Transaction</label>
              <input
                type="text"
                value={referenceTransaction}
                onChange={e => setReferenceTransaction(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
                placeholder="OM-8839201"
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
              Enregistrer & Éditer Reçu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

