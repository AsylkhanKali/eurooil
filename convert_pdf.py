#!/usr/bin/env python3
"""
Скрипт для конвертации PDF в JPEG изображения
"""
import sys
import os
from pathlib import Path

try:
    import fitz  # PyMuPDF
    USE_FITZ = True
except ImportError:
    try:
        from pdf2image import convert_from_path
        USE_FITZ = False
    except ImportError:
        print("Установите библиотеку PyMuPDF:")
        print("python3 -m pip install --user pymupdf")
        print("\nИли используйте pdf2image:")
        print("python3 -m pip install --user pdf2image pillow")
        sys.exit(1)

def convert_pdf_to_images(pdf_path, output_dir):
    """Конвертирует PDF в JPEG изображения"""
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)
    
    if not pdf_path.exists():
        print(f"Ошибка: файл {pdf_path} не найден")
        return False
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Конвертация {pdf_path.name}...")
    
    try:
        if USE_FITZ:
            # Используем PyMuPDF
            doc = fitz.open(str(pdf_path))
            total_pages = len(doc)
            print(f"Найдено страниц: {total_pages}")
            
            for page_num in range(total_pages):
                page = doc[page_num]
                # Используем матрицу для увеличения разрешения (2x = 150 DPI примерно)
                mat = fitz.Matrix(2, 2)
                pix = page.get_pixmap(matrix=mat)
                output_path = output_dir / f"passport_page_{page_num + 1}.jpg"
                pix.save(str(output_path))
                print(f"Страница {page_num + 1}/{total_pages} сохранена: {output_path.name}")
            
            doc.close()
        else:
            # Используем pdf2image
            images = convert_from_path(str(pdf_path), dpi=150)
            for i, image in enumerate(images, start=1):
                output_path = output_dir / f"passport_page_{i}.jpg"
                image.save(output_path, 'JPEG', quality=95)
                print(f"Страница {i} сохранена: {output_path.name}")
        
        print(f"\n✅ Конвертация завершена! Изображения сохранены в {output_dir}")
        print(f"Создано файлов: {len(list(output_dir.glob('passport_page_*.jpg')))}")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при конвертации: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    pdf_file = "images/Паспорт качества ДТ-Е-К4.pdf"
    output_folder = "images/passport_pages"
    
    success = convert_pdf_to_images(pdf_file, output_folder)
    sys.exit(0 if success else 1)
