<?php
/**
 * Fonctions Utilitaires et Sécurité
 */

/**
 * Nettoyage des entrées utilisateurs (Protection XSS)
 */
function sanitize(string $data): string {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Génération du champ caché CSRF
 */
function csrf_field(): string {
    $token = $_SESSION['csrf_token'] ?? '';
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}

/**
 * Vérification du token CSRF
 */
function verify_csrf(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            die("Erreur de sécurité : Jeton CSRF invalide ou expiré.");
        }
    }
}

/**
 * Redirection sécurisée
 */
function redirect(string $url): void {
    header("Location: " . $url);
    exit();
}

/**
 * Obtenir l'année académique active
 */
function getActiveAcademicYear(PDO $db): ?array {
    $stmt = $db->prepare("SELECT * FROM annees_academiques WHERE active = 1 LIMIT 1");
    $stmt->execute();
    return $stmt->fetch() ?: null;
}

/**
 * Calcul de la mention d'un semestre/année
 */
function calculateMention(float $moyenne): string {
    if ($moyenne >= 16) return 'Très Bien';
    if ($moyenne >= 14) return 'Bien';
    if ($moyenne >= 12) return 'Assez Bien';
    if ($moyenne >= 10) return 'Passable';
    return 'Ajourné';
}

/**
 * Calcul de la décision
 */
function calculateDecision(float $moyenne): string {
    return ($moyenne >= 10.0) ? 'Admis' : 'Ajourné';
}

/**
 * Formater le montant en FCFA (Franc CFA Mali)
 */
function formatFCFA(float $montant): string {
    return number_format($montant, 0, ',', ' ') . ' FCFA';
}

/**
 * Enregistrer un évènement dans l'historique d'accès
 */
function logAction(PDO $db, int $userId, string $userType, string $action, string $details = ''): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $stmt = $db->prepare("INSERT INTO historique_acces (id_utilisateur, type_utilisateur, adresse_ip, action, details, date_action) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$userId, $userType, $ip, $action, $details]);
}
