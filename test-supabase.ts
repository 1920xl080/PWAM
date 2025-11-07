import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env file (for Node.js environment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

// Get environment variables (Node.js uses process.env)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please check your .env file has:');
  console.error('  VITE_SUPABASE_URL=...');
  console.error('  VITE_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...\n');

    // Test 1: Fetch challenges
    const { data: challenges, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .limit(5);
    
    if (challengeError) throw challengeError;
    
    console.log('✅ Supabase connection successful!');
    console.log(`📊 Found ${challenges?.length || 0} challenges in database\n`);

    if (challenges && challenges.length > 0) {
      console.log('Sample challenges:');
      challenges.forEach((challenge) => {
        console.log(`  - [${challenge.id}] ${challenge.title} (${challenge.difficulty})`);
      });
    } else {
      console.log('⚠️  No challenges found. Run the INSERT SQL from Step 8 of the guide.');
    }

    console.log('\n✅ Test completed successfully!');
    console.log('You can now delete this test file: rm test-supabase.ts');

  } catch (error) {
    console.error('❌ Supabase connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
