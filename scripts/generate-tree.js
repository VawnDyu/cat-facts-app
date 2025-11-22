import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ignore = ['node_modules', 'dist', 'build', '.git', 'coverage', '.vscode', 'scripts'];

function generateTree(dir, prefix = '', level = 0, maxLevel = 3) {
  if (level > maxLevel) return '';

  try {
    const items = fs.readdirSync(dir).filter(item => !ignore.includes(item));
    let output = '';

    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const itemPath = path.join(dir, item);

      try {
        const stats = fs.statSync(itemPath);
        const connector = isLast ? '└── ' : '├── ';
        output += `${prefix}${connector}${item}${stats.isDirectory() ? '/' : ''}\n`;

        if (stats.isDirectory() && level < maxLevel) {
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          output += generateTree(itemPath, newPrefix, level + 1, maxLevel);
        }
      } catch (err) {
        // Skip files we can't access
      }
    });

    return output;
  } catch (err) {
    return '';
  }
}

const projectRoot = path.resolve(__dirname, '..');
const projectName = path.basename(projectRoot);
const tree = `${projectName}/\n${generateTree(projectRoot)}`;

console.log(tree);
fs.writeFileSync(path.join(projectRoot, 'project-structure.txt'), tree);
console.log('✅ Project structure saved to project-structure.txt');