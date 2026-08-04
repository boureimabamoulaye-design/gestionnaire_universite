import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Printer, Award, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Bulletins: React.FC = () => {
  const { etudiants, matieres, notes, activeAnnee, semestres, parametres, getEtudiantStats } = useApp();
  const activeAnneeId = activeAnnee?.id || 1;
  const [selectedEtudiantId, setSelectedEtudiantId] = useState<number>((etudiants || [])[0]?.id || 1);

  const selectedEtudiant = (etudiants || []).find(e => e.id === selectedEtudiantId);
  const stats = getEtudiantStats(selectedEtudiantId);

  // Notes for this student
  const studentNotes = (notes || []).filter(n => n.id_etudiant === selectedEtudiantId && n.id_annee_academique === activeAnneeId);

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text('RÉPUBLIQUE DU MALI', 14, 15);
    doc.setFontSize(8);
    doc.text('Un Peuple - Un But - Une Foi', 14, 20);
    doc.text(parametres.ministere, 14, 25);
    doc.text(parametres.nom_universite, 14, 30);

    doc.setFontSize(12);
    doc.text('RELEVÉ DE NOTES ET BULLETIN SEMESTRIEL', 14, 42);

    doc.setFontSize(9);
    doc.text(`Matricule : ${selectedEtudiant?.matricule}`, 14, 50);
    doc.text(`Nom & Prénom : ${selectedEtudiant?.nom} ${selectedEtudiant?.prenom}`, 14, 55);
    doc.text(`Année Académique : ${activeAnnee.libelle}`, 14, 60);

    const rows = studentNotes.map(n => {
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
    doc.text(`Résultat Officiel : ${stats.decision}`, 14, finalY + 18);

    doc.save(`Bulletin_${selectedEtudiant?.matricule}_${activeAnnee.libelle}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Bulletins & Transcripts Officiels</h1>
          <p className="text-xs text-gray-400 mt-1">Relevés de notes et bulletins semestriels conformes au système LMD national</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedEtudiantId}
            onChange={e => setSelectedEtudiantId(Number(e.target.value))}
            className="px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
          >
            {(etudiants || []).map(e => (
              <option key={e.id} value={e.id}>{e.matricule} - {e.nom} {e.prenom}</option>
            ))}
          </select>

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Bulletin PDF</span>
          </button>
        </div>
      </div>

      {/* Official Bulletin Document Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-[18px] shadow-xs p-8 max-w-4xl mx-auto space-y-6">
        {/* Header Government */}
        <div className="border-b border-[#E5E7EB] pb-6 flex flex-col sm:flex-row items-start justify-between gap-4 text-xs">
          <div>
            <div className="font-bold uppercase text-gray-900 tracking-wider">RÉPUBLIQUE DU MALI</div>
            <div className="text-[11px] text-gray-400 italic">Un Peuple - Un But - Une Foi</div>
            <div className="font-medium text-gray-700 mt-2">{parametres.ministere}</div>
            <div className="font-bold text-[#2563EB] text-sm mt-0.5">{parametres.nom_universite} ({parametres.sigle})</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 font-mono text-[11px]">Réf : BUL-{activeAnnee.libelle}-{selectedEtudiant?.matricule}</div>
            <div className="font-bold text-gray-900 mt-1">Année Académique : {activeAnnee.libelle}</div>
            <div className="text-gray-400 text-[11px]">Bamako, le {new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        {/* Student Info Box */}
        <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-[14px] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Matricule</span>
            <span className="font-bold text-[#2563EB] font-mono text-sm">{selectedEtudiant?.matricule}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Nom & Prénom</span>
            <span className="font-bold text-gray-900 text-sm">{selectedEtudiant?.nom} {selectedEtudiant?.prenom}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Date & Lieu de Naissance</span>
            <span className="font-medium text-gray-700">{selectedEtudiant?.date_naissance} à {selectedEtudiant?.lieu_naissance}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Genre</span>
            <span className="font-bold text-gray-900">{selectedEtudiant?.genre}</span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto rounded-[14px] border border-[#E5E7EB]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#F8F9FA] text-gray-500 font-bold border-b border-[#E5E7EB]">
              <tr>
                <th className="p-3 border-r border-[#E5E7EB] font-bold uppercase tracking-wider text-[10px]">Code</th>
                <th className="p-3 border-r border-[#E5E7EB] font-bold uppercase tracking-wider text-[10px]">Matière / Unité d'Enseignement</th>
                <th className="p-3 border-r border-[#E5E7EB] text-center font-bold uppercase tracking-wider text-[10px]">Crédits</th>
                <th className="p-3 border-r border-[#E5E7EB] text-center font-bold uppercase tracking-wider text-[10px]">Coeff.</th>
                <th className="p-3 border-r border-[#E5E7EB] text-center font-bold uppercase tracking-wider text-[10px]">Note CC</th>
                <th className="p-3 border-r border-[#E5E7EB] text-center font-bold uppercase tracking-wider text-[10px]">Examen</th>
                <th className="p-3 border-r border-[#E5E7EB] text-center font-bold uppercase tracking-wider text-[10px]">Moyenne</th>
                <th className="p-3 text-center font-bold uppercase tracking-wider text-[10px]">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {studentNotes.map(n => {
                const mat = (matieres || []).find(m => m.id === n.id_matiere);
                return (
                  <tr key={n.id} className="hover:bg-gray-50/50">
                    <td className="p-3 border-r border-gray-100 font-mono font-bold text-[#2563EB]">{mat?.code}</td>
                    <td className="p-3 border-r border-gray-100 font-bold text-gray-900">{mat?.nom}</td>
                    <td className="p-3 border-r border-gray-100 text-center font-bold text-gray-700">{mat?.credits}</td>
                    <td className="p-3 border-r border-gray-100 text-center text-gray-600">{mat?.coefficient}</td>
                    <td className="p-3 border-r border-gray-100 text-center font-mono">{n.note_cc}</td>
                    <td className="p-3 border-r border-gray-100 text-center font-mono">{n.note_exam}</td>
                    <td className="p-3 border-r border-gray-100 text-center font-bold text-gray-900 font-mono">{n.note_finale} / 20</td>
                    <td className="p-3 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold ${
                        n.valide ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
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

        {/* Results Summary Box */}
        <div className="border border-[#E5E7EB] rounded-[14px] p-5 bg-[#F8F9FA] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-gray-400 font-semibold text-[11px]">Moyenne Générale</div>
            <div className="text-xl font-extrabold text-[#2563EB] font-mono mt-0.5">{stats.moyenneGeneral} / 20</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold text-[11px]">Crédits Capitalisés</div>
            <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{stats.creditsValides} ECTS</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold text-[11px]">Mention Obtenue</div>
            <div className="text-base font-bold text-gray-900 mt-0.5">{stats.mention}</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold text-[11px]">Décision du Jury</div>
            <div className="mt-1">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-[8px] ${
                stats.decision === 'Admis' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {stats.decision}
              </span>
            </div>
          </div>
        </div>

        {/* Official Signature Footer */}
        <div className="pt-8 flex justify-between items-end text-xs text-gray-600 border-t border-[#E5E7EB]">
          <div>
            <div className="font-semibold text-gray-500">Le Chef du Service de la Scolarité</div>
            <div className="mt-12 font-bold text-gray-900">Dr. Souleymane DIABATÉ</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-500">Le Doyen / Directeur d'UFR</div>
            <div className="mt-12 font-bold text-gray-900">Pr. Fana TANGARA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

