<?php
require_once __DIR__ . '/../auth/admin-only.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

$sql = "
    SELECT
        id,
        full_name,
        username,
        email,
        role,
        status,
        must_change_password,
        DATE_FORMAT(last_login, '%b %d, %Y %h:%i %p') AS last_login
    FROM users
    ORDER BY full_name ASC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load users.'
    ]);
    exit;
}

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = [
        'id' => (int) $row['id'],
        'full_name' => $row['full_name'],
        'username' => $row['username'],
        'email' => $row['email'],
        'role' => strtolower($row['role']),
        'status' => strtolower($row['status']),
        'must_change_password' => (int) $row['must_change_password'],
        'last_login' => $row['last_login'] ?: null
    ];
}

echo json_encode([
    'success' => true,
    'users' => $users
]);