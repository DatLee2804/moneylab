const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.css') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // bg-[#baff02] text-[#0F2E1E] -> bg-[#133E2B] text-white
    content = content.replace(/bg-\[#BAFF02\] text-\[#0F2E1E\]/gi, 'bg-[#133E2B] text-white');
    content = content.replace(/text-\[#0F2E1E\] bg-\[#BAFF02\]/gi, 'text-white bg-[#133E2B]');
    content = content.replace(/text-\[#0a0a0a\] bg-\[#BAFF02\]/gi, 'text-white bg-[#133E2B]');
    content = content.replace(/bg-\[#baff02\] text-\[#0a0a0a\]/gi, 'bg-[#133E2B] text-white');

    // Replace text colors
    content = content.replace(/text-\[#baff02\]/gi, 'text-[#1C221F]');

    // Replace other Tailwind classes
    content = content.replace(/bg-\[#baff02\]/gi, 'bg-[#133E2B]');
    content = content.replace(/border-\[#baff02\]/gi, 'border-[#133E2B]');
    content = content.replace(/ring-\[#baff02\]/gi, 'ring-[#133E2B]');
    content = content.replace(/shadow-\[#baff02\]/gi, 'shadow-[#133E2B]');
    content = content.replace(/decoration-\[#baff02\]/gi, 'decoration-[#133E2B]');
    content = content.replace(/from-\[#baff02\]/gi, 'from-[#133E2B]');
    content = content.replace(/to-\[#baff02\]/gi, 'to-[#133E2B]');
    content = content.replace(/via-\[#baff02\]/gi, 'via-[#133E2B]');
    content = content.replace(/group-hover:border-\[#baff02\]/gi, 'group-hover:border-[#133E2B]');
    content = content.replace(/focus-within:border-\[#baff02\]/gi, 'focus-within:border-[#133E2B]');
    content = content.replace(/hover:border-\[#baff02\]/gi, 'hover:border-[#133E2B]');

    // General replacement for any raw hex remaining
    content = content.replace(/#BAFF02/g, '#133E2B');
    content = content.replace(/#baff02/g, '#133E2B');

    // Additionally, the user requested black -> white for Hỗ trợ, báo cáo, combo.
    // For these forms, there's `bg-[#0a0a0a]` and `bg-[#141414]` that might need changing.
    // I will use replace_file_content for them manually if needed, or I can do it broadly if safe.
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

walkDir(path.join(__dirname, 'src', 'components'), processFile);
console.log('Done replacement.');
