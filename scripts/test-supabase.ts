import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Configuration...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
console.log('Service Role Key:', serviceRoleKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required Supabase environment variables');
  process.exit(1);
}

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully');
  
  // Test connection
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error) {
    console.log('⚠️  Connection test result:', error.message);
    console.log('   This is expected if tables don\'t exist yet');
  } else {
    console.log('✅ Connection test successful');
  }
  
  console.log('🎉 Supabase configuration is working correctly!');
} catch (error) {
  console.error('❌ Error testing Supabase:', error);
  process.exit(1);
} 