/**
 * clone-text.js
 * clone .ts files as .txt to txt/
 */

import fs from 'node:fs';
import path from 'node:path';

const __dirname = import.meta.dirname;
const srcDir = path.join(__dirname, '../src');
const testDir = path.join(__dirname, '../test');
const txtDir = path.join(__dirname, '../txt');

if (fs.existsSync(txtDir)) {
  fs.rmSync(txtDir, { recursive: true, force: true });
}
fs.mkdirSync(txtDir);

let copiedCount = 0;

if (fs.existsSync(srcDir)) {
  const allFiles = fs.readdirSync(srcDir, { recursive: true });
  for (const relativePath of allFiles) {
    if (typeof relativePath === 'string' && relativePath.endsWith('.ts')) {
      const srcPath = path.join(srcDir, relativePath);
      if (fs.statSync(srcPath).isFile()) {
        const safeName = `src_${relativePath.replace(/[\/\\]/g, '_').replace(/\.ts$/, '.txt')}`;
        const destPath = path.join(txtDir, safeName);
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
      }
    }
  }
}

if (fs.existsSync(testDir)) {
  const allFiles = fs.readdirSync(testDir, { recursive: true });
  for (const relativePath of allFiles) {
    if (typeof relativePath === 'string' && relativePath.endsWith('.ts')) {
      const testPath = path.join(testDir, relativePath);
      if (fs.statSync(testPath).isFile()) {
        const safeName = `test_${relativePath.replace(/[\/\\]/g, '_').replace(/\.ts$/, '.txt')}`;
        const destPath = path.join(txtDir, safeName);
        fs.copyFileSync(testPath, destPath);
        copiedCount++;
      }
    }
  }
}

console.log(`Cloned ${copiedCount} .ts files as .txt to txt/`);
