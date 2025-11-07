// import { createClient } from '@supabase/supabase-js';
// // Import dotenv for Node.js support (automatically ignored by Vite)
// import 'dotenv/config';

// // Get environment variables - Universal approach
// // Works in both Vite (import.meta.env) and Node.js (process.env)
// const getEnvVar = (key: string): string => {
//   // Try Vite environment first (browser/dev server)
//   if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
//     return import.meta.env[key] as string;
//   }
//   // Fallback to Node.js environment (tsx/scripts)
//   if (typeof process !== 'undefined' && process.env[key]) {
//     return process.env[key] as string;
//   }
//   return '';
// };

// const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
// const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// // Validate environment variables
// if (!supabaseUrl || !supabaseAnonKey) {
//   const context = typeof import.meta !== 'undefined' ? 'Vite' : 'Node.js';
//   throw new Error(
//     `Missing Supabase environment variables (running in ${context}). ` +
//     'Please check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined. ' +
//     'See guidelines/03-SupabaseSetup.md for setup instructions.'
//   );
// }
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure your .env file exists and contains:\n' +
    '  VITE_SUPABASE_URL=your-url-here\n' +
    '  VITE_SUPABASE_ANON_KEY=your-key-here\n' +
    'Then restart the dev server: npm run dev'
  );
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// TypeScript Types for Database Tables
// ============================================

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  total_points: number;
  created_at: string;
};

export type UserChallengeSubmission = {
  id: string;
  user_id: string;
  challenge_id: string;
  score: number;
  submitted_at: string;
};

export type EnrolledClass = {
  id: string;
  user_id: string;
  class_name: string;
  faculty: string;
  enrolled_at: string;
};

// ============================================
// Database Helper Functions
// ============================================

/**
 * Fetch all challenges from the database
 */
export async function getAllChallenges() {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }

  return data as Challenge[];
}

/**
 * Fetch user's submissions
 */
export async function getUserSubmissions(userId: string) {
  const { data, error } = await supabase
    .from('user_challenge_submissions')
    .select(`
      *,
      challenges (
        id,
        title,
        category,
        difficulty,
        total_points
      )
    `)
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }

  return data;
}

/**
 * Submit a challenge score
 */
export async function submitChallengeScore(
  userId: string,
  challengeId: string,
  score: number
) {
  const { data, error } = await supabase
    .from('user_challenge_submissions')
    .upsert(
      {
        user_id: userId,
        challenge_id: challengeId,
        score: score,
      },
      {
        onConflict: 'user_id,challenge_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error submitting score:', error);
    throw error;
  }

  return data;
}

/**
 * Get user's enrolled classes
 */
export async function getUserEnrolledClasses(userId: string) {
  const { data, error } = await supabase
    .from('enrolled_classes')
    .select('*')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrolled classes:', error);
    return [];
  }

  return data as EnrolledClass[];
}

/**
 * Enroll user in a class
 */
export async function enrollInClass(
  userId: string,
  className: string,
  faculty: string
) {
  const { data, error } = await supabase
    .from('enrolled_classes')
    .insert({
      user_id: userId,
      class_name: className,
      faculty: faculty,
    })
    .select()
    .single();

  if (error) {
    console.error('Error enrolling in class:', error);
    throw error;
  }

  return data;
}
