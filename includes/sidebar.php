<?php
/**
 * Menu Latéral Rétractable (Admin vs Étudiant)
 */
$userType = $_SESSION['user_type'] ?? 'guest';
$currentScript = basename($_SERVER['SCRIPT_NAME']);
?>
<aside class="sidebar" id="appSidebar">
    <div class="sidebar-brand">
        <svg width="24" height="24" fill="none" stroke="#2563eb" stroke-width="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
        <h1>UnivMali</h1>
    </div>

    <nav class="sidebar-menu">
        <?php if ($userType === 'admin'): ?>
            <div class="menu-category">Général</div>
            <a href="<?= BASE_URL ?>admin/dashboard.php" class="menu-item <?= $currentScript === 'dashboard.php' ? 'active' : '' ?>">
                Tableau de bord
            </a>

            <div class="menu-category">Structure Académique</div>
            <a href="<?= BASE_URL ?>admin/universites/index.php" class="menu-item">Universités</a>
            <a href="<?= BASE_URL ?>admin/facultes/index.php" class="menu-item">Facultés</a>
            <a href="<?= BASE_URL ?>admin/filieres/index.php" class="menu-item">Filières</a>
            <a href="<?= BASE_URL ?>admin/niveaux/index.php" class="menu-item">Niveaux</a>
            <a href="<?= BASE_URL ?>admin/classes/index.php" class="menu-item">Classes</a>
            <a href="<?= BASE_URL ?>admin/matieres/index.php" class="menu-item">Matières</a>
            <a href="<?= BASE_URL ?>admin/annees_academiques/index.php" class="menu-item">Années Académiques</a>

            <div class="menu-category">Acteurs & Scolarité</div>
            <a href="<?= BASE_URL ?>admin/etudiants/index.php" class="menu-item">Étudiants</a>
            <a href="<?= BASE_URL ?>admin/enseignants/index.php" class="menu-item">Enseignants</a>
            <a href="<?= BASE_URL ?>admin/inscriptions/index.php" class="menu-item">Inscriptions</a>

            <div class="menu-category">Évaluations & Comptabilité</div>
            <a href="<?= BASE_URL ?>admin/notes/index.php" class="menu-item">Saisie des Notes</a>
            <a href="<?= BASE_URL ?>admin/bulletins/index.php" class="menu-item">Bulletins & Transcripts</a>
            <a href="<?= BASE_URL ?>admin/paiements/index.php" class="menu-item">Paiements & Frais</a>

            <div class="menu-category">Système</div>
            <a href="<?= BASE_URL ?>admin/rapports/index.php" class="menu-item">Rapports & Exports</a>
            <a href="<?= BASE_URL ?>admin/utilisateurs/index.php" class="menu-item">Utilisateurs</a>
            <a href="<?= BASE_URL ?>admin/parametres/index.php" class="menu-item">Paramètres</a>

        <?php elseif ($userType === 'etudiant'): ?>
            <div class="menu-category">Espace Étudiant</div>
            <a href="<?= BASE_URL ?>etudiant/dashboard.php" class="menu-item <?= $currentScript === 'dashboard.php' ? 'active' : '' ?>">Mon Tableau de Bord</a>
            <a href="<?= BASE_URL ?>etudiant/profil.php" class="menu-item">Mon Profil Personnel</a>
            <a href="<?= BASE_URL ?>etudiant/notes.php" class="menu-item">Mes Notes & Relevés</a>
            <a href="<?= BASE_URL ?>etudiant/bulletins.php" class="menu-item">Mes Bulletins</a>
            <a href="<?= BASE_URL ?>etudiant/paiements.php" class="menu-item">Mes Paiements</a>
        <?php endif; ?>
    </nav>
</aside>
