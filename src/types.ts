export type UserType = 'admin' | 'etudiant';

export interface ParametresSysteme {
  id: number;
  nom_universite: string;
  sigle: string;
  adresse: string;
  telephone: string;
  email: string;
  logo: string;
  ministere: string;
  devise_pays: string;
}

export interface AnneeAcademique {
  id: number;
  libelle: string; // ex: '2025-2026'
  date_debut: string;
  date_fin: string;
  active: boolean;
}

export interface Administrateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  statut: 'actif' | 'inactif';
}

export interface Universite {
  id: number;
  code: string;
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  email: string;
  recteur: string;
  statut: 'actif' | 'inactif';
}

export interface Faculte {
  id: number;
  id_universite: number;
  code: string;
  nom: string;
  doyen: string;
  contact: string;
  statut: 'actif' | 'inactif';
}

export interface Filiere {
  id: number;
  id_faculte?: number;
  code: string;
  nom: string;
  description: string;
  duree_annees?: number;
  statut: 'actif' | 'inactif';
}

export interface Niveau {
  id: number;
  code: string; // L1, L2, L3, M1, M2
  nom: string;
  ordre: number;
}

export interface Semestre {
  id: number;
  code: string; // S1..S6
  nom: string;
  id_niveau: number;
  ordre: number;
}

export interface Classe {
  id: number;
  id_filiere: number;
  id_niveau: number;
  code: string;
  nom: string;
  effectif_max: number;
}

export interface Enseignant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  grade: string;
  statut: 'permanent' | 'vacataire';
  date_embauche: string;
}

export interface Matiere {
  id: number;
  id_filiere: number;
  id_niveau: number;
  id_semestre: number;
  code: string;
  nom: string;
  credits: number;
  coefficient: number;
  id_enseignant: number;
}

export interface Etudiant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance: string;
  lieu_naissance: string;
  genre: 'M' | 'F';
  adresse: string;
  photo: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  mot_de_passe?: string;
}

export interface Inscription {
  id: number;
  id_etudiant: number;
  id_annee_academique: number;
  id_filiere: number;
  id_niveau: number;
  id_classe: number;
  date_inscription: string;
  montant_total: number;
  montant_paye: number;
  statut: 'validee' | 'en_attente' | 'annulee';
}

export interface Note {
  id: number;
  id_etudiant: number;
  id_matiere: number;
  id_annee_academique: number;
  id_semestre: number;
  note_cc: number;
  note_exam: number;
  note_rattrapage?: number;
  note_finale: number;
  valide: boolean;
  date_saisie: string;
}

export interface Bulletin {
  id: number;
  id_etudiant: number;
  id_annee_academique: number;
  id_semestre: number;
  moyenne: number;
  rang: number;
  total_credits_valides: number;
  mention: string;
  decision: 'Admis' | 'Ajourné';
  date_generation: string;
}

export interface Paiement {
  id: number;
  numero_recu: string;
  id_etudiant: number;
  id_inscription: number;
  id_annee_academique: number;
  type_frais: 'inscription' | 'scolarite' | 'examen' | 'autre';
  montant: number;
  date_paiement: string;
  mode_paiement: 'especes' | 'orange_money' | 'moov_money' | 'virement' | 'cheque';
  reference_transaction: string;
  statut: 'valide' | 'en_attente' | 'rejete';
}

export interface UserSession {
  id: number;
  type: UserType;
  name: string;
  email_or_matricule: string;
  role: string;
}
