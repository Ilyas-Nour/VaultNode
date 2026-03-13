const fs = require('fs');
const path = require('path');

function getKeys(obj, prefix = '') {
    let keys = [];
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

try {
    const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
    const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));

    const enKeys = new Set(getKeys(en));
    const arKeys = new Set(getKeys(ar));

    console.log('--- Missing in AR ---');
    for (let key of Array.from(enKeys).sort()) {
        if (!arKeys.has(key)) {
            console.log(key);
        }
    }

    console.log('\n--- Extra in AR (Potential Typoes) ---');
    for (let key of Array.from(arKeys).sort()) {
        if (!enKeys.has(key)) {
            console.log(key);
        }
    }
} catch (err) {
    console.error('Error processing files:', err.message);
}
