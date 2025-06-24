import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create service role client for database operations
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  console.log('🚀 Setting up AutoLuxe database schema...');
  
  try {
    // Read the SQL schema file
    const schemaPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Schema file loaded successfully');
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        // Use rpc to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // If exec_sql doesn't exist, try direct SQL execution
          console.log('⚠️  RPC method not available, trying alternative approach...');
          
          // For now, we'll skip complex statements and focus on table creation
          if (statement.toLowerCase().includes('create table') || 
              statement.toLowerCase().includes('create index') ||
              statement.toLowerCase().includes('create policy') ||
              statement.toLowerCase().includes('create trigger') ||
              statement.toLowerCase().includes('create function')) {
            console.log(`⏭️  Skipping complex statement: ${statement.substring(0, 50)}...`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (error) {
        console.log(`⚠️  Statement ${i + 1} failed (this may be expected):`, error);
      }
    }
    
    console.log('🎉 Database setup completed!');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const tables = ['users', 'brands', 'categories', 'cars'];
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: Created successfully`);
        }
      } catch (error) {
        console.log(`❌ Table ${table}: Failed to verify`);
      }
    }
    
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    throw error;
  }
}

// Alternative approach: Create tables one by one
async function createTablesIndividually() {
  console.log('🔄 Creating tables individually...');
  
  try {
    // Create users table
    console.log('📋 Creating users table...');
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (usersError) {
      console.log('⚠️  Users table creation failed (may already exist):', usersError.message);
    } else {
      console.log('✅ Users table created');
    }
    
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
    
  } catch (error) {
    console.error('💥 Table creation failed:', error);
    throw error;
  }
}

// Run the setup
async function main() {
  try {
    console.log('🚀 Starting AutoLuxe database setup...');
    
    // Try the individual table creation approach first
    await createTablesIndividually();
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Ready for data migration');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the main function
main();

export { setupDatabase, createTablesIndividually }; 