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
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/bg-\[#0a0a0a\]\/90/g, 'bg-[#FAF7F2]/90');
    content = content.replace(/bg-\[#0a0a0a\]\/80/g, 'bg-[#FAF7F2]/80');
    content = content.replace(/bg-\[#0a0a0a\]\/50/g, 'bg-gray-50');
    content = content.replace(/bg-\[#0a0a0a\]\/40/g, 'bg-gray-50');
    content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-white');
    content = content.replace(/bg-\[#141414\]/g, 'bg-white');
    
    // Text inside those boxes (which used to be text-white or text-gray-400)
    // We already replaced some #BAFF02 stuff earlier.
    content = content.replace(/text-white/g, 'text-[#1C221F]');
    content = content.replace(/text-gray-400/g, 'text-gray-500');
    content = content.replace(/text-gray-300/g, 'text-gray-600');
    content = content.replace(/text-gray-100/g, 'text-[#1C221F]');

    // Borders
    content = content.replace(/border-white\/5/g, 'border-[#E8E3D9]');
    content = content.replace(/border-white\/10/g, 'border-[#E8E3D9]');
    content = content.replace(/border-white\/20/g, 'border-[#E8E3D9]');
    content = content.replace(/divide-white\/5/g, 'divide-[#E8E3D9]');
    content = content.replace(/divide-white\/10/g, 'divide-[#E8E3D9]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated light theme in ${filePath}`);
    }
}

walkDir(path.join(__dirname, 'src', 'app'), processFile);
walkDir(path.join(__dirname, 'src', 'components'), processFile);
console.log('Done replacement.');
