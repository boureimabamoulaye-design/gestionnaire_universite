-- ============================================================
-- Base de données : `universite`
-- Gestion Scolaire Universitaire - Universités du Mali
-- Compatible MySQL 5.7+ / 8.0+ / MariaDB / WAMP / XAMPP
-- ============================================================

CREATE DATABASE IF NOT EXISTS `universite` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `universite`;

-- --------------------------------------------------------
-- Table `parametres`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `parametres` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom_universite` VARCHAR(255) NOT NULL DEFAULT 'Université des Sciences, des Techniques et des Technologies de Bamako',
  `sigle` VARCHAR(50) DEFAULT 'USTTB',
  `adresse` VARCHAR(255) DEFAULT 'Colline de Badalabougou, BP E 423, Bamako, Mali',
  `telephone` VARCHAR(50) DEFAULT '+223 20 22 32 44',
  `email` VARCHAR(100) DEFAULT 'contact@usttb.edu.ml',
  `logo` VARCHAR(255) DEFAULT 'logo_usttb.png',
  `ministere` VARCHAR(255) DEFAULT 'Ministère de l\'Enseignement Supérieur et de la Recherche Scientifique',
  `devise_pays` VARCHAR(100) DEFAULT 'Un Peuple - Un But - Une Foi',
  `date_modification` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `annees_academiques`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `annees_academiques` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `libelle` VARCHAR(20) NOT NULL, -- ex: 2025-2026
  `date_debut` DATE NOT NULL,
  `date_fin` DATE NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 0,
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `administrateurs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `administrateurs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mot_de_passe` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'Super Administrateur',
  `statut` ENUM('actif', 'inactif') DEFAULT 'actif',
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `universites`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `universites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `nom` VARCHAR(255) NOT NULL,
  `ville` VARCHAR(100) DEFAULT 'Bamako',
  `adresse` VARCHAR(255) DEFAULT NULL,
  `telephone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `recteur` VARCHAR(150) DEFAULT NULL,
  `statut` ENUM('actif', 'inactif') DEFAULT 'actif',
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `facultes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `facultes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_universite` INT NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `nom` VARCHAR(255) NOT NULL,
  `doyen` VARCHAR(150) DEFAULT NULL,
  `contact` VARCHAR(100) DEFAULT NULL,
  `statut` ENUM('actif', 'inactif') DEFAULT 'actif',
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_universite`) REFERENCES `universites`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `filieres`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `filieres` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_faculte` INT NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `nom` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `duree_annees` INT DEFAULT 3,
  `statut` ENUM('actif', 'inactif') DEFAULT 'actif',
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_faculte`) REFERENCES `facultes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `niveaux`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `niveaux` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE, -- L1, L2, L3, M1, M2
  `nom` VARCHAR(100) NOT NULL, -- Licence 1, Licence 2, etc.
  `ordre` INT NOT NULL DEFAULT 1,
  `description` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `semestres`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `semestres` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE, -- S1, S2, S3, S4, S5, S6
  `nom` VARCHAR(100) NOT NULL,
  `id_niveau` INT NOT NULL,
  `ordre` INT NOT NULL,
  FOREIGN KEY (`id_niveau`) REFERENCES `niveaux`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `classes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_filiere` INT NOT NULL,
  `id_niveau` INT NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `nom` VARCHAR(150) NOT NULL,
  `effectif_max` INT DEFAULT 50,
  `statut` ENUM('actif', 'inactif') DEFAULT 'actif',
  FOREIGN KEY (`id_filiere`) REFERENCES `filieres`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_niveau`) REFERENCES `niveaux`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `enseignants`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enseignants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `matricule` VARCHAR(50) NOT NULL UNIQUE,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telephone` VARCHAR(50) DEFAULT NULL,
  `specialite` VARCHAR(150) DEFAULT NULL,
  `grade` VARCHAR(100) DEFAULT 'Professeur',
  `statut` ENUM('permanent', 'vacataire') DEFAULT 'permanent',
  `date_embauche` DATE DEFAULT NULL,
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `matieres`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_filiere` INT NOT NULL,
  `id_niveau` INT NOT NULL,
  `id_semestre` INT NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `nom` VARCHAR(200) NOT NULL,
  `credits` INT NOT NULL DEFAULT 4,
  `coefficient` INT NOT NULL DEFAULT 2,
  `id_enseignant` INT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  FOREIGN KEY (`id_filiere`) REFERENCES `filieres`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_niveau`) REFERENCES `niveaux`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_semestre`) REFERENCES `semestres`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_enseignant`) REFERENCES `enseignants`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `etudiants`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `etudiants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `matricule` VARCHAR(50) NOT NULL UNIQUE,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telephone` VARCHAR(50) DEFAULT NULL,
  `date_naissance` DATE DEFAULT NULL,
  `lieu_naissance` VARCHAR(100) DEFAULT 'Bamako',
  `genre` ENUM('M', 'F') NOT NULL DEFAULT 'M',
  `adresse` VARCHAR(255) DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT 'default_avatar.png',
  `mot_de_passe` VARCHAR(255) NOT NULL,
  `statut` ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
  `date_inscription` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `inscriptions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_etudiant` INT NOT NULL,
  `id_annee_academique` INT NOT NULL,
  `id_filiere` INT NOT NULL,
  `id_niveau` INT NOT NULL,
  `id_classe` INT NOT NULL,
  `date_inscription` DATE NOT NULL,
  `montant_total` DECIMAL(12,2) DEFAULT 150000.00,
  `montant_paye` DECIMAL(12,2) DEFAULT 0.00,
  `statut` ENUM('validee', 'en_attente', 'annulee') DEFAULT 'validee',
  FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_annee_academique`) REFERENCES `annees_academiques`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_filiere`) REFERENCES `filieres`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_niveau`) REFERENCES `niveaux`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_classe`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `notes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_etudiant` INT NOT NULL,
  `id_matiere` INT NOT NULL,
  `id_annee_academique` INT NOT NULL,
  `id_semestre` INT NOT NULL,
  `note_cc` DECIMAL(4,2) DEFAULT 0.00,
  `note_exam` DECIMAL(4,2) DEFAULT 0.00,
  `note_rattrapage` DECIMAL(4,2) DEFAULT NULL,
  `note_finale` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  `valide` TINYINT(1) DEFAULT 0,
  `date_saisie` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_matiere`) REFERENCES `matieres`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_annee_academique`) REFERENCES `annees_academiques`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_semestre`) REFERENCES `semestres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `bulletins`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bulletins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_etudiant` INT NOT NULL,
  `id_annee_academique` INT NOT NULL,
  `id_semestre` INT NOT NULL,
  `moyenne` DECIMAL(4,2) NOT NULL,
  `rang` INT DEFAULT 1,
  `total_credits_valides` INT DEFAULT 0,
  `mention` VARCHAR(50) DEFAULT 'Passable',
  `decision` ENUM('Admis', 'Ajourné') DEFAULT 'Admis',
  `date_generation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_annee_academique`) REFERENCES `annees_academiques`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_semestre`) REFERENCES `semestres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `paiements`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `paiements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero_recu` VARCHAR(50) NOT NULL UNIQUE,
  `id_etudiant` INT NOT NULL,
  `id_inscription` INT NOT NULL,
  `id_annee_academique` INT NOT NULL,
  `type_frais` ENUM('inscription', 'scolarite', 'examen', 'autre') DEFAULT 'scolarite',
  `montant` DECIMAL(12,2) NOT NULL,
  `date_paiement` DATE NOT NULL,
  `mode_paiement` ENUM('especes', 'orange_money', 'moov_money', 'virement', 'cheque') DEFAULT 'especes',
  `reference_transaction` VARCHAR(100) DEFAULT NULL,
  `statut` ENUM('valide', 'en_attente', 'rejete') DEFAULT 'valide',
  FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_inscription`) REFERENCES `inscriptions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_annee_academique`) REFERENCES `annees_academiques`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `utilisateurs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mot_de_passe` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'secretaire', 'enseignant', 'etudiant') DEFAULT 'admin',
  `id_etudiant` INT DEFAULT NULL,
  `id_enseignant` INT DEFAULT NULL,
  `statut` ENUM('actif', 'inactif') DEFAULT 'actif',
  `dernier_acces` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `autorisations_filieres`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `autorisations_filieres` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_utilisateur` INT NOT NULL,
  `id_filiere` INT NOT NULL,
  `date_autorisation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_filiere`) REFERENCES `filieres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `historique_acces`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `historique_acces` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_utilisateur` INT NOT NULL,
  `type_utilisateur` VARCHAR(50) NOT NULL,
  `adresse_ip` VARCHAR(45) DEFAULT NULL,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `date_action` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DONNÉES INITIALES (SEEDING)
