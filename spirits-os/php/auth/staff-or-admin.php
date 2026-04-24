<?php
require_once __DIR__ . '/session.php';

$role = strtolower((string) ($_SESSION['role'] ?? ''));

if (!in_array($role, ['admin', 'staff'], true)) {
    header('Location: ../index.html');
    exit;
}
?>