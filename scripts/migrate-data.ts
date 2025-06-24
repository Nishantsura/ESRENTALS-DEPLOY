import { createClient } from '@supabase/supabase-js';
import { adminDb } from '../src/lib/firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

interface FirebaseBrand {
  name: string;
  slug: string;
  logo?: string;
  featured?: boolean;
  description?: string;
  carCount?: number;
}

interface FirebaseCategory {
  name: string;
  type: 'carType' | 'fuelType' | 'tag';
  slug: string;
  image?: string;
  featured?: boolean;
  description?: string;
}

interface FirebaseCar {
  name: string;
  brand: string;
  year: number;
  type: string;
  fuelType: string;
  transmission: string;
  seats?: number;
  engineCapacity?: string;
  power?: string;
  dailyPrice: number;
  rating?: number;
  advancePayment?: boolean;
  rareCar?: boolean;
  featured?: boolean;
  available?: boolean;
  description?: string;
  images?: string[];
  tags?: string[];
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

async function migrateData() {
  console.log('🚀 Starting AutoLuxe data migration from Firebase to Supabase...');
  
  try {
    // Step 1: Migrate brands
    console.log('📦 Migrating brands...');
    const brandsSnapshot = await adminDb.collection('brands').get();
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as FirebaseBrand
    }));

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
          console.error(`❌ Error migrating brand ${brand.name}:`, error);
        } else {
          console.log(`✅ Migrated brand: ${brand.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate brand ${brand.name}:`, error);
      }
    }

    // Step 2: Migrate categories
    console.log('📂 Migrating categories...');
    const categoriesSnapshot = await adminDb.collection('categories').get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as FirebaseCategory
    }));

    for (const category of categories) {
      try {
        const { error } = await supabase
          .from('categories')
          .insert({
            id: category.id,
            name: category.name,
            type: category.type,
            slug: category.slug,
            image: category.image || null,
            featured: category.featured || false,
            description: category.description || null
          });

        if (error) {
          console.error(`❌ Error migrating category ${category.name}:`, error);
        } else {
          console.log(`✅ Migrated category: ${category.name} (${category.type})`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate category ${category.name}:`, error);
      }
    }

    // Step 3: Migrate cars
    console.log('🚗 Migrating cars...');
    const carsSnapshot = await adminDb.collection('cars').get();
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as FirebaseCar
    }));

    for (const car of cars) {
      try {
        // Get brand_id from brands table
        const { data: brandData } = await supabase
          .from('brands')
          .select('id')
          .eq('name', car.brand)
          .single();

        const { error } = await supabase
          .from('cars')
          .insert({
            id: car.id,
            name: car.name,
            brand_id: brandData?.id || null,
            brand_name: car.brand,
            year: car.year,
            type: car.type,
            fuel_type: car.fuelType,
            transmission: car.transmission,
            seats: car.seats || 4,
            engine_capacity: car.engineCapacity || null,
            power: car.power || null,
            daily_price: car.dailyPrice,
            rating: car.rating || 5.0,
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
          console.error(`❌ Error migrating car ${car.name}:`, error);
        } else {
          console.log(`✅ Migrated car: ${car.name} (${car.brand})`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate car ${car.name}:`, error);
      }
    }

    // Step 4: Verify migration
    console.log('🔍 Verifying migration...');
    
    const { count: brandsCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });
    
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    const { count: carsCount } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Migration Summary:');
    console.log(`   Brands: ${brandsCount} migrated`);
    console.log(`   Categories: ${categoriesCount} migrated`);
    console.log(`   Cars: ${carsCount} migrated`);
    console.log(`   Original Firebase: ${brands.length} brands, ${categories.length} categories, ${cars.length} cars`);

    console.log('🎉 Data migration completed successfully!');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  }
}

async function preMigrationCheck() {
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
}

if (process.argv.includes('--check-only')) {
  preMigrationCheck();
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateData }; 