const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix unreadable text on dark green backgrounds
    content = content.replace(/bg-\[#133E2B\] text-\[#1C221F\]/g, 'bg-[#133E2B] text-white');
    content = content.replace(/text-\[#1C221F\] bg-\[#133E2B\]/g, 'text-white bg-[#133E2B]');
    
    content = content.replace(/bg-\[#133E2B\] text-\[#0a0a0a\]/g, 'bg-[#133E2B] text-white');
    content = content.replace(/text-\[#0a0a0a\] bg-\[#133E2B\]/g, 'text-white bg-[#133E2B]');

    content = content.replace(/bg-\[#133E2B\] text-\[#0F2E1E\]/g, 'bg-[#133E2B] text-white');
    content = content.replace(/text-\[#0F2E1E\] bg-\[#133E2B\]/g, 'text-white bg-[#133E2B]');

    content = content.replace(/bg-\[#133E2B\] text-black/g, 'bg-[#133E2B] text-white');
    content = content.replace(/text-black bg-\[#133E2B\]/g, 'text-white bg-[#133E2B]');

    content = content.replace(/bg-\[#133E2B\] text-gray-900/g, 'bg-[#133E2B] text-white');
    content = content.replace(/text-gray-900 bg-\[#133E2B\]/g, 'text-white bg-[#133E2B]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated text color on green bg in ${filePath}`);
    }
}

walkDir(path.join(__dirname, 'src', 'app'), processFile);
walkDir(path.join(__dirname, 'src', 'components'), processFile);
console.log('Done replacement.');
