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

async function migrateCarsOnly() {
  console.log('🚀 Starting CARS-ONLY migration from Firebase to Supabase...');
  
  try {
    // Step 1: Get cars from Firebase
    console.log('📦 Fetching cars from Firebase...');
    const carsSnapshot = await adminDb.collection('cars').get();
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📊 Found ${cars.length} cars in Firebase`);
    
    // Step 2: Migrate each car
    console.log('🔄 Migrating cars to Supabase...');
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const car of cars) {
      try {
        // Validate required fields using actual Firebase field names
        if (!car.name || !car.brand || !car.year || !car.type || !car.fuelType || !car.transmission || !car.dailyPrice) {
          console.log(`⚠️  Skipping car "${car.name}" - missing required fields`);
          console.log(`   Missing: ${!car.name ? 'name ' : ''}${!car.brand ? 'brand ' : ''}${!car.year ? 'year ' : ''}${!car.type ? 'type ' : ''}${!car.fuelType ? 'fuelType ' : ''}${!car.transmission ? 'transmission ' : ''}${!car.dailyPrice ? 'dailyPrice' : ''}`);
          skippedCount++;
          continue;
        }

        const { error } = await supabase
          .from('cars')
          .insert({
            id: car.id, // Keep Firebase string ID
            name: car.name,
            brand_id: null, // Will be set later if needed
            brand_name: car.brand, // Use 'brand' field from Firebase
            year: parseInt(car.year) || 2024,
            type: car.type,
            fuel_type: car.fuelType,
            transmission: car.transmission,
            seats: parseInt(car.seats) || 4,
            engine_capacity: car.engineCapacity || null,
            power: car.power || null,
            daily_price: parseFloat(car.dailyPrice) || 0,
            rating: parseFloat(car.rating) || 5.0,
            advance_payment: car.advancePayment || false,
            rare_car: car.rareCar || false,
            featured: car.featured || false,
            available: car.available !== false, // Default to true
            description: car.description || null,
            images: car.images || [],
            tags: car.tags || [],
            location: car.location || null
          });

        if (error) {
          console.error(`❌ Error migrating car "${car.name}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Migrated car: "${car.name}" (${car.brand} ${car.year}, ID: ${car.id})`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to migrate car "${car.name}":`, error.message);
        errorCount++;
      }
    }

    // Step 3: Verify migration
    console.log('\n🔍 Verifying cars migration...');
    
    const { count: carsCount, error: countError } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting cars in Supabase:', countError.message);
    } else {
      console.log(`📊 Supabase cars count: ${carsCount}`);
    }

    // Step 4: Show sample migrated data
    console.log('\n📋 Sample migrated cars:');
    const { data: sampleCars, error: sampleError } = await supabase
      .from('cars')
      .select('id, name, brand_name, year, type, daily_price')
      .order('brand_name')
      .limit(10);
    
    if (sampleError) {
      console.error('❌ Error fetching sample cars:', sampleError.message);
    } else if (sampleCars && sampleCars.length > 0) {
      sampleCars.forEach(car => {
        console.log(`   - ${car.brand_name} ${car.name} (${car.year}, ${car.type}, $${car.daily_price}, ID: ${car.id})`);
      });
    }

    // Step 5: Show migration statistics
    console.log('\n📊 Migration Statistics:');
    const { data: brandStats, error: brandStatsError } = await supabase
      .from('cars')
      .select('brand_name')
      .order('brand_name');
    
    if (!brandStatsError && brandStats) {
      const brandCounts = {};
      brandStats.forEach(car => {
        brandCounts[car.brand_name] = (brandCounts[car.brand_name] || 0) + 1;
      });
      
      console.log('   Cars by brand:');
      Object.entries(brandCounts).forEach(([brand, count]) => {
        console.log(`     - ${brand}: ${count} cars`);
      });
    }

    // Step 6: Summary
    console.log('\n📋 CARS MIGRATION SUMMARY:');
    console.log(`   Original Firebase cars: ${cars.length}`);
    console.log(`   Successfully migrated: ${successCount}`);
    console.log(`   Failed migrations: ${errorCount}`);
    console.log(`   Skipped (missing data): ${skippedCount}`);
    console.log(`   Final Supabase count: ${carsCount}`);
    
    if (successCount === cars.length && carsCount === cars.length) {
      console.log('🎉 CARS MIGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ All data migration completed successfully!');
    } else if (successCount > 0 && errorCount === 0) {
      console.log('🎉 CARS MIGRATION COMPLETED WITH MINOR ISSUES!');
      console.log('✅ Core data migration successful (some cars skipped due to missing data)');
    } else {
      console.log('⚠️  CARS MIGRATION COMPLETED WITH ISSUES');
      console.log('❌ Please review errors before proceeding');
    }

  } catch (error) {
    console.error('💥 Cars migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateCarsOnly()
  .then(() => {
    console.log('✅ Cars migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cars migration script failed:', error);
    process.exit(1);
  }); 