import {
  ParametresSysteme,
  AnneeAcademique,
  Administrateur,
  Universite,
  Faculte,
  Filiere,
  Niveau,
  Semestre,
  Classe,
  Enseignant,
  Matiere,
  Etudiant,
  Inscription,
  Note,
  Paiement
} from '../types';

export const initialParametres: ParametresSysteme = {
  id: 1,
  nom_universite: 'Université des Sciences, des Techniques et des Technologies de Bamako',
  sigle: 'USTTB',
  adresse: 'Colline de Badalabougou, BP E 423, Bamako, Mali',
  telephone: '+223 20 22 32 44',
  email: 'contact@usttb.edu.ml',
  logo: 'logo_usttb.png',
  ministere: 'Ministère de l\'Enseignement Supérieur et de la Recherche Scientifique',
  devise_pays: 'Un Peuple - Un But - Une Foi'
};

export const initialAnnees: AnneeAcademique[] = [
  { id: 1, libelle: '2025-2026', date_debut: '2025-10-01', date_fin: '2026-07-31', active: true },
  { id: 2, libelle: '2026-2027', date_debut: '2026-10-01', date_fin: '2027-07-31', active: false }
];

export const initialAdmins: Administrateur[] = [
  { id: 1, nom: 'DIARRA', prenom: 'Moussa', email: 'admin@universite.ml', role: 'Super Administrateur', statut: 'actif' }
];

export const initialUniversites: Universite[] = [
  { id: 1, code: 'USTTB', nom: 'Université des Sciences, des Techniques et des Technologies de Bamako', ville: 'Bamako', adresse: 'Colline de Badalabougou', telephone: '+223 20 22 32 44', email: 'contact@usttb.edu.ml', recteur: 'Pr. Ouaténi DIALLO', statut: 'actif' },
  { id: 2, code: 'ULSHB', nom: 'Université des Lettres et des Sciences Humaines de Bamako', ville: 'Bamako', adresse: 'Kabala', telephone: '+223 20 23 11 00', email: 'contact@ulshb.edu.ml', recteur: 'Pr. Idrissa Soïba TRAORE', statut: 'actif' },
  { id: 3, code: 'USJPB', nom: 'Université des Sciences Juridiques et Politiques de Bamako', ville: 'Bamako', adresse: 'Sogoniko', telephone: '+223 20 28 55 12', email: 'contact@usjpb.edu.ml', recteur: 'Pr. Bouréma KANÉ', statut: 'actif' }
];

export const initialFacultes: Faculte[] = [
  { id: 1, id_universite: 1, code: 'FST', nom: 'Faculté des Sciences et Techniques', doyen: 'Pr. Fana TANGARA', contact: '+223 20 22 00 11', statut: 'actif' },
  { id: 2, id_universite: 1, code: 'FMOS', nom: 'Faculté de Médecine et d\'Odontostomatologie', doyen: 'Pr. Seydou DOUMBOUYA', contact: '+223 20 22 33 44', statut: 'actif' },
  { id: 3, id_universite: 1, code: 'FAPH', nom: 'Faculté de Pharmacie', doyen: 'Pr. Boubacar TRAORÉ', contact: '+223 20 22 55 66', statut: 'actif' }
];

export const initialNiveaux: Niveau[] = [
  { id: 1, code: 'L1', nom: 'Licence 1', ordre: 1 },
  { id: 2, code: 'L2', nom: 'Licence 2', ordre: 2 },
  { id: 3, code: 'L3', nom: 'Licence 3', ordre: 3 },
  { id: 4, code: 'M1', nom: 'Master 1', ordre: 4 },
  { id: 5, code: 'M2', nom: 'Master 2', ordre: 5 }
];

export const initialSemestres: Semestre[] = [
  { id: 1, code: 'S1', nom: 'Semestre 1', id_niveau: 1, ordre: 1 },
  { id: 2, code: 'S2', nom: 'Semestre 2', id_niveau: 1, ordre: 2 },
  { id: 3, code: 'S3', nom: 'Semestre 3', id_niveau: 2, ordre: 3 },
  { id: 4, code: 'S4', nom: 'Semestre 4', id_niveau: 2, ordre: 4 },
  { id: 5, code: 'S5', nom: 'Semestre 5', id_niveau: 3, ordre: 5 },
  { id: 6, code: 'S6', nom: 'Semestre 6', id_niveau: 3, ordre: 6 }
];