-- ============================================================

INSERT INTO `parametres` (`nom_universite`, `sigle`, `adresse`, `telephone`, `email`) 
VALUES ('Université des Sciences, des Techniques et des Technologies de Bamako', 'USTTB', 'Colline de Badalabougou, BP E 423, Bamako', '+223 20 22 32 44', 'contact@usttb.edu.ml');

-- Année Académique Active
INSERT INTO `annees_academiques` (`libelle`, `date_debut`, `date_fin`, `active`) VALUES
('2025-2026', '2025-10-01', '2026-07-31', 1),
('2026-2027', '2026-10-01', '2027-07-31', 0);

-- Compte Administrateur (Mot de passe : admin123)
INSERT INTO `administrateurs` (`nom`, `prenom`, `email`, `mot_de_passe`, `role`) VALUES
('DIARRA', 'Moussa', 'admin@universite.ml', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe11yR.mXyM0Yg4rP/v5135Y4X9s654re', 'Super Administrateur');

-- Universités
INSERT INTO `universites` (`code`, `nom`, `ville`, `recteur`) VALUES
('USTTB', 'Université des Sciences, des Techniques et des Technologies de Bamako', 'Bamako', 'Pr. Ouaténi DIALLO'),
('ULSHB', 'Université des Lettres et des Sciences Humaines de Bamako', 'Bamako', 'Pr. Idrissa Soïba TRAORE'),
('USJPB', 'Université des Sciences Juridiques et Politiques de Bamako', 'Bamako', 'Pr. Bouréma KANÉ');

-- Facultés USTTB
INSERT INTO `facultes` (`id_universite`, `code`, `nom`, `doyen`) VALUES
(1, 'FST', 'Faculté des Sciences et Techniques', 'Pr. Fana TANGARA'),
(1, 'FMOS', 'Faculté de Médecine et d\'Odontostomatologie', 'Pr. Seydou DOUMBOUYA'),
(1, 'FAPH', 'Faculté de Pharmacie', 'Pr. Boubacar TRAORÉ');

-- Niveaux LMD
INSERT INTO `niveaux` (`code`, `nom`, `ordre`) VALUES
('L1', 'Licence 1', 1),
('L2', 'Licence 2', 2),
('L3', 'Licence 3', 3),
('M1', 'Master 1', 4),
('M2', 'Master 2', 5);

-- Semestres
INSERT INTO `semestres` (`code`, `nom`, `id_niveau`, `ordre`) VALUES
('S1', 'Semestre 1', 1, 1),
('S2', 'Semestre 2', 1, 2),
('S3', 'Semestre 3', 2, 3),
('S4', 'Semestre 4', 2, 4),
('S5', 'Semestre 5', 3, 5),
('S6', 'Semestre 6', 3, 6);

-- Filières
INSERT INTO `filieres` (`id_faculte`, `code`, `nom`, `duree_annees`) VALUES
(1, 'INFO', 'Informatique et Génie Logiciel', 3),
(1, 'MATH', 'Mathématiques et Applications', 3),
(1, 'PHYS', 'Physique Appliquée', 3);

-- Classes
INSERT INTO `classes` (`id_filiere`, `id_niveau`, `code`, `nom`) VALUES
(1, 1, 'L1-INFO-A', 'Licence 1 Informatique - Groupe A'),
(1, 2, 'L2-INFO-A', 'Licence 2 Informatique - Groupe A'),
(1, 3, 'L3-INFO-A', 'Licence 3 Informatique - Groupe A');

-- Enseignants
INSERT INTO `enseignants` (`matricule`, `nom`, `prenom`, `email`, `telephone`, `specialite`, `grade`) VALUES
('ENS-001', 'COULIBALY', 'Ousmane', 'o.coulibaly@usttb.edu.ml', '+223 76 12 34 56', 'Base de données & Algorithmique', 'Professeur Titulaire'),
('ENS-002', 'SANOGO', 'Awa', 'a.sanogo@usttb.edu.ml', '+223 66 98 76 54', 'Réseaux & Sécurité', 'Maître de Conférences');

-- Matières L1 INFO
INSERT INTO `matieres` (`id_filiere`, `id_niveau`, `id_semestre`, `code`, `nom`, `credits`, `coefficient`, `id_enseignant`) VALUES
(1, 1, 1, 'INF101', 'Algorithmique et Programmation C', 6, 3, 1),
(1, 1, 1, 'INF102', 'Architecture des Ordinateurs', 4, 2, 2),
(1, 1, 1, 'MAT101', 'Analyse Mathématique I', 5, 2, 1),
(1, 1, 2, 'INF103', 'Bases de Données Relationnelles', 6, 3, 1);

-- Étudiant Exemple (Mot de passe : etudiant123)
INSERT INTO `etudiants` (`matricule`, `nom`, `prenom`, `email`, `telephone`, `date_naissance`, `lieu_naissance`, `genre`, `mot_de_passe`) VALUES
('2025-001', 'KEITA', 'Amadou', 'amadou.keita@etudiant.ml', '+223 70 00 11 22', '2003-05-14', 'Bamako', 'M', '$2y$10$wN31c77V2x2x06w4Qv7Z7O8sW9XyM0Yg4rP/v5135Y4X9s654re'),
('2025-002', 'TRAORE', 'Fatoumata', 'fatou.traore@etudiant.ml', '+223 75 44 33 22', '2004-09-20', 'Ségou', 'F', '$2y$10$wN31c77V2x2x06w4Qv7Z7O8sW9XyM0Yg4rP/v5135Y4X9s654re');

-- Inscriptions
INSERT INTO `inscriptions` (`id_etudiant`, `id_annee_academique`, `id_filiere`, `id_niveau`, `id_classe`, `date_inscription`, `montant_total`, `montant_paye`) VALUES
(1, 1, 1, 1, 1, '2025-10-05', 150000.00, 150000.00),
(2, 1, 1, 1, 1, '2025-10-06', 150000.00, 75000.00);

-- Notes
INSERT INTO `notes` (`id_etudiant`, `id_matiere`, `id_annee_academique`, `id_semestre`, `note_cc`, `note_exam`, `note_finale`, `valide`) VALUES
(1, 1, 1, 1, 14.50, 15.00, 14.80, 1),
(1, 2, 1, 1, 12.00, 13.50, 12.90, 1),
(1, 3, 1, 1, 11.00, 10.00, 10.40, 1);

-- Paiements
INSERT INTO `paiements` (`numero_recu`, `id_etudiant`, `id_inscription`, `id_annee_academique`, `type_frais`, `montant`, `date_paiement`, `mode_paiement`, `reference_transaction`) VALUES
('REC-2025-001', 1, 1, 1, 'scolarite', 150000.00, '2025-10-05', 'orange_money', 'OM-8839201'),
('REC-2025-002', 2, 1, 1, 'scolarite', 75000.00, '2025-10-06', 'especes', 'ESP-00921');
