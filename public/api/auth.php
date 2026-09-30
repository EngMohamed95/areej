<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database($config);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = (string)($_SESSION['areej_user_id'] ?? '');
    if ($userId === '') {
        json_response(['success' => true, 'authenticated' => false, 'user' => null]);
    }
    $statement = $pdo->prepare('SELECT * FROM staff_users WHERE id = ? AND is_active = 1 LIMIT 1');
    $statement->execute([$userId]);
    $user = $statement->fetch();
    if (!$user) {
        unset($_SESSION['areej_admin'], $_SESSION['areej_user_id']);
        json_response(['success' => true, 'authenticated' => false, 'user' => null]);
    }
    json_response(['success' => true, 'authenticated' => true, 'user' => public_staff_user($user)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    $pin = (string)($body['pin'] ?? '');
    $now = time();
    $blockedUntil = (int)($_SESSION['login_blocked_until'] ?? 0);

    if ($blockedUntil > $now) {
        json_response(['success' => false, 'error' => 'Too many attempts. Try again later.'], 429);
    }

    $users = $pdo->query('SELECT * FROM staff_users WHERE is_active = 1')->fetchAll();
    $matchedUser = null;
    foreach ($users as $user) {
        $storedHash = (string)$user['pin_hash'];
        $matches = str_starts_with($storedHash, 'sha256:')
            ? hash_equals(substr($storedHash, 7), hash('sha256', $pin))
            : password_verify($pin, $storedHash);
        if ($matches) {
            $matchedUser = $user;
            break;
        }
    }

    if ($matchedUser) {
        session_regenerate_id(true);
        $_SESSION['areej_admin'] = true;
        $_SESSION['areej_user_id'] = (string)$matchedUser['id'];
        $_SESSION['login_attempts'] = 0;
        unset($_SESSION['login_blocked_until']);
        json_response(['success' => true, 'user' => public_staff_user($matchedUser)]);
    }

    $attempts = (int)($_SESSION['login_attempts'] ?? 0) + 1;
    $_SESSION['login_attempts'] = $attempts;
    if ($attempts >= 5) {
        $_SESSION['login_blocked_until'] = $now + 300;
        $_SESSION['login_attempts'] = 0;
    }
    json_response(['success' => false, 'error' => 'Incorrect PIN.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], '', $params['secure'], $params['httponly']);
    }
    session_destroy();
    json_response(['success' => true]);
}

json_response(['success' => false, 'error' => 'Method not allowed.'], 405);
