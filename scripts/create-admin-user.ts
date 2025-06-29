import { createClient, PostgrestError, AuthError } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser(email?: string, password?: string) {
  // Use provided email/password or defaults
  const adminEmail = email || 'admin@autoluxe.com';
  const adminPassword = password || 'admin123456'; // WARNING: Use a strong, unique password in production

  // Validate email domain
  if (!adminEmail.endsWith('@autoluxe.com')) {
    console.error('❌ Error: Only @autoluxe.com email addresses are allowed for admin users');
    process.exit(1);
  }

  console.log('🔧 Ensuring admin user exists and has admin privileges...');
  console.log(`   Email: ${adminEmail}`);
  console.log('');

  try {
    // Step 1: Attempt to create the user in Supabase Auth.
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    let authUser = user;

    if (createError && (createError as AuthError).status !== 422) { // 422 is for already registered
      throw new Error(`Error creating auth user: ${createError.message}`);
    } else if (createError) {
      console.log('   - Auth user already exists. Fetching user and resetting password...');
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      const foundUser = users.find(u => u.email === adminEmail);
      if (!foundUser) throw new Error('Could not find user in auth list');
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        foundUser.id,
        { password: adminPassword }
      );

      if (updateError) {
        throw new Error(`Could not update password: ${updateError.message}`);
      }
      console.log('   - Password has been reset successfully.');
      authUser = foundUser;
    } else {
      console.log('   - Auth user created successfully.');
    }
    
    if (!authUser) {
      throw new Error('Could not get auth user');
    }

    // Step 2: Check if the user is in the public.users table and has admin rights.
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('id, is_admin')
      .eq('id', authUser.id)
      .single();

    if (publicUserError && (publicUserError as PostgrestError).code !== 'PGRST116') {
      throw publicUserError; // Re-throw actual errors
    }
    
    if (publicUser) {
      if (!publicUser.is_admin) {
        console.log('   - User exists but is not an admin. Granting admin privileges...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_admin: true })
          .eq('id', authUser.id);
        if (updateError) throw updateError;
        console.log('   - User privileges updated successfully.');
      } else {
        console.log('   - User exists in public.users and is already an admin.');
      }
    } else {
      console.log('   - User not found in public.users. Creating admin entry...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: authUser.id, email: authUser.email!, is_admin: true });
      if (insertError) throw insertError;
      console.log('   - Admin entry created successfully.');
    }

    console.log('\n🎉 Admin user setup complete!');
    console.log('   You can now log in to the admin panel with:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword} (if user was newly created)`);
    console.log('');
    console.log(`🔗 Admin Panel URL: http://localhost:3000/admin/login`);

  } catch (error) {
    console.error('❌ An unexpected error occurred:', (error as Error).message);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

if (args.length > 0 && !email?.includes('@')) {
  console.log('📖 Usage:');
  console.log('   npm run create-admin                    # Create default admin (admin@autoluxe.com)');
  console.log('   npm run create-admin <email> <password> # Create custom admin user');
  console.log('');
  console.log('📝 Examples:');
  console.log('   npm run create-admin');
  console.log('   npm run create-admin john@autoluxe.com mySecurePassword123');
  console.log('');
  console.log('⚠️  Note: Only @autoluxe.com email addresses are allowed');
  process.exit(1);
}

createAdminUser(email, password).catch(e => console.error(e.message)); 