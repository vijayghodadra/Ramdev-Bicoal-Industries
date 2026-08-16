import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');

async function processImages() {
  const files = fs.readdirSync(assetsDir);
  
  for (const file of files) {
    if (file.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      const filePath = path.join(assetsDir, file);
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const newFilePath = path.join(assetsDir, `${baseName}.webp`);
      
      try {
        console.log(`Processing ${file}...`);
        await sharp(filePath)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(newFilePath);
        console.log(`Successfully converted to ${baseName}.webp`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

processImages();
