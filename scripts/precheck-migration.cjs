require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');

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
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminDb = admin.firestore();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  console.log('🔍 Pre-migration check: Counting records in Firebase and Supabase...');
  // Firebase counts
  const brandsSnapshot = await adminDb.collection('brands').get();
  const categoriesSnapshot = await adminDb.collection('categories').get();
  const carsSnapshot = await adminDb.collection('cars').get();
  console.log(`Firebase: Brands: ${brandsSnapshot.size}, Categories: ${categoriesSnapshot.size}, Cars: ${carsSnapshot.size}`);

  // Supabase counts
  const { count: brandsCount } = await supabase.from('brands').select('*', { count: 'exact', head: true });
  const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: carsCount } = await supabase.from('cars').select('*', { count: 'exact', head: true });
  console.log(`Supabase: Brands: ${brandsCount}, Categories: ${categoriesCount}, Cars: ${carsCount}`);
  process.exit(0);
})(); 