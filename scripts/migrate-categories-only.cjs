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

async function migrateCategoriesOnly() {
  console.log('🚀 Starting CATEGORIES-ONLY migration from Firebase to Supabase...');
  
  try {
    // Step 1: Get categories from Firebase
    console.log('📦 Fetching categories from Firebase...');
    const categoriesSnapshot = await adminDb.collection('categories').get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📊 Found ${categories.length} categories in Firebase`);
    
    // Step 2: Migrate each category
    console.log('🔄 Migrating categories to Supabase...');
    let successCount = 0;
    let errorCount = 0;

    for (const category of categories) {
      try {
        const { error } = await supabase
          .from('categories')
          .insert({
            id: category.id, // Keep Firebase string ID
            name: category.name,
            type: category.type,
            slug: category.slug,
            image: category.image || null,
            featured: category.featured || false,
            description: category.description || null
          });

        if (error) {
          console.error(`❌ Error migrating category "${category.name}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Migrated category: "${category.name}" (Type: ${category.type}, ID: ${category.id})`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to migrate category "${category.name}":`, error.message);
        errorCount++;
      }
    }

    // Step 3: Verify migration
    console.log('\n🔍 Verifying categories migration...');
    
    const { count: categoriesCount, error: countError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting categories in Supabase:', countError.message);
    } else {
      console.log(`📊 Supabase categories count: ${categoriesCount}`);
    }

    // Step 4: Show sample migrated data by type
    console.log('\n📋 Sample migrated categories by type:');
    const { data: sampleCategories, error: sampleError } = await supabase
      .from('categories')
      .select('id, name, type, slug')
      .order('type')
      .limit(10);
    
    if (sampleError) {
      console.error('❌ Error fetching sample categories:', sampleError.message);
    } else if (sampleCategories && sampleCategories.length > 0) {
      const byType = {};
      sampleCategories.forEach(cat => {
        if (!byType[cat.type]) byType[cat.type] = [];
        byType[cat.type].push(cat);
      });
      
      Object.keys(byType).forEach(type => {
        console.log(`   ${type}:`);
        byType[type].forEach(cat => {
          console.log(`     - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
        });
      });
    }

    // Step 5: Summary
    console.log('\n📋 CATEGORIES MIGRATION SUMMARY:');
    console.log(`   Original Firebase categories: ${categories.length}`);
    console.log(`   Successfully migrated: ${successCount}`);
    console.log(`   Failed migrations: ${errorCount}`);
    console.log(`   Final Supabase count: ${categoriesCount}`);
    
    if (successCount === categories.length && categoriesCount === categories.length) {
      console.log('🎉 CATEGORIES MIGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ Ready to proceed with cars migration');
    } else {
      console.log('⚠️  CATEGORIES MIGRATION COMPLETED WITH ISSUES');
      console.log('❌ Please review errors before proceeding');
    }

  } catch (error) {
    console.error('💥 Categories migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateCategoriesOnly()
  .then(() => {
    console.log('✅ Categories migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Categories migration script failed:', error);
    process.exit(1);
  }); 