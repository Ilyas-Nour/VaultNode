const fs = require('fs');
const path = require('path');

const tools = [
  'wordToPdf', 'pdfToPpt', 'pptToPdf', 
  'excelToPdf', 'pdfToExcel', 'htmlToPdf', 'scanToPdf'
];

const data = {
  en: {
    names: ['Word to PDF', 'PDF to PPT', 'PPT to PDF', 'Excel to PDF', 'PDF to Excel', 'HTML to PDF', 'Scan to PDF'],
    desc: [
      'Change a Word document perfectly into a PDF.',
      'Turn your PDF into a presentation with slides.',
      'Save your presentation as a secure PDF.',
      'Show your spreadsheet clearly as a PDF.',
      'Pull the tables out of a PDF into Excel.',
      'Save a web page file as a clean PDF.',
      'Use your camera to make a perfect PDF document.'
    ],
    baBefore: [
      'A Word file that anyone can type over.',
      'A PDF file you want to present on screen.',
      'A presentation you want to lock.',
      'A messy spreadsheet with random numbers.',
      'Data locked inside a PDF file.',
      'Web code that is hard to read.',
      'Paper documents sitting on your physical desk.'
    ],
    baAfter: [
      'A clean, professional PDF ready to share.',
      'A slideshow you can click through.',
      'A secure PDF that looks exactly like your slides.',
      'A perfectly printed PDF page.',
      'A spreadsheet you can easily edit and calculate.',
      'A beautifully formatted document.',
      'A high-quality digital PDF on your machine.'
    ],
    dropTitle: "Drop File Here",
    dropDesc: "or click to browse your folders",
    downloadBtn: "Download", converting: "Converting...", readyToDownload: "Ready to Download", startOver: "Start Over",
    howThisWorks: "How This Works", howThisWorksDesc: "100% locally in your browser memory.", errorDesc: "An error occurred during conversion.", compilePdf: "Compile PDF",
    steps: {
      step1Title: "Select Document", step1Desc: "Choose the file you want to convert.",
      step2Title: "Process Locally", step2Desc: "We convert it entirely in your browser.",
      step3Title: "Download Safely", step3Desc: "Download your new file securely."
    }
  },
  es: {
    names: ['Word a PDF', 'PDF a PPT', 'PPT a PDF', 'Excel a PDF', 'PDF a Excel', 'HTML a PDF', 'Escanear a PDF'],
    desc: [
      'Convierte un documento Word perfectamente en PDF.',
      'Convierte tu PDF en una presentación con diapositivas.',
      'Guarda tu presentación como un PDF seguro.',
      'Muestra tu hoja de cálculo claramente como PDF.',
      'Extrae tablas de un PDF a Excel.',
      'Guarda un archivo web como un PDF limpio.',
      'Usa tu cámara para crear un documento PDF perfecto.'
    ],
    baBefore: [
      'Un archivo Word que cualquiera puede modificar.',
      'Un archivo PDF que quieres presentar en pantalla.',
      'Una presentación que quieres bloquear.',
      'Una hoja de cálculo desordenada.',
      'Datos bloqueados dentro de un archivo PDF.',
      'Código web difícil de leer.',
      'Documentos de papel en tu escritorio físico.'
    ],
    baAfter: [
      'Un PDF limpio y profesional.',
      'Una presentación de diapositivas interactiva.',
      'Un PDF seguro idéntico a tus diapositivas.',
      'Una página PDF perfectamente impresa.',
      'Una hoja de cálculo editable.',
      'Un documento hermosamente formateado.',
      'Un PDF digital de alta calidad.'
    ],
    dropTitle: "Suelta el archivo aquí", dropDesc: "o haz clic para explorar tus carpetas",
    downloadBtn: "Descargar", converting: "Convirtiendo...", readyToDownload: "Listo para Descargar", startOver: "Empezar de Nuevo",
    howThisWorks: "Cómo Funciona", howThisWorksDesc: "100% localmente en la memoria de tu navegador.", errorDesc: "Ocurrió un error durante la conversión.", compilePdf: "Compilar PDF",
    steps: {
      step1Title: "Seleccionar Documento", step1Desc: "Elige el archivo que quieres convertir.",
      step2Title: "Procesamiento Local", step2Desc: "Lo convertimos enteramente en tu navegador.",
      step3Title: "Descarga Segura", step3Desc: "Descarga tu nuevo archivo de forma segura."
    }
  },
  fr: {
    names: ['Word vers PDF', 'PDF vers PPT', 'PPT vers PDF', 'Excel vers PDF', 'PDF vers Excel', 'HTML vers PDF', 'Scanner en PDF'],
    desc: [
      "Changez un document Word parfaitement en PDF.",
      "Transformez votre PDF en une présentation avec des diapositives.",
      "Enregistrez votre présentation sous forme de PDF sécurisé.",
      "Affichez clairement votre feuille de calcul sous forme de PDF.",
      "Extrayez les tableaux d'un PDF vers Excel.",
      "Enregistrez un fichier de page Web sous forme de PDF propre.",
      "Utilisez votre appareil photo pour créer un document PDF parfait."
    ],
    baBefore: [
      "Un fichier Word que n'importe qui peut modifier.",
      "Un fichier PDF que vous souhaitez présenter.",
      "Une présentation à verrouiller.",
      "Une feuille de calcul en désordre.",
      "Données verrouillées dans un fichier PDF.",
      "Code Web difficile à lire.",
      "Documents papier sur votre bureau physique."
    ],
    baAfter: [
      "Un PDF propre et professionnel.",
      "Un diaporama que vous pouvez faire défiler.",
      "Un PDF sécurisé qui ressemble exactement à vos diapositives.",
      "Une page PDF parfaitement imprimée.",
      "Une feuille de calcul que vous pouvez facilement modifier.",
      "Un document magnifiquement formaté.",
      "Un PDF numérique de haute qualité."
    ],
    dropTitle: "Déposez le fichier ici", dropDesc: "ou cliquez pour parcourir vos dossiers",
    downloadBtn: "Télécharger", converting: "Conversion en cours...", readyToDownload: "Prêt à être téléchargé", startOver: "Recommencer",
    howThisWorks: "Comment ça marche", howThisWorksDesc: "100% localement dans la mémoire de votre navigateur.", errorDesc: "Une erreur s'est produite lors de la conversion.", compilePdf: "Compiler le PDF",
    steps: {
      step1Title: "Sélectionner le document", step1Desc: "Choisissez le fichier que vous souhaitez convertir.",
      step2Title: "Traitement local", step2Desc: "Nous le convertissons entièrement dans votre navigateur.",
      step3Title: "Téléchargement sécurisé", step3Desc: "Téléchargez votre nouveau fichier en toute sécurité."
    }
  },
  ar: {
    names: ['وورد إلى PDF', 'PDF إلى بوربوينت', 'بوربوينت إلى PDF', 'إكسيل إلى PDF', 'PDF إلى إكسيل', 'HTML إلى PDF', 'مسح إلى PDF'],
    desc: [
      "تحويل مستند وورد إلى PDF بشكل مثالي.",
      "تحويل ملف PDF إلى عرض تقديمي مع شرائح.",
      "حفظ العرض التقديمي كملف PDF آمن.",
      "إظهار جدول البيانات بوضوح كملف PDF.",
      "استخراج الجداول من PDF إلى إكسيل.",
      "حفظ ملف صفحة ويب كملف PDF نظيف.",
      "استخدم الكاميرا لإنشاء مستند PDF مثالي."
    ],
    baBefore: [
      "ملف وورد يمكن لأي شخص الكتابة فوقه.",
      "ملف PDF تريد عرضه على الشاشة.",
      "عرض تقديمي تريد قفله.",
      "جدول بيانات فوضوي.",
      "بيانات مقفلة داخل ملف PDF.",
      "كود الويب يصعب قراءته.",
      "مستندات ورقية جالسة على مكتبك الفعلي."
    ],
    baAfter: [
      "ملف PDF نظيف واحترافي.",
      "عرض تفاعلي يمكنك النقر خلاله.",
      "ملف PDF آمن يبدو تمامًا مثل الشرائح.",
      "صفحة PDF مطبوعة بشكل مثالي.",
      "جدول بيانات يمكنك تحريره بسهولة.",
      "مستند منسق بشكل جميل.",
      "ملف PDF رقمي عالي الجودة."
    ],
    dropTitle: "أسقط الملف هنا", dropDesc: "أو انقر لتصفح مجلداتك",
    downloadBtn: "تحميل", converting: "جاري التحويل...", readyToDownload: "جاهز للتحميل", startOver: "ابدأ من جديد",
    howThisWorks: "كيف يعمل هذا", howThisWorksDesc: "100٪ محليا في ذاكرة المتصفح الخاص بك.", errorDesc: "حدث خطأ أثناء التحويل.", compilePdf: "تجميع PDF",
    steps: {
      step1Title: "حدد المستند", step1Desc: "اختر الملف الذي تريد تحويله.",
      step2Title: "معالجة محلية", step2Desc: "نقوم بتحويله بالكامل في متصفحك.",
      step3Title: "تحميل آمن", step3Desc: "قم بتنزيل ملفك الجديد بأمان."
    }
  }
};

