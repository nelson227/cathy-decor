import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple 1x1 transparent PNG (smallest valid PNG)
const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00,
  0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F,
  0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
  0x54, 0x08, 0x99, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00,
  0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

// Create decorations folder if it doesn't exist
const uploadsDir = path.join(__dirname, '../../public/uploads/decorations');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`✅ Created directory: ${uploadsDir}`);
}

// Write test images
const testImageNames = ['test-image-1.jpg', 'test-image-2.jpg'];
testImageNames.forEach(filename => {
  const filePath = path.join(uploadsDir, filename);
  try {
    fs.writeFileSync(filePath, pngBuffer);
    console.log(`✅ Created test image: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to create ${filename}:`, error.message);
  }
});

console.log('\n📸 Test images created successfully!');
console.log('These are 1x1 transparent PNG files - they exist but are tiny.');
console.log('The important part is that they now exist on the filesystem.\n');
