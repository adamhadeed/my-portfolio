// This script renames index.csr.html to index.html and copies _redirects after each build
const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, 'dist', 'my-portfolio-website-2', 'browser');
const redirectsSrc = path.join(__dirname, '_redirects');
const redirectsDest = path.join(browserDir, '_redirects');
const indexCsr = path.join(browserDir, 'index.csr.html');
const indexHtml = path.join(browserDir, 'index.html');

// Rename index.csr.html to index.html if it exists
if (fs.existsSync(indexCsr)) {
  fs.renameSync(indexCsr, indexHtml);
  console.log('Renamed index.csr.html to index.html');
}

// Copy _redirects file if it exists in project root
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, redirectsDest);
  console.log('Copied _redirects to browser folder');
} else {
  console.warn('_redirects file not found in project root.');
}
