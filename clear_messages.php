<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

$messagesFile = 'messages.json';

// Проверяем существование файла
if (!file_exists($messagesFile)) {
    echo json_encode(['success' => true, 'message' => 'Файл сообщений не существует']);
    exit;
}

// Очищаем файл
if (file_put_contents($messagesFile, '[]')) {
    echo json_encode(['success' => true, 'message' => 'Все сообщения удалены']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка при удалении сообщений']);
}
?> 