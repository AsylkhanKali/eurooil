<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EuroOil - Админ панель</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: #1e40af;
            color: white;
            padding: 20px 0;
            margin-bottom: 30px;
            border-radius: 10px;
        }
        
        .header h1 {
            text-align: center;
            font-size: 2rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #1e40af;
        }
        
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
        
        .controls {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .search-box {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            margin-bottom: 15px;
        }
        
        .btn {
            background: #1e40af;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #1e3a8a;
        }
        
        .btn-danger {
            background: #dc2626;
        }
        
        .btn-danger:hover {
            background: #b91c1c;
        }
        
        .messages {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .message {
            border-bottom: 1px solid #eee;
            padding: 20px;
            transition: background 0.3s;
        }
        
        .message:hover {
            background: #f9f9f9;
        }
        
        .message:last-child {
            border-bottom: none;
        }
        
        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .message-info {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #666;
        }
        
        .message-name {
            font-weight: bold;
            color: #1e40af;
            font-size: 18px;
        }
        
        .message-email {
            color: #059669;
        }
        
        .message-phone {
            color: #7c3aed;
        }
        
        .message-time {
            color: #666;
            font-size: 12px;
        }
        
        .message-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #1e40af;
        }
        
        .no-messages {
            text-align: center;
            padding: 50px;
            color: #666;
        }
        
        .loading {
            text-align: center;
            padding: 50px;
            color: #666;
        }
        
        @media (max-width: 768px) {
            .stats {
                grid-template-columns: 1fr;
            }
            
            .message-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .message-info {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 EuroOil - Админ панель сообщений</h1>
        </div>
        
        <div class="stats" id="stats">
            <div class="stat-card">
                <div class="stat-number" id="totalMessages">0</div>
                <div class="stat-label">Всего сообщений</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="todayMessages">0</div>
                <div class="stat-label">Сегодня</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="weekMessages">0</div>
                <div class="stat-label">За неделю</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="monthMessages">0</div>
                <div class="stat-label">За месяц</div>
            </div>
        </div>
        
        <div class="controls">
            <input type="text" class="search-box" id="searchBox" placeholder="Поиск по имени, email или сообщению...">
            <button class="btn" onclick="exportMessages()">📥 Экспорт JSON</button>
            <button class="btn" onclick="refreshMessages()">🔄 Обновить</button>
            <button class="btn btn-danger" onclick="clearMessages()">🗑️ Очистить все</button>
        </div>
        
        <div class="messages" id="messagesContainer">
            <div class="loading">Загрузка сообщений...</div>
        </div>
    </div>

    <script>
        let allMessages = [];
        
        // Загружаем сообщения
        function loadMessages() {
            fetch('messages.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Файл не найден');
                    }
                    return response.json();
                })
                .then(messages => {
                    allMessages = messages || [];
                    updateStats();
                    displayMessages(allMessages);
                })
                .catch(error => {
                    console.error('Ошибка загрузки:', error);
                    document.getElementById('messagesContainer').innerHTML = 
                        '<div class="no-messages">Сообщений пока нет</div>';
                    updateStats();
                });
        }
        
        // Обновляем статистику
        function updateStats() {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            
            const total = allMessages.length;
            const todayCount = allMessages.filter(msg => new Date(msg.timestamp) >= today).length;
            const weekCount = allMessages.filter(msg => new Date(msg.timestamp) >= weekAgo).length;
            const monthCount = allMessages.filter(msg => new Date(msg.timestamp) >= monthAgo).length;
            
            document.getElementById('totalMessages').textContent = total;
            document.getElementById('todayMessages').textContent = todayCount;
            document.getElementById('weekMessages').textContent = weekCount;
            document.getElementById('monthMessages').textContent = monthCount;
        }
        
        // Отображаем сообщения
        function displayMessages(messages) {
            const container = document.getElementById('messagesContainer');
            
            if (messages.length === 0) {
                container.innerHTML = '<div class="no-messages">Сообщений не найдено</div>';
                return;
            }
            
            // Сортируем по времени (новые сверху)
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            const html = messages.map(message => `
                <div class="message">
                    <div class="message-header">
                        <div class="message-info">
                            <span class="message-name">${escapeHtml(message.name)}</span>
                            <span class="message-email">${escapeHtml(message.email)}</span>
                            ${message.phone ? `<span class="message-phone">${escapeHtml(message.phone)}</span>` : ''}
                        </div>
                        <div class="message-time">${formatDate(message.timestamp)}</div>
                    </div>
                    <div class="message-content">${escapeHtml(message.message)}</div>
                </div>
            `).join('');
            
            container.innerHTML = html;
        }
        
        // Поиск
        function searchMessages() {
            const searchTerm = document.getElementById('searchBox').value.toLowerCase();
            const filtered = allMessages.filter(message => 
                message.name.toLowerCase().includes(searchTerm) ||
                message.email.toLowerCase().includes(searchTerm) ||
                message.message.toLowerCase().includes(searchTerm) ||
                (message.phone && message.phone.toLowerCase().includes(searchTerm))
            );
            displayMessages(filtered);
        }
        
        // Экспорт
        function exportMessages() {
            const dataStr = JSON.stringify(allMessages, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `eurooil_messages_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
        
        // Обновить
        function refreshMessages() {
            loadMessages();
        }
        
        // Очистить все
        function clearMessages() {
            if (confirm('Вы уверены, что хотите удалить все сообщения?')) {
                fetch('clear_messages.php', {method: 'POST'})
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            allMessages = [];
                            updateStats();
                            displayMessages([]);
                            alert('Все сообщения удалены');
                        } else {
                            alert('Ошибка при удалении: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Ошибка при удалении: ' + error.message);
                    });
            }
        }
        
        // Вспомогательные функции
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('ru-RU');
        }
        
        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            loadMessages();
            
            // Поиск при вводе
            document.getElementById('searchBox').addEventListener('input', searchMessages);
            
            // Автообновление каждые 30 секунд
            setInterval(loadMessages, 30000);
        });
    </script>
</body>
</html> 