require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createTables() {
  console.log('🚀 Creating AutoLuxe tables in Supabase...');
  
  try {
    // Create brands table
    console.log('📋 Creating brands table...');
    const { error: brandsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.brands (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          logo TEXT,
          featured BOOLEAN DEFAULT FALSE,
          description TEXT,
          car_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (brandsError) {
      console.log('⚠️  Brands table creation failed (may already exist):', brandsError.message);
    } else {
      console.log('✅ Brands table created');
    }
    
    // Create categories table
    console.log('📋 Creating categories table...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('carType', 'fuelType', 'tag')),
          slug TEXT NOT NULL,
          image TEXT,
          featured BOOLEAN DEFAULT FALSE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(name, type)
        );
      `
    });
    
    if (categoriesError) {
      console.log('⚠️  Categories table creation failed (may already exist):', categoriesError.message);
    } else {
      console.log('✅ Categories table created');
    }
    
    // Create cars table
    console.log('📋 Creating cars table...');
    const { error: carsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.cars (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
          brand_name TEXT NOT NULL,
          year INTEGER NOT NULL,
          type TEXT NOT NULL,
          fuel_type TEXT NOT NULL,
          transmission TEXT NOT NULL,
          seats INTEGER DEFAULT 4,
          engine_capacity TEXT,
          power TEXT,
          daily_price DECIMAL(10,2) NOT NULL,
          rating DECIMAL(3,2) DEFAULT 5.0,
          advance_payment BOOLEAN DEFAULT FALSE,
          rare_car BOOLEAN DEFAULT FALSE,
          featured BOOLEAN DEFAULT FALSE,
          available BOOLEAN DEFAULT TRUE,
          description TEXT,
          images TEXT[],
          tags TEXT[],
          location JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (carsError) {
      console.log('⚠️  Cars table creation failed (may already exist):', carsError.message);
    } else {
      console.log('✅ Cars table created');
    }
    
    console.log('🎉 All tables created successfully!');
    
    // Verify tables were created
    console.log('\n🔍 Verifying table creation...');
    const tables = ['brands', 'categories', 'cars'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: Created and accessible`);
        }
      } catch (error) {
        console.log(`❌ Table ${table}: Failed to verify`);
      }
    }
    
  } catch (error) {
    console.error('💥 Table creation failed:', error);
    throw error;
  }
}

createTables()
  .then(() => {
    console.log('\n✅ Table creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Table creation failed:', error);
    process.exit(1);
  }); 