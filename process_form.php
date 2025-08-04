<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Получаем данные из POST запроса
$input = json_decode(file_get_contents('php://input'), true);

// Если JSON не получен, пробуем обычный POST
if (!$input) {
    $input = $_POST;
}

// Проверяем наличие обязательных полей
if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Заполните все обязательные поля']);
    exit;
}

// Очищаем и валидируем данные
$name = trim(strip_tags($input['name']));
$email = trim(strip_tags($input['email']));
$phone = isset($input['phone']) ? trim(strip_tags($input['phone'])) : '';
$message = trim(strip_tags($input['message']));

// Валидация
if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Имя должно содержать минимум 2 символа']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Введите корректный email']);
    exit;
}

if (strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Сообщение должно содержать минимум 10 символов']);
    exit;
}

// Создаем объект сообщения
$messageData = [
    'id' => time() . '_' . rand(1000, 9999),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// Путь к файлу с сообщениями
$messagesFile = 'messages.json';

// Читаем существующие сообщения
$messages = [];
if (file_exists($messagesFile)) {
    $fileContent = file_get_contents($messagesFile);
    if ($fileContent) {
        $messages = json_decode($fileContent, true) ?: [];
    }
}

// Добавляем новое сообщение
$messages[] = $messageData;

// Сохраняем в файл
if (file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode([
        'success' => true, 
        'message' => 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
        'data' => $messageData
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении сообщения']);
}
?> 