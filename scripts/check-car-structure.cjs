require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

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

async function checkCarStructure() {
  console.log('🔍 Checking Firebase car data structure...');
  
  try {
    const carsSnapshot = await adminDb.collection('cars').limit(3).get();
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📊 Found ${cars.length} sample cars`);
    
    cars.forEach((car, index) => {
      console.log(`\n📋 Car ${index + 1}: "${car.name || 'Unknown'}" (ID: ${car.id})`);
      console.log('   Available fields:');
      
      Object.keys(car).forEach(key => {
        const value = car[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        const preview = Array.isArray(value) 
          ? `[${value.length} items]` 
          : typeof value === 'object' && value !== null
          ? '[object]'
          : String(value).substring(0, 50);
        
        console.log(`     - ${key}: ${type} = ${preview}`);
      });
    });

    // Check for common field name variations
    console.log('\n🔍 Checking for common field name variations...');
    const allFields = new Set();
    cars.forEach(car => {
      Object.keys(car).forEach(key => allFields.add(key));
    });
    
    const commonVariations = {
      'brandName': ['brandName', 'brand', 'brand_name', 'make'],
      'year': ['year', 'modelYear', 'carYear'],
      'type': ['type', 'carType', 'vehicleType', 'category'],
      'fuelType': ['fuelType', 'fuel', 'fuel_type', 'engineType'],
      'transmission': ['transmission', 'trans', 'gear'],
      'dailyPrice': ['dailyPrice', 'price', 'daily_price', 'rate', 'rentalPrice'],
      'seats': ['seats', 'seatCount', 'passengers'],
      'engineCapacity': ['engineCapacity', 'engine', 'capacity', 'displacement'],
      'power': ['power', 'horsepower', 'hp', 'enginePower'],
      'rating': ['rating', 'score', 'stars'],
      'advancePayment': ['advancePayment', 'advance', 'deposit'],
      'rareCar': ['rareCar', 'rare', 'exclusive'],
      'featured': ['featured', 'highlight', 'promoted'],
      'available': ['available', 'inStock', 'status'],
      'description': ['description', 'desc', 'details'],
      'images': ['images', 'image', 'photos', 'gallery'],
      'tags': ['tags', 'tag', 'categories'],
      'location': ['location', 'address', 'place']
    };

    Object.entries(commonVariations).forEach(([expectedField, variations]) => {
      const found = variations.find(v => allFields.has(v));
      if (found) {
        console.log(`   ✅ ${expectedField} found as: ${found}`);
      } else {
        console.log(`   ❌ ${expectedField} not found (checked: ${variations.join(', ')})`);
      }
    });

  } catch (error) {
    console.error('💥 Error checking car structure:', error);
    throw error;
  }
}

checkCarStructure()
  .then(() => {
    console.log('\n✅ Car structure check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Car structure check failed:', error);
    process.exit(1);
  }); 