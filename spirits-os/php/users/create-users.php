<?php
require_once __DIR__ . '/../auth/admin-only.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request payload.'
    ]);
    exit;
}

$fullName = trim($payload['full_name'] ?? '');
$username = trim($payload['username'] ?? '');
$email = trim($payload['email'] ?? '');
$role = strtolower(trim($payload['role'] ?? ''));
$password = trim($payload['password'] ?? '');
$confirmPassword = trim($payload['confirm_password'] ?? '');

if (
    $fullName === '' ||
    $username === '' ||
    $email === '' ||
    $role === '' ||
    $password === '' ||
    $confirmPassword === ''
) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Full name, username, email, role, password, and confirm password are required.'
    ]);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9._-]{3,30}$/', $username)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Username must be 3 to 30 characters and may only contain letters, numbers, dots, underscores, and hyphens.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

if (!in_array($role, ['admin', 'staff'], true)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid role selected.'
    ]);
    exit;
}

if ($password !== $confirmPassword) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Passwords do not match.'
    ]);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 8 characters.'
    ]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$mustChangePassword = 0;

$checkSql = "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1";
$checkStmt = $conn->prepare($checkSql);

if (!$checkStmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare duplicate check.'
    ]);
    exit;
}

$checkStmt->bind_param('ss', $username, $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult && $checkResult->num_rows > 0) {
    $checkStmt->close();
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Username or email already exists.'
    ]);
    exit;
}
$checkStmt->close();

$insertSql = "
    INSERT INTO users (
        full_name,
        username,
        email,
        password_hash,
        role,
        status,
        must_change_password
    ) VALUES (?, ?, ?, ?, ?, 'active', ?)
";

$insertStmt = $conn->prepare($insertSql);

if (!$insertStmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare insert statement.'
    ]);
    exit;
}

$insertStmt->bind_param(
    'sssssi',
    $fullName,
    $username,
    $email,
    $passwordHash,
    $role,
    $mustChangePassword
);

if (!$insertStmt->execute()) {
    $insertStmt->close();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create user.'
    ]);
    exit;
}

$newUserId = $insertStmt->insert_id;
$insertStmt->close();

echo json_encode([
    'success' => true,
    'message' => 'User created successfully.',
    'user' => [
        'id' => $newUserId,
        'full_name' => $fullName,
        'username' => $username,
        'email' => $email,
        'role' => $role,
        'status' => 'active',
        'must_change_password' => false
    ]
]);