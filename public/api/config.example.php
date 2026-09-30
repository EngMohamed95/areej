<?php
declare(strict_types=1);

// Copy this file to config.php on the server. config.php is ignored by Git.
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'u000000000_areej_menu',
    'db_user' => 'u000000000_areej_api',
    'db_password' => 'CHANGE_ME',
    'admin_pin_sha256' => hash('sha256', 'CHANGE_ME'),
];
