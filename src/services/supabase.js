import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from '@env';

console.log(SUPABASE_URL);

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;

// Create a Supabase client instance with authentication settings
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})