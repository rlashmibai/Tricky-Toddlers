export interface RecipeSourceLink {
  title: string;
  uri: string;
}

export interface GeneratedRecipe {
  id: string;
  name: string;
  summary?: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snack' | 'Quick Snack' | 'Dinner' | 'Dessert' | string;
  prepTime: string;
  cookTime: string;
  textureGuide: string;
  ingredients: string[];
  instructions: string[];
  nutritionBenefits: string;
  safetyAlerts: string;
  sources?: RecipeSourceLink[];
}

export interface AIRecipeBatchRecord {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  childAgeYears: string;
  ingredientsInput: string;
  recipes: GeneratedRecipe[];
  sources?: RecipeSourceLink[];
}

const STORAGE_KEY = 'tt_ai_baby_recipe_history_v2';

export const RECIPE_HISTORY_RESET_FLAG = 'tt_ai_recipe_fresh_start_2026_11_27';

export const INITIAL_RECIPE_HISTORY: AIRecipeBatchRecord[] = [];

export const ensureFreshRecipeHistory = (): void => {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(RECIPE_HISTORY_RESET_FLAG) !== '1') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(RECIPE_HISTORY_RESET_FLAG, '1');
    }
  } catch {
    // ignore storage errors
  }
};

export const getSavedRecipeHistory = (): AIRecipeBatchRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    ensureFreshRecipeHistory();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error loading AI recipe history:', err);
    return [];
  }
};

export const saveRecipeBatch = (record: AIRecipeBatchRecord): AIRecipeBatchRecord[] => {
  if (typeof window === 'undefined') return [record];
  try {
    const existing = getSavedRecipeHistory();
    // Prepend new batch to front
    const updated = [record, ...existing.filter(r => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving AI recipe batch:', err);
    return [record];
  }
};

export const deleteRecipeBatch = (id: string): AIRecipeBatchRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedRecipeHistory();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting recipe batch:', err);
    return [];
  }
};

export const clearAllRecipeHistory = (): AIRecipeBatchRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (err) {
    console.error('Error clearing recipe history:', err);
    return [];
  }
};
