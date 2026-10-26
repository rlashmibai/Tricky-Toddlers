export interface GeneratedRecipe {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  prepTime: string;
  cookTime: string;
  textureGuide: string;
  ingredients: string[];
  instructions: string[];
  nutritionBenefits: string;
  safetyAlerts: string;
}

export interface AIRecipeBatchRecord {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  childAgeYears: string;
  ingredientsInput: string;
  recipes: GeneratedRecipe[];
}

const STORAGE_KEY = 'tt_ai_baby_recipe_history_v2';

export const INITIAL_RECIPE_HISTORY: AIRecipeBatchRecord[] = [
  {
    id: 'batch-init-1',
    date: 'Oct 4, 2026',
    time: '09:15 AM',
    timestamp: Date.now() - 86400000,
    childAgeYears: '1.5 Years',
    ingredientsInput: 'banana, rolled oats, cardamom, cow milk',
    recipes: [
      {
        id: 'rec-init-1a',
        name: 'Creamy Cardamom Banana Oat Porridge',
        mealType: 'Breakfast',
        prepTime: '5 mins',
        cookTime: '8 mins',
        textureGuide: 'Warm, soft, easily spoonable oatmeal mash with natural banana sweetness.',
        ingredients: [
          '3 tbsp rolled oats (lightly roasted)',
          '1 ripe Robusta or Elaichi banana (mashed)',
          '1/2 cup warm whole milk or fortified water',
          'A tiny pinch of elaichi (cardamom) powder',
          '1/2 tsp pure cow ghee'
        ],
        instructions: [
          'Roast rolled oats in 1/2 tsp ghee for 1-2 minutes until aromatic.',
          'Add warm milk/water and simmer on low flame for 5 minutes, stirring continuously until soft.',
          'Fold in the mashed banana and a pinch of fragrant cardamom powder.',
          'Turn off flame, allow to cool down to lukewarm child-safe temperature, and serve.'
        ],
        nutritionBenefits: 'Rich in soluble beta-glucan fiber for digestive ease, potassium for heart & muscle function, and healthy ghee fats for brain lipid development.',
        safetyAlerts: 'Always test temperature on your wrist before feeding. No added white sugar needed as ripe banana provides wholesome natural sweetness.'
      },
      {
        id: 'rec-init-1b',
        name: 'Gentle Moong Dal Banana Comfort Khichdi',
        mealType: 'Lunch',
        prepTime: '10 mins',
        cookTime: '15 mins',
        textureGuide: 'Soft-boiled, well-mashed creamy grains with gentle digestive cumin tempering.',
        ingredients: [
          '2 tbsp yellow moong dal (washed & soaked)',
          '2 tbsp brown or sonamasuri rice',
          '1/4 raw Kerala nendran banana or raw plantain (peeled & diced small)',
          '1.5 cups water',
          'A pinch of roasted jeera (cumin) powder',
          '1/2 tsp A2 cow ghee'
        ],
        instructions: [
          'Pressure cook soaked moong dal, rice, and raw banana pieces with 1.5 cups water for 4 whistles until very soft.',
          'Open cooker after pressure drops, mash thoroughly with a wooden ladle until smooth and creamy.',
          'In a small ladle, warm 1/2 tsp ghee with a tiny pinch of jeera powder and pour over the mash.',
          'Mix well and serve lukewarm.'
        ],
        nutritionBenefits: 'Easily absorbable plant protein from moong dal, steady slow-burning carbohydrates from rice, and potassium & prebiotic resistant starch from plantain.',
        safetyAlerts: 'Ensure moong dal grains are completely soft and mashed without hard lumps to prevent gagging.'
      },
      {
        id: 'rec-init-1c',
        name: 'Golden Banana Oat Finger Pancakes',
        mealType: 'Snack',
        prepTime: '5 mins',
        cookTime: '6 mins',
        textureGuide: 'Pillowy-soft, tender finger strips that a toddler can easily hold and gum.',
        ingredients: [
          '1 ripe sweet banana',
          '1/4 cup powdered rolled oats',
          '1 tbsp whole wheat flour (atta)',
          '2-3 tbsp milk or water (to adjust batter consistency)',
          '1/4 tsp ghee for greasing tava'
        ],
        instructions: [
          'Mash banana smoothly in a bowl with a fork until lump-free.',
          'Add powdered oats, whole wheat flour, and milk to form a thick, spoonable pancake batter.',
          'Heat a flat non-stick or cast-iron tava, lightly grease with ghee.',
          'Drop 2 tablespoons of batter to form mini silver-dollar pancakes. Cook on low flame for 2 mins per side until golden.',
          'Cut into finger-sized strips for easy toddler self-feeding.'
        ],
        nutritionBenefits: 'Excellent for toddler pincer grasp and self-feeding confidence, with sustained energy from complex oats and wheat.',
        safetyAlerts: 'Always supervise toddler while self-feeding finger foods. Ensure pancakes are tender and moist, not dry or crispy.'
      }
    ]
  },
  {
    id: 'batch-init-2',
    date: 'Oct 3, 2026',
    time: '04:30 PM',
    timestamp: Date.now() - 172800000,
    childAgeYears: '2.0 Years',
    ingredientsInput: 'carrots, green peas, paneer, turmeric',
    recipes: [
      {
        id: 'rec-init-2a',
        name: 'Golden Carrot Paneer Toddler Cheela',
        mealType: 'Breakfast',
        prepTime: '8 mins',
        cookTime: '7 mins',
        textureGuide: 'Soft, melt-in-mouth savory crepe loaded with finely grated veggies.',
        ingredients: [
          '3 tbsp besan (gram flour)',
          '2 tbsp grated fresh malai paneer',
          '2 tbsp finely grated tender red carrot',
          'A pinch of haldi (turmeric) & cumin',
          'Ghee for light pan roasting'
        ],
        instructions: [
          'Whisk besan with water into a smooth batter.',
          'Fold in grated paneer, finely grated carrot, turmeric, and cumin.',
          'Pour onto hot greased tava and cook on low heat until tender on both sides.',
          'Roll up and cut into bite-sized wheels.'
        ],
        nutritionBenefits: 'High biological value protein and calcium from fresh paneer, plus beta-carotene for immune and eyesight health.',
        safetyAlerts: 'Ensure carrots are very finely grated so there are no raw crunchy shards.'
      },
      {
        id: 'rec-init-2b',
        name: 'Velvety Carrot Green Pea Dalia Khichdi',
        mealType: 'Lunch',
        prepTime: '10 mins',
        cookTime: '15 mins',
        textureGuide: 'Rich, comforting grain bowl with mashed sweet green peas.',
        ingredients: [
          '3 tbsp broken wheat (dalia)',
          '2 tbsp green peas (steamed and crushed)',
          '1/2 carrot (diced and steamed soft)',
          '1 tbsp crumbled paneer',
          '1/2 tsp ghee'
        ],
        instructions: [
          'Pressure cook dalia, crushed peas, and carrot with 1.25 cups water for 3 whistles.',
          'Mash lightly, fold in crumbled paneer and ghee.',
          'Check temperature and serve.'
        ],
        nutritionBenefits: 'Packed with dietary fiber, iron, calcium, and plant proteins.',
        safetyAlerts: 'Always crush or flatten whole green peas before cooking for toddlers to eliminate round choking hazard.'
      },
      {
        id: 'rec-init-2c',
        name: 'Sweet Carrot Paneer Soft Bites',
        mealType: 'Snack',
        prepTime: '10 mins',
        cookTime: '5 mins',
        textureGuide: 'Delicate, tender bite-sized cubes lightly sautéed in aromatic ghee.',
        ingredients: [
          '1/2 cup fresh paneer cubes (steamed soft)',
          '1/4 cup carrot puree',
          'Tiny pinch of cinnamon powder',
          '1/2 tsp cow ghee'
        ],
        instructions: [
          'Warm ghee in a small pan, toss paneer cubes gently with carrot puree and cinnamon for 3 minutes.',
          'Let cool to room temperature before serving on a toddler plate.'
        ],
        nutritionBenefits: 'Calcium dense for strong teeth and bones with natural vitamin A.',
        safetyAlerts: 'Cut cubes to toddler bite sizes (approx. 1 cm).'
      }
    ]
  }
];

export const getSavedRecipeHistory = (): AIRecipeBatchRecord[] => {
  if (typeof window === 'undefined') return INITIAL_RECIPE_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECIPE_HISTORY));
      return INITIAL_RECIPE_HISTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_RECIPE_HISTORY;
  } catch (err) {
    console.error('Error loading AI recipe history:', err);
    return INITIAL_RECIPE_HISTORY;
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