export const initialFilieres: Filiere[] = [
  { id: 1, id_faculte: 1, code: 'INFO', nom: 'Informatique et Génie Logiciel', description: 'Développement d\'applications, réseaux, BD et IA', duree_annees: 3, statut: 'actif' },
  { id: 2, id_faculte: 1, code: 'MATH', nom: 'Mathématiques Appliquées', description: 'Statistiques, recherche opérationnelle', duree_annees: 3, statut: 'actif' },
  { id: 3, id_faculte: 1, code: 'PHYS', nom: 'Physique Appliquée & Énergies', description: 'Énergies renouvelables, télécoms', duree_annees: 3, statut: 'actif' }
];

export const initialClasses: Classe[] = [
  { id: 1, id_filiere: 1, id_niveau: 1, code: 'L1-INFO-A', nom: 'Licence 1 Informatique - Groupe A', effectif_max: 60 },
  { id: 2, id_filiere: 1, id_niveau: 2, code: 'L2-INFO-A', nom: 'Licence 2 Informatique - Groupe A', effectif_max: 50 },
  { id: 3, id_filiere: 1, id_niveau: 3, code: 'L3-INFO-A', nom: 'Licence 3 Informatique - Groupe A', effectif_max: 40 }
];

export const initialEnseignants: Enseignant[] = [
  { id: 1, matricule: 'ENS-001', nom: 'COULIBALY', prenom: 'Ousmane', email: 'o.coulibaly@usttb.edu.ml', telephone: '+223 76 12 34 56', specialite: 'Base de données & Algorithmique', grade: 'Professeur Titulaire', statut: 'permanent', date_embauche: '2015-09-01' },
  { id: 2, matricule: 'ENS-002', nom: 'SANOGO', prenom: 'Awa', email: 'a.sanogo@usttb.edu.ml', telephone: '+223 66 98 76 54', specialite: 'Réseaux & Sécurité Informatique', grade: 'Maître de Conférences', statut: 'permanent', date_embauche: '2018-01-15' },
  { id: 3, matricule: 'ENS-003', nom: 'CISSE', prenom: 'Mamadou', email: 'm.cisse@usttb.edu.ml', telephone: '+223 70 11 22 33', specialite: 'Analyse Mathématique', grade: 'Assistant', statut: 'vacataire', date_embauche: '2021-10-01' }
];

export const initialMatieres: Matiere[] = [
  { id: 1, id_filiere: 1, id_niveau: 1, id_semestre: 1, code: 'INF101', nom: 'Algorithmique et Programmation C', credits: 6, coefficient: 3, id_enseignant: 1 },
  { id: 2, id_filiere: 1, id_niveau: 1, id_semestre: 1, code: 'INF102', nom: 'Architecture des Ordinateurs', credits: 4, coefficient: 2, id_enseignant: 2 },
  { id: 3, id_filiere: 1, id_niveau: 1, id_semestre: 1, code: 'MAT101', nom: 'Analyse Mathématique I', credits: 5, coefficient: 2, id_enseignant: 3 },
  { id: 4, id_filiere: 1, id_niveau: 1, id_semestre: 2, code: 'INF103', nom: 'Bases de Données Relationnelles', credits: 6, coefficient: 3, id_enseignant: 1 },
  { id: 5, id_filiere: 1, id_niveau: 1, id_semestre: 2, code: 'INF104', nom: 'Réseaux Informatiques de Base', credits: 5, coefficient: 2, id_enseignant: 2 }
];

