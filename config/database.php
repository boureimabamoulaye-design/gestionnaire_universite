<?php
/**
 * Configuration de la Base de Données 'universite'
 * PDO MySQL - PHP 8 OOP
 * Universités du Mali - Gestion Scolaire
 */

class Database {
    private string $host = "localhost";
    private string $db_name = "universite";
    private string $username = "root";
    private string $password = "";
    private string $charset = "utf8mb4";
    private ?PDO $conn = null;

    /**
     * Obtenir la connexion PDO
     */
    public function getConnection(): ?PDO {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $exception) {
            error_log("Erreur de connexion à la base de données : " . $exception->getMessage());
            die("Erreur critique de connexion à la base de données 'universite'. Veuillez vérifier la configuration de WAMP/XAMPP.");
        }

        return $this->conn;
    }
}
