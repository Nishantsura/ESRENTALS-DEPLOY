require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}
const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
const parsedKey = decodedKey.replace(/\\n/g, '\\n');
const serviceAccount = JSON.parse(parsedKey);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();
const OUTPUT_DIR = path.join(__dirname, '../firebase-storage-export');

async function downloadAllFiles() {
  console.log('🚀 Listing all files in Firebase Storage...');
  const [files] = await bucket.getFiles();
  console.log(`📦 Found ${files.length} files in storage bucket.`);

  for (const file of files) {
    const destPath = path.join(OUTPUT_DIR, file.name);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    try {
      await file.download({ destination: destPath });
      console.log(`✅ Downloaded: ${file.name}`);
    } catch (err) {
      console.error(`❌ Failed to download ${file.name}:`, err.message);
    }
  }
  console.log('🎉 All files downloaded to', OUTPUT_DIR);
}

downloadAllFiles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('💥 Error exporting Firebase Storage images:', err);
    process.exit(1);
  }); 