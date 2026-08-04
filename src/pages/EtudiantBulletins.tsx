import React from 'react';
import { useApp } from '../context/AppContext';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const EtudiantBulletins: React.FC = () => {
  const { currentEtudiant, activeAnnee, matieres, notes, parametres, getEtudiantStats } = useApp();

  if (!currentEtudiant) return null;

  const stats = getEtudiantStats(currentEtudiant.id);
  const activeAnneeId = activeAnnee?.id || 1;
  const myNotes = (notes || []).filter(n => n.id_etudiant === currentEtudiant.id && n.id_annee_academique === activeAnneeId);

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text('RÉPUBLIQUE DU MALI', 14, 15);
    doc.setFontSize(8);
    doc.text('Un Peuple - Un But - Une Foi', 14, 20);
    doc.text(parametres.ministere, 14, 25);
    doc.text(parametres.nom_universite, 14, 30);

    doc.setFontSize(12);
    doc.text('RELEVÉ DE NOTES OFFICIEL', 14, 42);

    doc.setFontSize(9);
    doc.text(`Matricule : ${currentEtudiant.matricule}`, 14, 50);
    doc.text(`Nom & Prénom : ${currentEtudiant.nom} ${currentEtudiant.prenom}`, 14, 55);
    doc.text(`Année Académique : ${activeAnnee.libelle}`, 14, 60);

    const rows = myNotes.map(n => {
      const mat = matieres.find(m => m.id === n.id_matiere);
      return [
        mat?.code || '',
        mat?.nom || '',
        mat?.credits || '',
        mat?.coefficient || '',
        `${n.note_cc} / 20`,
        `${n.note_exam} / 20`,
        `${n.note_finale} / 20`,
        n.valide ? 'Validé' : 'Non validé'
      ];
    });

    autoTable(doc, {
      startY: 68,
      head: [['Code', 'Matière', 'Crédits', 'Coeff.', 'Note CC', 'Examen', 'Moyenne', 'Décision']],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    const finalY = (doc as any).lastAutoTable.previous.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Moyenne Générale : ${stats.moyenneGeneral} / 20`, 14, finalY);
    doc.text(`Total Crédits Validés : ${stats.creditsValides} ECTS`, 14, finalY + 6);
    doc.text(`Mention : ${stats.mention}`, 14, finalY + 12);

    doc.save(`Bulletin_${currentEtudiant.matricule}_${activeAnnee.libelle}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Mon Bulletin & Relevé Officiel</h1>
          <p className="text-xs text-gray-400 mt-1">Document numérique sécurisé délivré par le Rectorat</p>
        </div>
        <button
          onClick={handlePrintPDF}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger en PDF</span>
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-[18px] p-6 sm:p-8 max-w-4xl mx-auto space-y-6 shadow-xs">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-4 flex justify-between items-start text-xs">
          <div>
            <div className="font-bold text-gray-900">RÉPUBLIQUE DU MALI</div>
            <div className="text-[10px] text-gray-400">Un Peuple - Un But - Une Foi</div>
            <div className="font-bold text-[#2563EB] mt-1">{parametres.nom_universite}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">Année : {activeAnnee.libelle}</div>
            <div className="text-gray-400 text-[10px]">Bamako, le {new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-[14px] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Matricule</span>
            <span className="font-bold text-[#2563EB] font-mono text-sm">{currentEtudiant.matricule}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Nom & Prénom</span>
            <span className="font-bold text-gray-900">{currentEtudiant.nom} {currentEtudiant.prenom}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Moyenne</span>
            <span className="font-extrabold text-[#2563EB] font-mono text-sm">{stats.moyenneGeneral} / 20</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Mention</span>
            <span className="font-bold text-emerald-600">{stats.mention}</span>
          </div>
        </div>

        {/* Notes Table */}
        <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F8F9FA] text-gray-500 font-bold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 border-r border-[#E5E7EB] text-[10px] uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 border-r border-[#E5E7EB] text-[10px] uppercase tracking-wider">Matière</th>
                <th className="px-4 py-3 border-r border-[#E5E7EB] text-center text-[10px] uppercase tracking-wider">Crédits</th>
                <th className="px-4 py-3 border-r border-[#E5E7EB] text-center text-[10px] uppercase tracking-wider">Note CC</th>
                <th className="px-4 py-3 border-r border-[#E5E7EB] text-center text-[10px] uppercase tracking-wider">Examen</th>
                <th className="px-4 py-3 border-r border-[#E5E7EB] text-center text-[10px] uppercase tracking-wider">Moyenne</th>
                <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-gray-700">
              {myNotes.map(n => {
                const mat = matieres.find(m => m.id === n.id_matiere);
                return (
                  <tr key={n.id}>
                    <td className="px-4 py-3 border-r border-[#E5E7EB] font-mono font-bold text-[#2563EB]">{mat?.code}</td>
                    <td className="px-4 py-3 border-r border-[#E5E7EB] font-bold text-gray-900">{mat?.nom}</td>
                    <td className="px-4 py-3 border-r border-[#E5E7EB] text-center font-mono font-semibold text-emerald-600">{mat?.credits}</td>
                    <td className="px-4 py-3 border-r border-[#E5E7EB] text-center font-mono">{n.note_cc}</td>
                    <td className="px-4 py-3 border-r border-[#E5E7EB] text-center font-mono">{n.note_exam}</td>
                    <td className="px-4 py-3 border-r border-[#E5E7EB] text-center font-bold font-mono text-gray-900">{n.note_finale} / 20</td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className={`px-2.5 py-1 rounded-[8px] text-[10px] font-bold uppercase border ${
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

