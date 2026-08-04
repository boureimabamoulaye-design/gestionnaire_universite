<?php
/**
 * Page de Connexion Universelle (Admin & Étudiant)
 */
require_once __DIR__ . '/config/init.php';

// Si déjà connecté, rediriger selon le rôle
if (isLoggedIn()) {
    if ($_SESSION['user_type'] === 'admin') {
        redirect(BASE_URL . 'admin/dashboard.php');
    } else {
        redirect(BASE_URL . 'etudiant/dashboard.php');
    }
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    $loginType = sanitize($_POST['login_type'] ?? 'admin'); // 'admin' ou 'etudiant'
    $identifier = sanitize($_POST['identifier'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($identifier) || empty($password)) {
        $error = "Veuillez remplir tous les champs.";
    } else {
        $db = (new Database())->getConnection();

        if ($loginType === 'admin') {
            // Connexion Administrateur par Email
            $stmt = $db->prepare("SELECT * FROM administrateurs WHERE email = ? AND statut = 'actif' LIMIT 1");
            $stmt->execute([$identifier]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['mot_de_passe'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['nom'] . ' ' . $user['prenom'];
                $_SESSION['user_email_or_matricule'] = $user['email'];
                $_SESSION['user_type'] = 'admin';
                $_SESSION['user_role'] = $user['role'] ?? 'Administrateur';

                logAction($db, $user['id'], 'admin', 'Connexion', 'Connexion réussie à l\'espace administration');
                redirect(BASE_URL . 'admin/dashboard.php');
            } else {
                $error = "Identifiants d'administration incorrects.";
            }
        } else {
            // Connexion Étudiant par Matricule
            $stmt = $db->prepare("SELECT * FROM etudiants WHERE matricule = ? AND statut = 'actif' LIMIT 1");
            $stmt->execute([$identifier]);
            $student = $stmt->fetch();

            if ($student && password_verify($password, $student['mot_de_passe'])) {
                $_SESSION['user_id'] = $student['id'];
                $_SESSION['user_name'] = $student['nom'] . ' ' . $student['prenom'];
                $_SESSION['user_email_or_matricule'] = $student['matricule'];
                $_SESSION['user_type'] = 'etudiant';
                $_SESSION['user_role'] = 'Étudiant';

                logAction($db, $student['id'], 'etudiant', 'Connexion', 'Connexion réussie à l\'espace étudiant');
                redirect(BASE_URL . 'etudiant/dashboard.php');
            } else {
                $error = "Matricule ou mot de passe étudiant incorrect.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - <?= APP_NAME ?></title>
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/style.css">
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--bg-body);
        }
        .login-card {
            width: 100%;
            max-width: 400px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 2rem;
            box-shadow: var(--shadow-sm);
        }
        .login-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .login-header h1 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        .login-header p {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }
        .tab-buttons {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 1.5rem;
        }
        .tab-btn {
            flex: 1;
            padding: 0.6rem;
            background: none;
            border: none;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-muted);
            cursor: pointer;
            text-align: center;
            border-bottom: 2px solid transparent;
        }
        .tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
            font-weight: 600;
        }
    </style>
</head>
<body>

<div class="login-card">
    <div class="login-header">
        <h1>Gestion Scolaire Universitaire</h1>
        <p>Portail d'Accès aux Universités du Mali</p>
    </div>

    <?php if ($error): ?>
        <div style="background-color: var(--danger-light); color: var(--danger); padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem;">
            <?= sanitize($error) ?>
        </div>
    <?php endif; ?>

    <div class="tab-buttons">
        <button type="button" class="tab-btn active" onclick="switchTab('admin')">Administrateur</button>
        <button type="button" class="tab-btn" onclick="switchTab('etudiant')">Étudiant</button>
    </div>

    <form action="" method="POST" id="loginForm">
        <?= csrf_field() ?>
        <input type="hidden" name="login_type" id="loginTypeInput" value="admin">

        <div class="form-group">
            <label class="form-label" id="identifierLabel">Adresse Email</label>
            <input type="text" name="identifier" class="form-control" placeholder="exemple@universite.ml" required autocomplete="username">
        </div>

        <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input type="password" name="password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
            Se Connecter
        </button>
    </form>
</div>

<script>
    function switchTab(type) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('loginTypeInput').value = type;
        
        if (type === 'admin') {
            event.target.classList.add('active');
            document.getElementById('identifierLabel').textContent = 'Adresse Email';
            document.querySelector('input[name="identifier"]').placeholder = 'admin@universite.ml';
        } else {
            event.target.classList.add('active');
            document.getElementById('identifierLabel').textContent = 'Matricule Étudiant';
            document.querySelector('input[name="identifier"]').placeholder = '2025-001';
        }
    }
</script>

</body>
</html>
