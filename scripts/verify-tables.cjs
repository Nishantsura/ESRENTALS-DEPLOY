require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyTables() {
  console.log('🔍 Verifying Supabase tables...');
  
  const tables = ['brands', 'categories', 'cars'];
  
  for (const table of tables) {
    console.log(`\n📋 Checking table: ${table}`);
    
    try {
      // Try to select from the table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table} error:`, error.message);
        
        // Check if it's a "relation does not exist" error
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`   → Table ${table} does not exist in Supabase`);
        }
      } else {
        console.log(`✅ Table ${table} exists and is accessible`);
        console.log(`   → Sample data structure:`, Object.keys(data[0] || {}));
      }
    } catch (error) {
      console.log(`❌ Error checking table ${table}:`, error.message);
    }
  }
}

verifyTables()
  .then(() => {
    console.log('\n✅ Table verification completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Table verification failed:', error);
    process.exit(1);
  }); 