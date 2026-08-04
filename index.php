<?php
/**
 * Routeur Principal
 */
require_once __DIR__ . '/config/init.php';

if (!isLoggedIn()) {
    redirect(BASE_URL . 'login.php');
}

if ($_SESSION['user_type'] === 'admin') {
    redirect(BASE_URL . 'admin/dashboard.php');
} else {
    redirect(BASE_URL . 'etudiant/dashboard.php');
}
