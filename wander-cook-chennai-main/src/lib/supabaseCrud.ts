// Supabase CRUD functions for all main tables
import { supabase } from './supabaseClient';

// Recipes
export async function createRecipe(data) {
  return supabase.from('recipes').insert([data]);
}
export async function updateRecipe(id, data) {
  return supabase.from('recipes').update(data).eq('id', id);
}
export async function deleteRecipe(id) {
  return supabase.from('recipes').delete().eq('id', id);
}

// Ingredients
export async function createIngredient(data) {
  return supabase.from('ingredients').insert([data]);
}
export async function updateIngredient(id, data) {
  return supabase.from('ingredients').update(data).eq('id', id);
}
export async function deleteIngredient(id) {
  return supabase.from('ingredients').delete().eq('id', id);
}

// Recipe Ingredients (many-to-many)
export async function createRecipeIngredient(data) {
  return supabase.from('recipe_ingredients').insert([data]);
}
export async function updateRecipeIngredient(id, data) {
  return supabase.from('recipe_ingredients').update(data).eq('id', id);
}
export async function deleteRecipeIngredient(id) {
  return supabase.from('recipe_ingredients').delete().eq('id', id);
}

// Stores
export async function createStore(data) {
  return supabase.from('stores').insert([data]);
}
export async function updateStore(id, data) {
  return supabase.from('stores').update(data).eq('id', id);
}
export async function deleteStore(id) {
  return supabase.from('stores').delete().eq('id', id);
}

// Favorites
export async function createFavorite(data) {
  return supabase.from('favorites').insert([data]);
}
export async function updateFavorite(id, data) {
  return supabase.from('favorites').update(data).eq('id', id);
}
export async function deleteFavorite(id) {
  return supabase.from('favorites').delete().eq('id', id);
}
