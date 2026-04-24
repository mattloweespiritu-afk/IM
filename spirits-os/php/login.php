<?php
session_start();
require_once __DIR__ . '/config/db.php';

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

$username = trim($payload['username'] ?? '');
$password = trim($payload['password'] ?? '');
$remember = !empty($payload['remember']);

if ($username === '' || $password === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Username and password are required.'
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
        password_hash,
        must_change_password
    FROM users
    WHERE username = ?
    LIMIT 1
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare login query.'
    ]);
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result ? $result->fetch_assoc() : null;
$stmt->close();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
    exit;
}

if (($user['status'] ?? 'inactive') !== 'active') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'This account is inactive.'
    ]);
    exit;
}

if (!password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
    exit;
}

session_regenerate_id(true);

$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['full_name'] = $user['full_name'];
$_SESSION['username'] = $user['username'];
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = strtolower($user['role']);
$_SESSION['must_change_password'] = (int) $user['must_change_password'];

$updateLoginSql = "UPDATE users SET last_login = NOW() WHERE id = ?";
$updateLoginStmt = $conn->prepare($updateLoginSql);
if ($updateLoginStmt) {
    $updateLoginStmt->bind_param('i', $_SESSION['user_id']);
    $updateLoginStmt->execute();
    $updateLoginStmt->close();
}

if ($remember) {
    setcookie(
        'remembered_user',
        $user['username'],
        time() + (86400 * 30),
        '/',
        '',
        false,
        true
    );
} else {
    if (isset($_COOKIE['remembered_user'])) {
        setcookie('remembered_user', '', time() - 3600, '/');
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Authentication successful.',
    'redirect' => 'html/dashboard.php',
    'must_change_password' => (bool) $user['must_change_password'],
    'user' => [
        'id' => (int) $user['id'],
        'full_name' => $user['full_name'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => strtolower($user['role'])
    ]
]);