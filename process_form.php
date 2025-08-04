<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

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

// Расширенная валидация
if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Имя должно содержать минимум 2 символа']);
    exit;
}

if (strlen($name) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Имя слишком длинное (максимум 50 символов)']);
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

if (strlen($message) > 1000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Сообщение слишком длинное (максимум 1000 символов)']);
    exit;
}

// Проверка на спам (простая защита)
$spamKeywords = ['casino', 'viagra', 'loan', 'credit', 'buy now', 'click here'];
$messageLower = strtolower($message);
foreach ($spamKeywords as $keyword) {
    if (strpos($messageLower, $keyword) !== false) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Сообщение содержит запрещенный контент']);
        exit;
    }
}

// Проверка частоты отправки (максимум 3 сообщения в час с одного IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$messagesFile = 'messages.json';
$messages = [];

if (file_exists($messagesFile)) {
    $fileContent = file_get_contents($messagesFile);
    if ($fileContent) {
        $messages = json_decode($fileContent, true) ?: [];
    }
}

$recentMessages = array_filter($messages, function($msg) use ($ip) {
    return isset($msg['ip']) && $msg['ip'] === $ip && 
           strtotime($msg['timestamp']) > (time() - 3600); // Последний час
});

if (count($recentMessages) >= 3) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Слишком много сообщений. Попробуйте позже.']);
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
    'ip' => $ip,
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'unknown'
];

// Добавляем новое сообщение
$messages[] = $messageData;

// Сохраняем в файл
if (file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    // Отправляем уведомление администратору (опционально)
    sendAdminNotification($messageData);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
        'data' => $messageData
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении сообщения']);
}

// Функция отправки уведомления администратору
function sendAdminNotification($messageData) {
    $adminEmail = 'onixcp23@gmail.com'; // Замените на ваш email
    $subject = 'Новое сообщение с сайта EuroOil';
    
    $body = "Получено новое сообщение:\n\n";
    $body .= "Имя: " . $messageData['name'] . "\n";
    $body .= "Email: " . $messageData['email'] . "\n";
    $body .= "Телефон: " . $messageData['phone'] . "\n";
    $body .= "Сообщение: " . $messageData['message'] . "\n";
    $body .= "Время: " . $messageData['timestamp'] . "\n";
    $body .= "IP: " . $messageData['ip'] . "\n";
    
    // Отправляем email (раскомментируйте если нужны email уведомления)
    // mail($adminEmail, $subject, $body);
}
?> 