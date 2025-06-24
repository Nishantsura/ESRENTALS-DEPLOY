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

async function migrateBrandsOnly() {
  console.log('🚀 Starting BRANDS-ONLY migration from Firebase to Supabase...');
  
  try {
    // Step 1: Get brands from Firebase
    console.log('📦 Fetching brands from Firebase...');
    const brandsSnapshot = await adminDb.collection('brands').get();
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📊 Found ${brands.length} brands in Firebase`);
    
    // Step 2: Migrate each brand
    console.log('🔄 Migrating brands to Supabase...');
    let successCount = 0;
    let errorCount = 0;

    for (const brand of brands) {
      try {
        const { error } = await supabase
          .from('brands')
          .insert({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo || null,
            featured: brand.featured || false,
            description: brand.description || null,
            car_count: brand.carCount || 0
          });

        if (error) {
          console.error(`❌ Error migrating brand "${brand.name}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Migrated brand: "${brand.name}" (ID: ${brand.id})`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to migrate brand "${brand.name}":`, error.message);
        errorCount++;
      }
    }

    // Step 3: Verify migration
    console.log('\n🔍 Verifying brands migration...');
    
    const { count: brandsCount, error: countError } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting brands in Supabase:', countError.message);
    } else {
      console.log(`📊 Supabase brands count: ${brandsCount}`);
    }

    // Step 4: Show sample migrated data
    console.log('\n📋 Sample migrated brands:');
    const { data: sampleBrands, error: sampleError } = await supabase
      .from('brands')
      .select('id, name, slug')
      .limit(5);
    
    if (sampleError) {
      console.error('❌ Error fetching sample brands:', sampleError.message);
    } else if (sampleBrands && sampleBrands.length > 0) {
      sampleBrands.forEach(brand => {
        console.log(`   - ${brand.name} (ID: ${brand.id}, Slug: ${brand.slug})`);
      });
    }

    // Step 5: Summary
    console.log('\n📋 BRANDS MIGRATION SUMMARY:');
    console.log(`   Original Firebase brands: ${brands.length}`);
    console.log(`   Successfully migrated: ${successCount}`);
    console.log(`   Failed migrations: ${errorCount}`);
    console.log(`   Final Supabase count: ${brandsCount}`);
    
    if (successCount === brands.length && brandsCount === brands.length) {
      console.log('🎉 BRANDS MIGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ Ready to proceed with categories migration');
    } else {
      console.log('⚠️  BRANDS MIGRATION COMPLETED WITH ISSUES');
      console.log('❌ Please review errors before proceeding');
    }

  } catch (error) {
    console.error('💥 Brands migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateBrandsOnly()
  .then(() => {
    console.log('✅ Brands migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Brands migration script failed:', error);
    process.exit(1);
  }); 