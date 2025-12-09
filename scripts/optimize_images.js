
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(process.cwd(), 'public/images/projects');
const QUALITY = 80;

async function processImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Directory not found: ${IMAGES_DIR}`);
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR);
  let processedCount = 0;
  let skippedCount = 0;

  console.log(`Found ${files.length} files. Starting optimization...`);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

    if (fs.existsSync(outputPath)) {
      skippedCount++;
      continue; 
    }

    try {
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);
      
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);

      console.log(`✅ ${file} -> .webp (${savings}% smaller)`);
      processedCount++;
    } catch (err) {
      console.error(`❌ Failed to convert ${file}:`, err);
    }
  }

  console.log(`\nDone! Processed: ${processedCount}, Skipped: ${skippedCount}`);
}

processImages();

