require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_DIR = path.join(__dirname, '../firebase-storage-export');

function getBucketAndPath(filePath) {
  // filePath: brands/Ql7dCYJwrXeCM76HFERZ/logo
  const parts = filePath.split(path.sep);
  const bucket = parts[0]; // brands, categories, cars
  const storagePath = parts.slice(1).join('/');
  return { bucket, storagePath };
}

async function uploadFile(localPath, bucket, storagePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: undefined // Let Supabase auto-detect
  });
  if (error) {
    console.error(`❌ Failed to upload ${localPath} to ${bucket}/${storagePath}:`, error.message);
    return false;
  } else {
    console.log(`✅ Uploaded: ${bucket}/${storagePath}`);
    return true;
  }
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

async function uploadAllFiles() {
  const allFiles = walkDir(BASE_DIR);
  console.log(`🚀 Found ${allFiles.length} files to upload.`);
  for (const localPath of allFiles) {
    const relPath = path.relative(BASE_DIR, localPath);
    const { bucket, storagePath } = getBucketAndPath(relPath);
    if (["brands", "categories", "cars"].includes(bucket)) {
      await uploadFile(localPath, bucket, storagePath);
    } else {
      console.warn(`⚠️  Skipping file with unknown bucket: ${relPath}`);
    }
  }
  console.log('🎉 All files uploaded to Supabase Storage.');
}

uploadAllFiles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('💥 Error uploading images to Supabase Storage:', err);
    process.exit(1);
  }); 