// Batch resize all .webp images in assets/ to 800px wide for mobile
// Requires: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');

fs.readdir(assetsDir, (err, files) => {
  if (err) throw err;
  files.filter(f => f.endsWith('.webp')).forEach(file => {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(assetsDir, file.replace('.webp', '-mobile.webp'));
    sharp(inputPath)
      .resize({ width: 800 })
      .toFile(outputPath)
      .then(() => console.log(`Created: ${outputPath}`))
      .catch(e => console.error(`Error processing ${file}:`, e));
  });
});
