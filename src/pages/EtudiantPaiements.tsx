import React from 'react';
import { useApp } from '../context/AppContext';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

export const EtudiantPaiements: React.FC = () => {
  const { currentEtudiant, activeAnnee, inscriptions, paiements, parametres } = useApp();

  if (!currentEtudiant) return null;

  const activeAnneeId = activeAnnee?.id || 1;
  const myInscription = (inscriptions || []).find(i => i.id_etudiant === currentEtudiant.id && i.id_annee_academique === activeAnneeId);
  const myPaiements = (paiements || []).filter(p => p.id_etudiant === currentEtudiant.id && p.id_annee_academique === activeAnneeId);

  const totalPaid = myPaiements.reduce((acc, p) => acc + p.montant, 0);
  const totalDue = myInscription ? myInscription.montant_total : 0;
  const remainingDebt = totalDue - totalPaid;

  const downloadReceipt = (p: any) => {
    const doc = new jsPDF({ format: 'a5', orientation: 'landscape' });

    doc.setFontSize(10);
    doc.text('RÉPUBLIQUE DU MALI - MESRS', 14, 15);
    doc.text(parametres.nom_universite, 14, 20);

    doc.setFontSize(14);
    doc.text(`REÇU DE PAIEMENT N° ${p.numero_recu}`, 14, 32);

    doc.setFontSize(9);
    doc.text(`Reçu de M./Mme : ${currentEtudiant.nom} ${currentEtudiant.prenom} (${currentEtudiant.matricule})`, 14, 42);
    doc.text(`Motif du Paiement : Frais de ${p.type_frais.toUpperCase()}`, 14, 48);
    doc.text(`Montant Réglé : ${p.montant.toLocaleString()} FCFA`, 14, 54);
    doc.text(`Mode de Règlement : ${p.mode_paiement.toUpperCase()} (Réf: ${p.reference_transaction})`, 14, 60);
    doc.text(`Date d'Encaissement : ${p.date_paiement}`, 14, 66);

    doc.text('Le Caissier Général', 120, 80);
    doc.text('Arouna SIDIBÉ', 120, 95);

    doc.save(`Recu_${p.numero_recu}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Mes Paiements & Situations Financières</h1>
        <p className="text-xs text-gray-400 mt-1">Historique des versements de scolarité pour l'année {activeAnnee?.libelle}</p>
      </div>

      {/* Account Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Montant Total Scolarité</div>
          <div className="text-xl font-bold text-gray-900 font-mono mt-1.5">{totalDue.toLocaleString()} FCFA</div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Versé à ce Jour</div>
          <div className="text-xl font-bold text-emerald-600 font-mono mt-1.5">{totalPaid.toLocaleString()} FCFA</div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reliquat / Reste à Payer</div>
          <div className="text-xl font-bold text-amber-600 font-mono mt-1.5">
            {remainingDebt === 0 ? 'Scolarité Solde à 100%' : `${remainingDebt.toLocaleString()} FCFA`}
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E5E7EB] bg-white">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Historique de mes Reçus Officiels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">N° Reçu</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Motif</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Montant Versé</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Mode de Paiement</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myPaiements.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono font-bold text-[#2563EB]">{p.numero_recu}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-gray-900 uppercase">{p.type_frais}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-emerald-600 font-mono">{p.montant.toLocaleString()} FCFA</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 font-mono">{p.mode_paiement} ({p.reference_transaction})</td>
                  <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">{p.date_paiement}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => downloadReceipt(p)}
                      className="px-3 py-1.5 bg-[#F8F9FA] hover:bg-blue-50 hover:text-[#2563EB] rounded-[8px] text-xs font-semibold text-gray-700 border border-[#E5E7EB] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Reçu PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

