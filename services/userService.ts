import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../types';

const DEFAULT_FREE_COINS = 10;

/**
 * Fetches a user's profile, creating it if it doesn't exist.
 * This function also contains the core logic to grant daily free coins.
 * It checks if a user is subscribed and if their last free coin grant was yesterday.
 */
export const getProfile = async (user: User): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile does not exist, create it with a fresh set of daily coins.
    const now = new Date().toISOString();
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ 
          id: user.id, 
          email: user.email, 
          free_coins: DEFAULT_FREE_COINS,
          purchased_coins: 0,
          last_free_coin_grant: now,
          is_subscribed: false
      })
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

  // Profile exists, check if we need to grant daily coins.
  const profile: UserProfile = data;
  const now = new Date();
  const lastGrant = profile.last_free_coin_grant ? new Date(profile.last_free_coin_grant) : new Date(0);
  
  // Grant coins if user is not subscribed AND the last grant was on a different day in the user's local time.
  if (!profile.is_subscribed && now.toLocaleDateString() !== lastGrant.toLocaleDateString()) {
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        free_coins: DEFAULT_FREE_COINS,
        last_free_coin_grant: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (updateError) {
        console.error('Error granting daily coins:', updateError);
        // Don't block, just return the old profile
        return profile;
    }
    return updatedProfile;
  }

  return profile;
};

/**
 * Spends one coin for the user. It prioritizes free coins before purchased coins.
 */
export const spendCoin = async (userId: string, currentFree: number, currentPurchased: number): Promise<Partial<UserProfile>> => {
    let updateData: Partial<UserProfile> = {};
    if (currentFree > 0) {
        updateData = { free_coins: currentFree - 1 };
    } else if (currentPurchased > 0) {
        updateData = { purchased_coins: currentPurchased - 1 };
    } else {
        throw new Error("Insufficient coins.");
    }

    const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
    
    if (error) {
        console.error("Error spending coin:", error);
        throw error;
    }
    return data;
}

/**
 * Updates the purchased coin balance for a specific user (admin action).
 */
export const updatePurchasedCoins = async (userId: string, newCoinBalance: number): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ purchased_coins: newCoinBalance })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating purchased coins:', error);
    throw error;
  }
  return data;
};

/**
 * Updates the subscription status for a specific user (admin action).
 */
export const updateSubscriptionStatus = async (userId: string, isSubscribed: boolean): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_subscribed: isSubscribed })
      .eq('id', userId)
      .select()
      .single();
  
    if (error) {
      console.error('Error updating subscription status:', error);
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