const translationsDir = path.join(__dirname, 'messages');

['en', 'es', 'fr', 'ar'].forEach(lang => {
  const file = path.join(translationsDir, `${lang}.json`);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const d = data[lang];
  
  // Footer links & Hero tools
  tools.forEach((tId, i) => {
    json.HomePage.footer[`link${tId.charAt(0).toUpperCase() + tId.slice(1)}`] = d.names[i];
    json.HomePage[tId] = d.names[i];
    json.HomePage.toolDescriptions[tId] = d.desc[i];
    json.HomePage.beforeAfter[tId] = {
      before: d.baBefore[i],
      after: d.baAfter[i]
    };
  });

  // Tools namespaces
  tools.forEach((tId, i) => {
    json.Tools[tId] = {
      title: d.names[i],
      description: d.desc[i],
      dropTitle: d.dropTitle,
      dropDesc: d.dropDesc,
      downloadBtn: d.downloadBtn,
      converting: d.converting,
      readyToDownload: d.readyToDownload,
      startOver: d.startOver,
      howThisWorks: d.howThisWorks,
      howThisWorksDesc: d.howThisWorksDesc,
      errorDesc: d.errorDesc,
      howItWorks: {
        step1: { title: d.steps.step1Title, desc: d.steps.step1Desc },
        step2: { title: d.steps.step2Title, desc: d.steps.step2Desc },
        step3: { title: d.steps.step3Title, desc: d.steps.step3Desc }
      }
    };
    if (tId === 'scanToPdf') json.Tools[tId].compilePdf = d.compilePdf;
  });

  // Metadata namespaces
  tools.forEach((tId, i) => {
    json.Metadata[tId] = {
      title: `${d.names[i]} | PrivaFlow`,
      description: d.desc[i],
      keywords: `${d.names[i].toLowerCase()}, ${tId}`
    };
  });

  fs.writeFileSync(file, JSON.stringify(json, null, 4));
});
