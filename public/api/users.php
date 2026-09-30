<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database($config);
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rows = $pdo->query('SELECT * FROM staff_users ORDER BY is_active DESC, name ASC')->fetchAll();
    json_response([
        'success' => true,
        'users' => array_map('public_staff_user', $rows),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    $id = trim((string)($body['id'] ?? ''));
    $tenantId = trim((string)($body['tenantId'] ?? 'areej'));
    $name = trim((string)($body['name'] ?? ''));
    $email = trim((string)($body['email'] ?? ''));
    $phone = trim((string)($body['phone'] ?? ''));
    $role = (string)($body['role'] ?? 'staff');
    $pin = (string)($body['pin'] ?? '');
    $isActive = !array_key_exists('isActive', $body) || (bool)$body['isActive'];

    if ($id === '' || $name === '' || !in_array($role, ['owner', 'manager', 'staff'], true)) {
        json_response(['success' => false, 'error' => 'Invalid user data.'], 422);
    }

    $existing = $pdo->prepare('SELECT pin_hash FROM staff_users WHERE id = ?');
    $existing->execute([$id]);
    $current = $existing->fetch();
    if (!$current && strlen($pin) < 4) {
        json_response(['success' => false, 'error' => 'A PIN of at least 4 digits is required.'], 422);
    }

    $pinHash = $pin !== '' ? password_hash($pin, PASSWORD_DEFAULT) : (string)$current['pin_hash'];
    $statement = $pdo->prepare('INSERT INTO staff_users
        (id, tenant_id, name, email, phone, role, pin_hash, is_active)
        VALUES (:id, :tenant_id, :name, :email, :phone, :role, :pin_hash, :is_active)
        ON DUPLICATE KEY UPDATE tenant_id = VALUES(tenant_id), name = VALUES(name),
        email = VALUES(email), phone = VALUES(phone), role = VALUES(role),
        pin_hash = VALUES(pin_hash), is_active = VALUES(is_active)');
    $statement->execute([
        ':id' => $id,
        ':tenant_id' => $tenantId,
        ':name' => $name,
        ':email' => $email !== '' ? $email : null,
        ':phone' => $phone !== '' ? $phone : null,
        ':role' => $role,
        ':pin_hash' => $pinHash,
        ':is_active' => (int)$isActive,
    ]);

    $saved = $pdo->prepare('SELECT * FROM staff_users WHERE id = ?');
    $saved->execute([$id]);
    json_response(['success' => true, 'user' => public_staff_user($saved->fetch())]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $body = request_json();
    $id = trim((string)($body['id'] ?? ''));
    if ($id === '' || $id === (string)($_SESSION['areej_user_id'] ?? '')) {
        json_response(['success' => false, 'error' => 'You cannot delete the active user.'], 422);
    }
    $statement = $pdo->prepare('DELETE FROM staff_users WHERE id = ?');
    $statement->execute([$id]);
    json_response(['success' => true]);
}

json_response(['success' => false, 'error' => 'Method not allowed.'], 405);
