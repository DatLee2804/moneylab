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

const PATTERNS = [
    { search: /md:opacity-0\s+group-hover:opacity-100/g, replace: 'opacity-100' },
    { search: /opacity-0\s+group-hover:opacity-100/g, replace: 'opacity-100' },
    { search: /group-hover:opacity-100/g, replace: '' } // Cleanup any leftover group-hover opacities
];

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    PATTERNS.forEach(p => {
        if (content.match(p.search)) {
            content = content.replace(p.search, p.replace);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated: ${file}`);
    }
});
