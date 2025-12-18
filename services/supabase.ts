import { createClient } from '@supabase/supabase-js';

// Note: In a real environment, these would be process.env.VITE_SUPABASE_URL
// For this generated code to run immediately without keys, we will implement a hybrid mock/real approach.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Supabase Config:', {
  URL: SUPABASE_URL,
  HasKey: !!SUPABASE_ANON_KEY,
  KeyLen: SUPABASE_ANON_KEY?.length
});

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Mock Service for Demo Mode (since user likely won't have keys immediately)
export const mockAuthService = {
  login: async (email: string, role: 'admin' | 'reseller') => {
    return new Promise<{ user: any, error: any }>((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 'mock-user-id-' + Math.random(),
            email,
            role, // In real Supabase, this is in a separate 'profiles' table
          },
          error: null
        });
      }, 800);
    });
  }
};