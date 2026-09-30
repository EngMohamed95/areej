<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database($config);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    $order = $body['order'] ?? null;
    $items = $body['items'] ?? null;

    if (!is_array($order) || !is_array($items) || empty($order['id']) || empty($order['tenantId'])) {
        json_response(['success' => false, 'error' => 'Invalid order data.'], 422);
    }

    $pdo->beginTransaction();
    try {
        $statement = $pdo->prepare('INSERT INTO menu_orders
            (id, tenant_id, branch_id, status, total, data, created_at)
            VALUES (:id, :tenant_id, :branch_id, :status, :total, :data, :created_at)');
        $statement->execute([
            ':id' => (string)$order['id'],
            ':tenant_id' => (string)$order['tenantId'],
            ':branch_id' => (string)($order['branchId'] ?? ''),
            ':status' => (string)($order['status'] ?? 'pending'),
            ':total' => (float)($order['total'] ?? 0),
            ':data' => json_encode($order, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':created_at' => date('Y-m-d H:i:s.u', strtotime((string)($order['createdAt'] ?? 'now'))),
        ]);

        $itemStatement = $pdo->prepare('INSERT INTO menu_order_items (order_id, product_id, data)
            VALUES (:order_id, :product_id, :data)');
        foreach ($items as $item) {
            if (!is_array($item) || empty($item['productId'])) continue;
            $itemStatement->execute([
                ':order_id' => (string)$order['id'],
                ':product_id' => (string)$item['productId'],
                ':data' => json_encode($item, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
        }

        $pdo->commit();
        json_response(['success' => true, 'orderId' => (string)$order['id']], 201);
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('Order creation error: ' . $error->getMessage());
        json_response(['success' => false, 'error' => 'Unable to create order.'], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_admin();
    $rows = $pdo->query('SELECT data FROM menu_orders ORDER BY created_at DESC LIMIT 200')->fetchAll();
    $orders = array_values(array_filter(array_map(
        static fn(array $row) => json_decode($row['data'], true),
        $rows
    ), 'is_array'));
    json_response(['success' => true, 'orders' => $orders]);
}

json_response(['success' => false, 'error' => 'Method not allowed.'], 405);
