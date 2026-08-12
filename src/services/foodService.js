import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';

/**
 * Compress image on client-side before uploading.
 */
export async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.warn('Image compression fallback:', error);
    return file;
  }
}

/**
 * Upload single image to Supabase Storage bucket 'food-images'
 */
export async function uploadFoodImage(file, userId) {
  const compressedFile = await compressImage(file);
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('food-images')
    .upload(fileName, compressedFile, { cacheControl: '3600', upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('food-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Fetch all food logs for current logged-in user
 */
export async function fetchFoodLogs() {
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .order('dining_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create a new food log
 */
export async function createFoodLog(logData) {
  const { data, error } = await supabase
    .from('food_logs')
    .insert([logData])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Delete a food log by ID
 */
export async function deleteFoodLog(id) {
  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
