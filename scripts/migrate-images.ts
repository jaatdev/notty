// scripts/migrate-images.ts
// Run with: npx tsx scripts/migrate-images.ts
// Requires env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDataUri(dataUri: string, index: number) {
  console.log(`  Uploading image ${index}...`);
  const res = await cloudinary.v2.uploader.upload(dataUri, { 
    folder: 'notty_migrated',
    resource_type: 'image',
  });
  console.log(`  ✓ Uploaded to: ${res.secure_url}`);
  return res.secure_url;
}

function walkAndMark(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    // Check if it's a data URI
    if (obj.startsWith('data:image/')) {
      return { __toUpload: true, src: obj };
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(walkAndMark);
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const k of Object.keys(obj)) {
      newObj[k] = walkAndMark(obj[k]);
    }
    return newObj;
  }
  return obj;
}

async function replaceNodes(node: any, imageCounter: { count: number }): Promise<any> {
  if (!node) return node;
  
  if (Array.isArray(node)) {
    const results = [];
    for (let i = 0; i < node.length; i++) {
      results.push(await replaceNodes(node[i], imageCounter));
    }
    return results;
  }
  
  if (typeof node === 'object') {
    // If this is a marked data URI, upload it
    if (node.__toUpload && node.src) {
      imageCounter.count++;
      const url = await uploadDataUri(node.src, imageCounter.count);
      return url;
    }
    
    // Otherwise recursively process object properties
    const newObj: any = {};
    for (const k of Object.keys(node)) {
      newObj[k] = await replaceNodes(node[k], imageCounter);
    }
    return newObj;
  }
  
  return node;
}

async function main() {
  console.log('🔍 Starting image migration...\n');
  
  // Check if env vars are set
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary credentials not set.');
    console.error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET env vars.');
    process.exit(1);
  }

  const inputFile = path.join(process.cwd(), 'data', 'notes.json');
  const outputFile = path.join(process.cwd(), 'data', 'notes.migrated.json');

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: ${inputFile} not found.`);
    process.exit(1);
  }

  console.log(`📖 Reading ${inputFile}...`);
  const db = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  console.log('🔎 Scanning for base64 images...');
  const marked = walkAndMark(db);

  console.log('📤 Uploading images to Cloudinary...\n');
  const imageCounter = { count: 0 };
  const migrated = await replaceNodes(marked, imageCounter);

  console.log(`\n✅ Migrated ${imageCounter.count} images.`);
  console.log(`💾 Writing to ${outputFile}...`);
  
  fs.writeFileSync(outputFile, JSON.stringify(migrated, null, 2), 'utf8');
  
  console.log('✨ Done! Review notes.migrated.json and replace notes.json if everything looks good.');
}

main().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
