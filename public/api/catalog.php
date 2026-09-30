<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database($config);
$allowedResources = ['tenants', 'branches', 'categories', 'modifierGroups', 'products'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $version = current_catalog_version($pdo);
    $since = isset($_GET['since']) ? (int)$_GET['since'] : 0;
    if ($since > 0 && $since === $version) {
        json_response(['success' => true, 'changed' => false, 'version' => $version]);
    }

    $catalog = array_fill_keys($allowedResources, []);
    $rows = $pdo->query('SELECT resource, data FROM catalog_records ORDER BY resource, sort_order, record_id')->fetchAll();
    foreach ($rows as $row) {
        if (!isset($catalog[$row['resource']])) continue;
        $record = json_decode($row['data'], true);
        if (is_array($record)) $catalog[$row['resource']][] = $record;
    }

    json_response(array_merge([
        'success' => true,
        'changed' => true,
        'version' => $version,
    ], $catalog));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    $body = request_json();
    $resource = (string)($body['resource'] ?? '');
    $records = $body['records'] ?? null;

    if (!in_array($resource, $allowedResources, true) || !is_array($records)) {
        json_response(['success' => false, 'error' => 'Invalid catalog resource.'], 422);
    }

    $insert = $pdo->prepare('INSERT INTO catalog_records
        (resource, record_id, tenant_id, sort_order, is_visible, data)
        VALUES (:resource, :record_id, :tenant_id, :sort_order, :is_visible, :data)');

    $pdo->beginTransaction();
    try {
        $delete = $pdo->prepare('DELETE FROM catalog_records WHERE resource = ?');
        $delete->execute([$resource]);

        foreach ($records as $record) {
            if (!is_array($record) || empty($record['id'])) {
                throw new InvalidArgumentException('Every record must have an id.');
            }
            $insert->execute([
                ':resource' => $resource,
                ':record_id' => (string)$record['id'],
                ':tenant_id' => isset($record['tenantId']) ? (string)$record['tenantId'] : null,
                ':sort_order' => (int)($record['displayOrder'] ?? 0),
                ':is_visible' => array_key_exists('isVisible', $record) ? (int)(bool)$record['isVisible'] : 1,
                ':data' => json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
        }

        $pdo->exec("UPDATE catalog_meta SET meta_value = meta_value + 1 WHERE meta_key = 'version'");
        $version = current_catalog_version($pdo);
        $pdo->commit();
        json_response(['success' => true, 'version' => $version]);
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('Catalog write error: ' . $error->getMessage());
        json_response(['success' => false, 'error' => 'Unable to save catalog data.'], 500);
    }
}

json_response(['success' => false, 'error' => 'Method not allowed.'], 405);
