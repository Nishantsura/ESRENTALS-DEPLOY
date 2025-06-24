require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixBrandsSchema() {
  console.log('🔧 Fixing brands table schema to accept Firebase string IDs...');
  
  try {
    // First, let's check the current schema
    console.log('📋 Checking current brands table schema...');
    
    // Drop the existing brands table and recreate with TEXT ID
    console.log('🔄 Recreating brands table with TEXT ID...');
    
    // Drop existing table
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS public.brands CASCADE;'
    });
    
    if (dropError) {
      console.log('⚠️  Could not drop table (may not exist):', dropError.message);
    }
    
    // Create new table with TEXT ID
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE public.brands (
          id TEXT PRIMARY KEY,
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
    
    if (createError) {
      console.log('❌ Could not create table with exec_sql:', createError.message);
      console.log('📝 Please run this SQL manually in Supabase Dashboard:');
      console.log(`
        DROP TABLE IF EXISTS public.brands CASCADE;
        
        CREATE TABLE public.brands (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          logo TEXT,
          featured BOOLEAN DEFAULT FALSE,
          description TEXT,
          car_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Brands are viewable by everyone" ON public.brands
          FOR SELECT USING (true);
        
        CREATE POLICY "Brands are insertable by authenticated users" ON public.brands
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Brands are updatable by authenticated users" ON public.brands
          FOR UPDATE USING (auth.role() = 'authenticated');
      `);
    } else {
      console.log('✅ Brands table recreated with TEXT ID');
      
      // Re-enable RLS and policies
      const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Brands are viewable by everyone" ON public.brands
            FOR SELECT USING (true);
          
          CREATE POLICY "Brands are insertable by authenticated users" ON public.brands
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          
          CREATE POLICY "Brands are updatable by authenticated users" ON public.brands
            FOR UPDATE USING (auth.role() = 'authenticated');
        `
      });
      
      if (rlsError) {
        console.log('⚠️  Could not set RLS policies:', rlsError.message);
      } else {
        console.log('✅ RLS policies recreated');
      }
    }
    
    // Verify the table
    console.log('\n🔍 Verifying brands table...');
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Brands table verification failed:', error.message);
    } else {
      console.log('✅ Brands table is accessible and ready for migration');
    }
    
  } catch (error) {
    console.error('💥 Schema fix failed:', error);
    throw error;
  }
}

fixBrandsSchema()
  .then(() => {
    console.log('\n✅ Schema fix completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Schema fix failed:', error);
    process.exit(1);
  }); 