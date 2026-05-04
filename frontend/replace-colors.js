const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
};

const OLD_COLOR = '#166534';
const NEW_COLOR = '#baff02';
const DARK_TEXT = '#0f172a';

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(OLD_COLOR)) {
        // First replace the hex values
        content = content.replace(new RegExp(OLD_COLOR, 'gi'), NEW_COLOR);
        
        // Naive but effective replacements for text contrast
        content = content.replace(/text-white(.*)bg-\[#baff02\]/gi, `text-[${DARK_TEXT}]$1bg-[#baff02]`);
        content = content.replace(/bg-\[#baff02\](.*)text-white/gi, `bg-[#baff02]$1text-[${DARK_TEXT}]`);
        // Specific class replacement for common patterns
        content = content.replace(/bg-\[#baff02\] text-white/gi, `bg-[#baff02] text-[${DARK_TEXT}]`);
        content = content.replace(/text-white bg-\[#baff02\]/gi, `text-[${DARK_TEXT}] bg-[#baff02]`);
        
        fs.writeFileSync(file, content);
        console.log(`Updated: ${file}`);
    }
});
