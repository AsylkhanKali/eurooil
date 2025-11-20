# Инструкция по конвертации PDF в изображения

Для просмотра паспорта качества на сайте, нужно конвертировать PDF в JPEG изображения.

## Вариант 1: Использование Python скрипта (рекомендуется)

1. Установите библиотеку PyMuPDF:
```bash
python3 -m pip install --user pymupdf
```

Или используйте pdf2image:
```bash
python3 -m pip install --user pdf2image pillow
```

2. Запустите скрипт конвертации:
```bash
python3 convert_pdf.py
```

Скрипт автоматически создаст папку `images/passport_pages/` и сохранит все страницы PDF как `passport_page_1.jpg`, `passport_page_2.jpg` и т.д.

## Вариант 2: Онлайн конвертация

1. Откройте PDF файл `images/Паспорт качества ДТ-Е-К4.pdf`
2. Используйте онлайн инструмент для конвертации (например, https://www.ilovepdf.com/pdf-to-jpg)
3. Сохраните все страницы в папку `images/passport_pages/`
4. Переименуйте файлы в формат: `passport_page_1.jpg`, `passport_page_2.jpg`, и т.д.

## Вариант 3: Использование macOS Preview

1. Откройте PDF в Preview
2. Файл → Экспортировать → Выберите формат JPEG
3. Сохраните каждую страницу отдельно в папку `images/passport_pages/`
4. Переименуйте в формат `passport_page_1.jpg`, `passport_page_2.jpg` и т.д.

После конвертации сайт автоматически определит количество страниц и отобразит их с навигацией.

