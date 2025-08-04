<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Получаем данные аналитики
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверные данные']);
    exit;
}

// Создаем объект аналитики
$analyticsData = [
    'event' => $input['event'] ?? 'unknown',
    'status' => $input['status'] ?? 'unknown',
    'timestamp' => $input['timestamp'] ?? date('Y-m-d H:i:s'),
    'error' => $input['error'] ?? '',
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'unknown'
];

// Путь к файлу аналитики
$analyticsFile = 'analytics.json';

// Читаем существующие данные
$analytics = [];
if (file_exists($analyticsFile)) {
    $fileContent = file_get_contents($analyticsFile);
    if ($fileContent) {
        $analytics = json_decode($fileContent, true) ?: [];
    }
}

// Добавляем новые данные
$analytics[] = $analyticsData;

// Ограничиваем размер файла (храним только последние 1000 записей)
if (count($analytics) > 1000) {
    $analytics = array_slice($analytics, -1000);
}

// Сохраняем в файл
if (file_put_contents($analyticsFile, json_encode($analytics, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Аналитика сохранена']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении аналитики']);
}
?> 