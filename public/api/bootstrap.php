<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header("Referrer-Policy: same-origin");

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'Database is not configured.']);
    exit;
}

$config = require $configPath;

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    if (!is_array($decoded)) {
        json_response(['success' => false, 'error' => 'Invalid JSON body.'], 400);
    }
    return $decoded;
}

function require_admin(): void
{
    if (empty($_SESSION['areej_admin'])) {
        json_response(['success' => false, 'error' => 'Authentication required.'], 401);
    }
}

function database(array $config): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['db_host'],
        (int)($config['db_port'] ?? 3306),
        $config['db_name']
    );

    try {
        $pdo = new PDO($dsn, $config['db_user'], $config['db_password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        ensure_schema($pdo);
        seed_admin_user_if_empty($pdo, $config);
        seed_catalog_if_empty($pdo);
        return $pdo;
    } catch (Throwable $error) {
        error_log('Areej database error: ' . $error->getMessage());
        json_response(['success' => false, 'error' => 'Database connection failed.'], 503);
    }
}

function ensure_schema(PDO $pdo): void
{
    $pdo->exec("CREATE TABLE IF NOT EXISTS catalog_records (
        resource VARCHAR(40) NOT NULL,
        record_id VARCHAR(128) NOT NULL,
        tenant_id VARCHAR(128) NULL,
        sort_order INT NOT NULL DEFAULT 0,
        is_visible TINYINT(1) NOT NULL DEFAULT 1,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (resource, record_id),
        INDEX idx_catalog_tenant (tenant_id),
        INDEX idx_catalog_sort (resource, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS catalog_meta (
        meta_key VARCHAR(40) PRIMARY KEY,
        meta_value BIGINT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $pdo->exec("INSERT IGNORE INTO catalog_meta (meta_key, meta_value) VALUES ('version', 1)");

    $pdo->exec("CREATE TABLE IF NOT EXISTS menu_orders (
        id VARCHAR(128) PRIMARY KEY,
        tenant_id VARCHAR(128) NOT NULL,
        branch_id VARCHAR(128) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        total DECIMAL(12,2) NOT NULL DEFAULT 0,
        data LONGTEXT NOT NULL,
        created_at DATETIME(6) NOT NULL,
        updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX idx_orders_tenant_created (tenant_id, created_at),
        INDEX idx_orders_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS menu_order_items (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(128) NOT NULL,
        product_id VARCHAR(128) NOT NULL,
        data LONGTEXT NOT NULL,
        INDEX idx_order_items_order (order_id),
        CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES menu_orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS staff_users (
        id VARCHAR(128) PRIMARY KEY,
        tenant_id VARCHAR(128) NOT NULL,
        name VARCHAR(190) NOT NULL,
        email VARCHAR(190) NULL,
        phone VARCHAR(40) NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'staff',
        pin_hash VARCHAR(255) NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_staff_email (email),
        INDEX idx_staff_tenant (tenant_id),
        INDEX idx_staff_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

function seed_admin_user_if_empty(PDO $pdo, array $config): void
{
    $count = (int)$pdo->query('SELECT COUNT(*) FROM staff_users')->fetchColumn();
    if ($count > 0) return;

    $legacyHash = (string)($config['admin_pin_sha256'] ?? '');
    if ($legacyHash === '') return;

    $insert = $pdo->prepare('INSERT INTO staff_users
        (id, tenant_id, name, email, phone, role, pin_hash, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)');
    $insert->execute([
        'usr-areej-admin',
        'areej',
        'إدارة مطعم أريج',
        'admin@areej-sa.net',
        null,
        'owner',
        'sha256:' . $legacyHash,
    ]);
}

function public_staff_user(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'tenantId' => (string)$row['tenant_id'],
        'name' => (string)$row['name'],
        'email' => (string)($row['email'] ?? ''),
        'phone' => (string)($row['phone'] ?? ''),
        'role' => (string)$row['role'],
        'isActive' => (bool)$row['is_active'],
        'createdAt' => isset($row['created_at']) ? (string)$row['created_at'] : null,
        'updatedAt' => isset($row['updated_at']) ? (string)$row['updated_at'] : null,
    ];
}

function seed_catalog_if_empty(PDO $pdo): void
{
    $count = (int)$pdo->query('SELECT COUNT(*) FROM catalog_records')->fetchColumn();
    if ($count > 0) return;

    $seedPath = __DIR__ . '/catalog.seed.json';
    if (!is_file($seedPath)) return;

    $seed = json_decode((string)file_get_contents($seedPath), true);
    if (!is_array($seed)) return;

    $allowed = ['tenants', 'branches', 'categories', 'modifierGroups', 'products'];
    $insert = $pdo->prepare('INSERT INTO catalog_records
        (resource, record_id, tenant_id, sort_order, is_visible, data)
        VALUES (:resource, :record_id, :tenant_id, :sort_order, :is_visible, :data)');

    $pdo->beginTransaction();
    try {
        foreach ($allowed as $resource) {
            $records = $seed[$resource] ?? [];
            if (!is_array($records)) continue;
            foreach ($records as $record) {
                if (!is_array($record) || empty($record['id'])) continue;
                $insert->execute([
                    ':resource' => $resource,
                    ':record_id' => (string)$record['id'],
                    ':tenant_id' => isset($record['tenantId']) ? (string)$record['tenantId'] : null,
                    ':sort_order' => (int)($record['displayOrder'] ?? 0),
                    ':is_visible' => array_key_exists('isVisible', $record) ? (int)(bool)$record['isVisible'] : 1,
                    ':data' => json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ]);
            }
        }
        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
}

function current_catalog_version(PDO $pdo): int
{
    return (int)$pdo->query("SELECT meta_value FROM catalog_meta WHERE meta_key = 'version'")->fetchColumn();
}
