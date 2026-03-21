import os

for lang in ['en', 'es', 'fr', 'ar']:
    path = f'messages/{lang}.json'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace keys
    new_content = content.replace('"handwritingToText"', '"imageToText"')
    new_content = new_content.replace('"handwriting-to-text"', '"image-to-text"')
    
    # EN specifics
    if lang == 'en':
        new_content = new_content.replace('HANDWRITING TO TEXT', 'IMAGE TO TEXT')
        new_content = new_content.replace('Read messy handwritten notes and turn them into clean digital type automatically.', 'Read printed documents, signs, and notes to turn them into clean digital type automatically.')
        new_content = new_content.replace('"title": "Handwriting to Text"', '"title": "Image to Text"')
        new_content = new_content.replace('AI-powered OCR for handwritten notes and images.', 'Private, local OCR for extracting printed text from images.')
        new_content = new_content.replace('Drag handwritten note or click to upload', 'Drag document image or click to upload')
        new_content = new_content.replace('Take a photo of your handwritten note or upload an existing image file.', 'Take a photo of your document or upload an existing image file.')
        new_content = new_content.replace('Our local OCR engine analyzes the image structure and identifies handwriting patterns.', 'Our local OCR engine analyzes the image structure and identifies printed text patterns.')
    
    if lang == 'es':
        new_content = new_content.replace('ESCRITURA A TEXTO', 'IMAGEN A TEXTO')
        new_content = new_content.replace('Lee notas desordenadas y conviértelas en texto digital automáticamente.', 'Lee documentos impresos y notas para convertirlos en texto digital automáticamente.')
        new_content = new_content.replace('"title": "Escritura a Texto"', '"title": "Imagen a Texto"')
        new_content = new_content.replace('OCR basado en IA para notas escritas a mano e imágenes.', 'OCR local privado para extraer texto impreso de imágenes.')
        new_content = new_content.replace('Arrastra una nota manuscrita o haz clic para subir', 'Arrastra una imagen de documento o haz clic para subir')
        new_content = new_content.replace('Toma una foto de tu nota o sube un archivo de imagen existente.', 'Toma una foto de tu documento o sube un archivo de imagen existente.')
        new_content = new_content.replace('Nuestro motor OCR local analiza la estructura de la imagen y reconoce los patrones de escritura.', 'Nuestro motor OCR local analiza la estructura de la imagen y reconoce los patrones de texto impreso.')

    if lang == 'fr':
        new_content = new_content.replace('MANUSCRIT EN TEXTE', 'IMAGE EN TEXTE')
        new_content = new_content.replace('Lisez les notes manuscrites et convertissez-les automatiquement en texte numérique.', 'Lisez des documents imprimés et des notes pour les convertir automatiquement en texte numérique.')
        new_content = new_content.replace('"title": "Manuscrit en Texte"', '"title": "Image en Texte"')
        new_content = new_content.replace("OCR basé sur l'IA pour les notes manuscrites et les images.", 'OCR local privé pour extraire du texte imprimé à partir d\'images.')
        new_content = new_content.replace('Déposez une note manuscrite ou cliquez pour téléverser', 'Déposez une image de document ou cliquez pour téléverser')
        new_content = new_content.replace('Prenez une photo de votre note ou téléchargez un fichier image existant.', 'Prenez une photo de votre document ou téléchargez un fichier image existant.')
        new_content = new_content.replace("Notre moteur OCR local analyse la structure de l'image et reconnaît les motifs d'écriture.", "Notre moteur OCR local analyse la structure de l'image et reconnaît les motifs de texte imprimé.")

    if lang == 'ar':
        new_content = new_content.replace('من خط اليد إلى نص', 'من صورة إلى نص')
        new_content = new_content.replace('اقرأ خط اليد غير المرتب وحوله إلى كتابة نظيفة تلقائياً.', 'اقرأ المستندات المطبوعة والملاحظات وحولها إلى نص رقمي نظيف تلقائياً.')
        new_content = new_content.replace('تعرف ضوئي على الحروف مدعوم بالذكاء الاصطناعي للملاحظات المكتوبة بخط اليد والصور.', 'تعرف ضوئي محلي خاص لاستخراج النص المطبوع من الصور.')
        new_content = new_content.replace('اسحب ملاحظة مكتوبة بخط اليد أو انقر للرفع', 'اسحب صورة المستند أو انقر للرفع')
        new_content = new_content.replace('التقط صورة لملاحظتك المكتوبة بخط اليد أو ارفع ملف صورة موجود.', 'التقط صورة لمستندك أو ارفع ملف صورة موجود.')
        new_content = new_content.replace('يقوم محرك OCR المحلي لدينا بتحليل هيكل الصورة والتعرف على أنماط خط اليد.', 'يقوم محرك OCR المحلي لدينا بتحليل هيكل الصورة والتعرف على أنماط النص المطبوع.')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
