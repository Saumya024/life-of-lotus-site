// Supabase Client Initialization
// Import Supabase from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase configuration
const SUPABASE_URL = 'https://mdrlglvqmxirqadyztnl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bVSvMfBW6qGDTdpuGVNWdg_yv_Ryc-O';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export the client
export default supabase;

