<?php
require_once __DIR__ . '/session.php';

$role = strtolower((string) ($_SESSION['role'] ?? ''));

if ($role !== 'admin') {
    header('Location: dashboard.php?forbidden=1');
    exit;
}
?>