export const initialEtudiants: Etudiant[] = [
  { id: 1, matricule: '2025-001', nom: 'KEITA', prenom: 'Amadou', email: 'amadou.keita@etudiant.ml', telephone: '+223 70 00 11 22', date_naissance: '2003-05-14', lieu_naissance: 'Bamako', genre: 'M', adresse: 'Badalabougou Rue 12', photo: '', statut: 'actif', mot_de_passe: 'etudiant123' },
  { id: 2, matricule: '2025-002', nom: 'TRAORE', prenom: 'Fatoumata', email: 'fatou.traore@etudiant.ml', telephone: '+223 75 44 33 22', date_naissance: '2004-09-20', lieu_naissance: 'Ségou', genre: 'F', adresse: 'Kalaban Coro', photo: '', statut: 'actif', mot_de_passe: 'etudiant123' },
  { id: 3, matricule: '2025-003', nom: 'TOURE', prenom: 'Ibrahima', email: 'ibrahim.toure@etudiant.ml', telephone: '+223 66 11 88 99', date_naissance: '2002-12-01', lieu_naissance: 'Sikasso', genre: 'M', adresse: 'Hamdallaye ACI 2000', photo: '', statut: 'actif', mot_de_passe: 'etudiant123' }
];

export const initialInscriptions: Inscription[] = [
  { id: 1, id_etudiant: 1, id_annee_academique: 1, id_filiere: 1, id_niveau: 1, id_classe: 1, date_inscription: '2025-10-05', montant_total: 150000, montant_paye: 150000, statut: 'validee' },
  { id: 2, id_etudiant: 2, id_annee_academique: 1, id_filiere: 1, id_niveau: 1, id_classe: 1, date_inscription: '2025-10-06', montant_total: 150000, montant_paye: 75000, statut: 'validee' },
  { id: 3, id_etudiant: 3, id_annee_academique: 1, id_filiere: 1, id_niveau: 1, id_classe: 1, date_inscription: '2025-10-10', montant_total: 150000, montant_paye: 150000, statut: 'validee' }
];

export const initialNotes: Note[] = [
  { id: 1, id_etudiant: 1, id_matiere: 1, id_annee_academique: 1, id_semestre: 1, note_cc: 14.5, note_exam: 15.0, note_finale: 14.8, valide: true, date_saisie: '2026-02-10' },
  { id: 2, id_etudiant: 1, id_matiere: 2, id_annee_academique: 1, id_semestre: 1, note_cc: 12.0, note_exam: 13.5, note_finale: 12.9, valide: true, date_saisie: '2026-02-10' },
  { id: 3, id_etudiant: 1, id_matiere: 3, id_annee_academique: 1, id_semestre: 1, note_cc: 11.0, note_exam: 10.0, note_finale: 10.4, valide: true, date_saisie: '2026-02-10' },

  { id: 4, id_etudiant: 2, id_matiere: 1, id_annee_academique: 1, id_semestre: 1, note_cc: 16.0, note_exam: 17.0, note_finale: 16.6, valide: true, date_saisie: '2026-02-10' },
  { id: 5, id_etudiant: 2, id_matiere: 2, id_annee_academique: 1, id_semestre: 1, note_cc: 15.0, note_exam: 14.0, note_finale: 14.4, valide: true, date_saisie: '2026-02-10' },
  { id: 6, id_etudiant: 2, id_matiere: 3, id_annee_academique: 1, id_semestre: 1, note_cc: 13.5, note_exam: 15.0, note_finale: 14.4, valide: true, date_saisie: '2026-02-10' }
];

export const initialPaiements: Paiement[] = [
  { id: 1, numero_recu: 'REC-2025-001', id_etudiant: 1, id_inscription: 1, id_annee_academique: 1, type_frais: 'scolarite', montant: 150000, date_paiement: '2025-10-05', mode_paiement: 'orange_money', reference_transaction: 'OM-8839201', statut: 'valide' },
  { id: 2, numero_recu: 'REC-2025-002', id_etudiant: 2, id_inscription: 2, id_annee_academique: 1, type_frais: 'scolarite', montant: 75000, date_paiement: '2025-10-06', mode_paiement: 'especes', reference_transaction: 'ESP-00921', statut: 'valide' },
  { id: 3, numero_recu: 'REC-2025-003', id_etudiant: 3, id_inscription: 3, id_annee_academique: 1, type_frais: 'scolarite', montant: 150000, date_paiement: '2025-10-10', mode_paiement: 'moov_money', reference_transaction: 'MV-332910', statut: 'valide' }
];
