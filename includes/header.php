<?php
/**
 * En-tête Général de l'Application
 */
if (!defined('ROOT_PATH')) {
    exit('Accès direct non autorisé');
}

$currentUser = getCurrentUser();
$db = (new Database())->getConnection();
$activeYear = getActiveAcademicYear($db);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? sanitize($pageTitle) . ' - ' : '' ?><?= APP_NAME ?></title>
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/style.css">
</head>
<body>
<div class="app-container">
    <?php require_once ROOT_PATH . 'includes/sidebar.php'; ?>

    <div class="main-content">
        <header class="topbar">
            <div class="topbar-left">
                <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle Sidebar">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div class="academic-year-badge">
                    Année Académique : <?= $activeYear ? sanitize($activeYear['libelle']) : 'Non définie' ?>
                </div>
            </div>

            <div class="topbar-right">
                <div class="user-profile">
                    <div class="user-info">
                        <div class="user-name"><?= sanitize($currentUser['name'] ?? 'Utilisateur') ?></div>
                        <div class="user-role"><?= sanitize(ucfirst($currentUser['type'] ?? 'Invité')) ?></div>
                    </div>
                </div>
                <a href="<?= BASE_URL ?>logout.php" class="btn btn-secondary btn-sm" title="Déconnexion">
                    Déconnexion
                </a>
            </div>
        </header>

        <main class="content-body">
