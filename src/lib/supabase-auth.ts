import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return user;
};

export const getIdToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error('No active session');
  }
  return session.access_token;
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

export const isValidAdminEmail = (email: string): boolean => {
  return email.endsWith('@esrentals.com');
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    return userData?.is_admin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 