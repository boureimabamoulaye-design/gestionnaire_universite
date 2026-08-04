<?php
/**
 * Gestion de l'authentification et des autorisations
 */

/**
 * Vérifier si l'utilisateur est connecté
 */
function isLoggedIn(): bool {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_type']);
}

/**
 * Exiger la connexion administrateur
 */
function requireAdmin(): void {
    if (!isLoggedIn() || $_SESSION['user_type'] !== 'admin') {
        redirect(BASE_URL . 'login.php?error=unauthorized');
    }
}

/**
 * Exiger la connexion étudiant
 */
function requireEtudiant(): void {
    if (!isLoggedIn() || $_SESSION['user_type'] !== 'etudiant') {
        redirect(BASE_URL . 'login.php?error=unauthorized');
    }
}

/**
 * Obtenir les données de l'utilisateur actuel
 */
function getCurrentUser(): ?array {
    if (!isLoggedIn()) return null;
    return [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'] ?? 'Utilisateur',
        'email_or_matricule' => $_SESSION['user_email_or_matricule'] ?? '',
        'type' => $_SESSION['user_type'],
        'role' => $_SESSION['user_role'] ?? 'Utilisateur'
    ];
}
