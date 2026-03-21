const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, 'messages');

['en', 'es', 'fr', 'ar'].forEach(lang => {
  const file = path.join(translationsDir, `${lang}.json`);
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"heroStatValue1": "23"/g, '"heroStatValue1": "30"');
  content = content.replace(/23/g, '30'); // "23" appears in sectionAllTitle translations
  fs.writeFileSync(file, content);
});

const readmePath = path.join(__dirname, 'README.md');
if (fs.existsSync(readmePath)) {
  let readme = fs.readFileSync(readmePath, 'utf8');
  readme = readme.replace(/23 Offline Native Tools/g, '30 Offline Native Tools');
  fs.writeFileSync(readmePath, readme);
}
