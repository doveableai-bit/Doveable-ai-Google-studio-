import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../types';

const DEFAULT_COINS = 100;

/**
 * Fetches a user's profile. If it doesn't exist, it creates one with a default coin balance.
 * This is crucial for new sign-ups.
 */
export const getProfile = async (user: User): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile does not exist, create it
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: user.id, email: user.email, coins: DEFAULT_COINS })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw insertError;
    }
    return newProfile;
  } else if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data;
};

/**
 * Updates the coin balance for a specific user.
 */
export const updateCoins = async (userId: string, newCoinBalance: number): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ coins: newCoinBalance })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating coins:', error);
    throw error;
  }
  return data;
};

/**
 * Fetches all user profiles. Intended for admin use only.
 * Assumes RLS is set up to protect this endpoint.
 */
export const getAllProfiles = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all profiles:', error);
        throw error;
    }

    return data;
}
