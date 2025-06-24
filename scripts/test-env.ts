import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('FIREBASE_SERVICE_ACCOUNT_KEY:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Loaded' : 'NOT FOUND');
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.log('Length:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length);
  console.log('First 100 chars:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY.substring(0, 100));
} 